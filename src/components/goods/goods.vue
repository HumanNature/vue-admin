<template>
  <div class="box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/params' }"
        >商品管理</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/params' }"
        >商品列表</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :getter="20">
        <!-- 搜索功能 -->
        <el-col :span="6"
          ><el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="init"
          >
            <el-button
              @click="init"
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <!-- 添加商品 -->
        <el-col :span="4">
          <el-button class="add_user" type="primary" @click="addGoods()"
            >添加商品</el-button
          >
          <el-dialog
            title="添加商品"
            :visible.sync="addUserdialog"
            width="40%"
            @click="addUserdialog = false"
            :close-on-click-modal="false"
          >
          </el-dialog>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column width="100px" prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column width="75px" prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column width="155px" prop="add_time" label="创建时间">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column width="130px" label="操作">
          <template v-slot="scope">
            <!-- <el-switch v-model="scope.row.mg_state"></el-switch> -->
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="showGoodsDialog(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="deleteGoods(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
            <!-- 修改用户的对话框 -->
            <el-dialog
              title="修改用户"
              :visible.sync="alterUserdialog"
              width="50%"
              @close="alterUserdialogClose"
            >
              <!-- <el-form
                :model="alterForm"
                :rules="alterFormRules"
                ref="alterForm"
                label-width="100px"
                class="demo-alterForm"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input
                    disabled
                    v-model.trim="alterForm.username"
                  ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model.trim="alterForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                  <el-input v-model.trim="alterForm.mobile"></el-input>
                </el-form-item>
              </el-form> -->

              <span slot="footer" class="dialog-footer">
                <el-button @click="alterUserdialog = false">取 消</el-button>
                <el-button type="primary" @click="alterUserForm(scope.row)"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
            <!-- 分配角色的对话框 -->
            <el-dialog
              title="分配角色"
              :visible.sync="setRoleDialogVisible"
              width="30%"
              @close="serRoleDialogClose()"
            >
              <span>这是一段信息</span>
              <p>当前的用户：{{ userInfo.username }}</p>
              <p>当前的角色：{{ userInfo.role_name }}</p>
              <!-- <pre>{{rolesList}}</pre> -->
              <p>
                分配新角色:
                <el-select v-model="selectedRoleId" placeholder="请选择">
                  <el-option
                    v-for="item in rolesList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </p>
              <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="setRoleInfo()"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoods, deleteIDGoods } from "../../network/goods/goods";
export default {
  props: {},
  data() {
    return {
      queryInfo: {
        //列表
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [], //用户列表
      mg_state: null, //switch
      total: 0,
      addUserdialog: false, //添加用户对话框开关
      ruleForm: {
        username: "qweqwe",
        password: "qwewqwq",
        email: "qweqwe@qe.qe",
        mobile: "18888888888",
      },
      alterUserdialog: false,
      alterForm: {},
      setRoleDialogVisible: false, //分配角色对话框的开关
      userInfo: {}, //分配角色的用户信息
      rolesList: [], //所有角色数据列表
      selectedRoleId: "", //已选择的id值
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
      getGoods(this.queryInfo).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        console.log(res);
        this.goodsList = res.data.goods;
        this.total = res.data.total;
        this.$message.success(res.meta.msg);
      });
    },

    handleSizeChange(e) {
      this.queryInfo.pagesize = e;
      this.init();
    },
    handleCurrentChange(e) {
      this.queryInfo.pagenum = e;
      this.init();
    },
    alterUserdialogClose() {
      console.log(1);
    },
    showGoodsDialog(row) {
      console.log(row);
    }, //打开编辑对话框
    addGoods() {
      this.$router.push("goods/add");
    }, //添加商品 跳转到add组件
    deleteGoods(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteIDGoods(row).then((res) => {
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg);
            }
            console.log(res);
            this.init;
            this.$message.success(res.meta.msg);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }, //删除商品
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
.add_user {
  margin-left: 20px;
}

.el-table .cell {
  white-space: nowrap;
  width: fit-content;
}
</style>