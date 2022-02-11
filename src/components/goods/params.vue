<template>
  <div class="box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/params' }"
        >商品管理</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/params' }"
        >分类参数</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 警告词条 -->
      <el-row>
        <el-col :span="24">
          <el-alert
            :closable="false"
            title="注意：只允许为第三级分类设置相关参数"
            type="warning"
            show-icon
          >
          </el-alert>
        </el-col>
      </el-row>
      <el-row class="selects">
        <el-col :span="6">
          <div class="selects_box">
            <span style="flex: 1; font-size: 15px">选择商品分类：</span>
            <el-cascader
              style="flex: 2"
              v-model="selectedCateKeys"
              :options="paramsList"
              :props="paramsProps"
              @change="paramsChange"
            ></el-cascader>
          </div>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick()">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-col :span="24">
              <el-button
                :disabled="isBtnDisabld"
                type="primary"
                size="mini"
                @click="DialogOpan()"
              >
                添加参数
              </el-button>
            </el-col>
          </el-row>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item1, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="TagClose(scope.row, index)"
                  >{{ item1 }}</el-tag
                >
                <!-- 动态添加tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
                <!-- <pre> {{ scope.row }}</pre> -->
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>

            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column prop="mobile" label="操作">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-edit"
                  @click="delDialog(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          动态参数
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col :span="24">
              <el-button
                :disabled="isBtnDisabld"
                type="primary"
                size="mini"
                @click="DialogOpan()"
              >
                添加属性
              </el-button>
            </el-col>
          </el-row>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"> </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>

            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column prop="mobile" label="操作">
              <template v-slot="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-edit"
                  @click="delDialog(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          静态属性</el-tab-pane
        >
        <!-- 动态参数的对话框 -->
        <el-dialog
          :title="'添加' + titleText"
          :visible.sync="manyDialog"
          @close="manyDialogClosed"
          width="50%"
        >
          <el-form
            :model="addForm"
            :rules="manyRules"
            ref="addFormRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="manyDialog = false">取 消</el-button>
            <el-button type="primary" @click="addParams()">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改参数的对话框 -->
        <el-dialog
          :title="'修改' + titleText"
          :visible.sync="editDialog"
          @close="editDialogClosed"
          width="50%"
        >
          <el-form
            :model="editForm"
            :rules="editRules"
            ref="editFormRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialog = false">取 消</el-button>
            <el-button type="primary" @click="editParams()">确 定</el-button>
          </span>
        </el-dialog>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {
  getCategories,
  getCategoriesList,
  addAttributes,
  getIDParam,
  putIDParam,
  deleteParam,
} from "../../network/goods/categories";
export default {
  props: {},
  data() {
    return {
      activeName: "many",
      paramsList: [],
      paramsProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedCateKeys: [], //选中的值
      // iscate: true, //添加按钮禁用的开关
      paramsTableLists: [], //表格列表
      manyTableData: [], //动态参数的数据
      onlyTableData: [], //静态属性的数据
      manyDialog: false, //添加对话框的开关
      addForm: {
        attr_name: "",
      }, //添加对话框的表单
      manyRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
      }, //添加对话框的表单规则
      editDialog: false, //修改对话框的开关
      editForm: {}, //修改对话框的表单
      editRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
      }, //修改对话框的表单规则
      inputVisible: false, //控制添加tag输入框的开关
      inputValue: "", //输入框输入的值
    };
  },

  components: {},

  computed: {
    isBtnDisabld() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //当前选中的三级分类的Id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },

  beforeMount() {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      getCategories().then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        console.log(res);
        this.paramsList = res.data;
        // this.total = res.data.total;
        this.$message.success(res.meta.msg);
      });
    },
    //tab页签的点击事件
    handleTabClick() {
      console.log(this.activeName);
      // 切换后获取参数
      this.getParamsData();
    },
    //选中级联选择框的参数
    paramsChange() {
      this.getParamsData();
    },
    //获取参数的列表数据
    getParamsData() {
      //判断选中是哪一级分类
      if (this.selectedCateKeys.length != 3) {
        this.selectedCateKeys = [];
        return;
      } else {
        console.log(1);
      }
      console.log(this.selectedCateKeys);
      console.log(this.cateId, this.activeName);
      getCategoriesList(this.cateId, this.activeName).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        console.log(res);
        //对数据的attr_vals进行操作
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals
            ? (item.attr_vals = item.attr_vals.split(" "))
            : [];
          item.inputVisible = false;
          item.inputValue = "";
        });
        console.log(res.data);
        if (this.activeName == "many") {
          this.manyTableData = res.data;
        } else if (this.activeName == "only") {
          this.onlyTableData = res.data;
        }
        // this.paramsList = res.data;
        // this.total = res.data.total;
        this.$message.success(res.meta.msg);
      });
    },
    //展开添加添加参数或属性对话框
    DialogOpan() {
      this.manyDialog = true;
    },
    //监听关闭添加参数对话框事件
    manyDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //确认添加参数或属性
    addParams() {
      this.$refs.addFormRef.validate((value) => {
        if (!value) return;

        let a = {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        };
        // console.log(a);
        console.log(this.cateId, a);
        addAttributes(this.cateId, a).then((res) => {
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
          }
          console.log(res);
          this.getParamsData();
          this.manyDialog = false;

          this.$message.success(res.meta.msg);
        });
      });
    },
    //操作
    // 修改的对话框
    showEditDialog(e) {
      this.editDialog = true;
      // console.log(e);
      let a = {
        attr_sel: this.activeName,
      };
      console.log(this.cateId, e, a);
      getIDParam(this.cateId, e, a).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        console.log(res);
        this.editForm = res.data;
        console.log(this.editForm);
        this.$message.success(res.meta.msg);
      });
    },
    // 修改的对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改的对话框的确定事件
    editParams() {
      // console.log(e);
      // console.log(e.attr_id);
      console.log(1);

      putIDParam(this.cateId, this.editForm.attr_id, {
        attr_name: this.editForm.attr_name,
        attr_sel: this.activeName,
      }).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        console.log(res);
        this.getParamsData();
        this.editDialog = false;
        this.$message.success(res.meta.msg);
      });
    },
    //操作
    delDialog(e) {
      console.log(e);
      console.log(this.cateId, e);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteParam(this.cateId, e).then((res) => {
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg);
            }
            console.log(res);
            this.getParamsData();
            this.$message.success(res.meta.msg);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //tag相关
    showInput(row) {
      row.inputVisible = true;
      console.log(row.attr_id);
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }, //输入框的开关事件
    TagClose(row, index) {
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    }, //tag关闭事件
    saveAttrVals(row) {
      console.log(row.attr_vals);
      if (row.inputValue == "") {
        console.log("输入值为空");
      } else {
        row.attr_vals.push(row.inputValue.trim());
        putIDParam(this.cateId, row.attr_id, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }).then((res) => {
          console.log(res);
        });
        row.inputVisible = false;
        row.inputValue = "";
      }
    }, //对attr_vals的操作保存到数据库
    handleInputConfirm(row) {
      console.log(row.inputValue.trim().length);
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = "";
      }
      this.saveAttrVals(row);
    }, //添加tag事件
  },

  watch: {},
};
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 20px;
  font-size: 0.2rem;
}
.el-pagination {
  margin-top: 20px;
}
.zktable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
.selects {
  margin-top: 15px;
  display: flex;
}
.selects_box {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.button-new-tag {
  margin-left: 10px;
}
</style>