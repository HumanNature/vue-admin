<template>
  <div class="box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/categories' }"
        >商品管理</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/categories' }"
        >商品分类</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-row>
        <el-col :span="12">
          <el-button type="primary" size="default" @click="CategoriesDoalog()"
            >添加分类</el-button
          >
        </el-col>
        <el-dialog
          title="添加分类"
          :visible.sync="setCategoriesdata"
          width="30%"
        >
          <el-form
            :model="addCateForm"
            :rules="addCateRules"
            ref="addCateFormRef"
            label-width="100px"
            class="demo-ruleForm"
            @cloes="addCateDialogClosed"
          >
            <el-form-item label="分类名称：" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
              <!-- <pre>{{parentCateList}}</pre> -->
              <el-cascader
                clearable
                v-model="selectedKeys"
                :options="parentCateList"
                :props="cascaderProps"
                @change="cateChange()"
              ></el-cascader>
              <!-- <el-select
                v-model="addCateForm.region"
                placeholder="请选择活动区域"
              >
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select> -->
            </el-form-item>
            <span>父级分类先选第一级再选第二级</span>
          </el-form>
          <!-- <span>这是一段信息</span> -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="setCategoriesdata = false">取 消</el-button>
            <el-button type="primary" @click="addCate()">确 定</el-button>
          </span>
        </el-dialog>
      </el-row>
      <!-- 表格 -->
      <zk-table
        class="zktable"
        :data="categoriesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :border="true"
        :stripe="false"
        :show-row-hover="true"
      >
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
            class="el-icon-success"
          ></i>
          <i
            style="color: lightred"
            v-else-if="scope.row.cat_deleted === true"
            class="el-icon-error"
          ></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            type="success"
            >二级</el-tag
          >
          <el-tag
            size="mini"
            v-else-if="scope.row.cat_level === 2"
            type="danger"
            >三级</el-tag
          >
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="add(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="bdd(scope.row)"
            >删除</el-button
          >
        </template>
      </zk-table>
      <!-- 分页区域 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querInfo.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="querInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getCategories,
  postCategories,
  putIDCategories,
  deleteIDCategories,
} from "../../network/goods/categories";
export default {
  props: {},
  data() {
    return {
      categoriesList: [], //分类数据列表
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0, //总数据条数
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      setCategoriesdata: false, //添加分类对话框的开关
      addCateForm: {
        //添加商品表单
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      addCateRules: {
        //添加商品的规则
        name: [
          { required: true, message: "请输入分类的名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      parentCateList: [], //父级分类列表
      cascaderProps: {
        checkStrictly: "true",
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKeys: [], //选中的父级分类id数组
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      getCategories(this.querInfo).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        this.categoriesList = res.data.result;
        this.total = res.data.total;
        this.$message.success(res.meta.msg);
      });
      //   postCategories(this.querInfo).then((res) => {
      //     console.log(res);
      //     if (res.meta.status !== 200) {
      //       this.$message.error(res.meta.msg);
      //     }
      //     // this.categoriesList = res.data;
      //     this.$message.success(res.meta.msg);
      //   });
    },
    //监听pagesize变化
    handleSizeChange(val) {
      this.querInfo.pagesize = val;
      this.init();
      console.log(`每页 ${val} 条`);
    },
    //监听pagenum变化
    handleCurrentChange(val) {
      this.querInfo.pagenum = val;
      this.init();
      console.log(`当前页: ${val}`);
    },
    //打开添加分类的对话框
    CategoriesDoalog() {
      this.setCategoriesdata = true;
      let a = { type: 2 };
      getCategories(a).then((res) => {
        console.log(1111111);
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        this.parentCateList = res.data;
        this.$message.success(res.meta.msg);
      });
    },
    //父级分类数据发生变化
    cateChange() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        //父级分类的Id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    //添加分类确认
    addCate() {
      console.log(this.addCateForm);
      postCategories(this.addCateForm).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        // this.categoriesList = res.data.result;
        // this.total = res.data.total;

        this.$message.success(res.meta.msg);
        this.init();
        this.setCategoriesdata = false;
      });
    },
    // 监听表单关闭事件
    addCateDialogClosed() {
      //重置表单
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_name = "";
    },
    add(e) {
      console.log(e);
      console.log(e.cat_name);
      this.$prompt("请输入要修改的名称", "修改名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          putIDCategories(e.cat_id, value).then((res) => {
            console.log(res);
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg);
            }
            this.$message.success(res.meta.msg);
            this.init();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    bdd(e) {
      console.log(e);
      console.log(e.cat_id);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteIDCategories(e.cat_id).then((res) => {
            console.log(res);
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg);
            }
            this.$message.success(res.meta.msg);
            this.init();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
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
</style>