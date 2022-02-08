<template>
  <div class="box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
        <!-- 添加用户 -->
        <el-col :span="4">
          <el-button
            class="add_user"
            type="primary"
            @click="addUserdialog = true"
            >添加用户</el-button
          >
          <el-dialog
            title="添加用户"
            :visible.sync="addUserdialog"
            width="40%"
            @click="addUserdialog = false"
            :close-on-click-modal="false"
            @close="resetForm"
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model.trim="ruleForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  type="password"
                  v-model.trim="ruleForm.password"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model.trim="ruleForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model.trim="ruleForm.mobile"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')"
                  >立即创建</el-button
                >
                <el-button @click="resetForm()">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="create_time" label="登录时间"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="switchChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="权限"> </el-table-column>
        <el-table-column label="操作">
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
                @click="showModifyDialog(scope.row.id)"
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
                @click="deleteUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色 "
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                icon="el-icon-setting"
                type="warning"
              ></el-button>
            </el-tooltip>
            <!-- 修改用户的对话框 -->
            <el-dialog
              title="修改用户"
              :visible.sync="alterUserdialog"
              width="50%"
              @close="alterUserdialogClose"
            >
              <el-form
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
              </el-form>

              <span slot="footer" class="dialog-footer">
                <el-button @click="alterUserdialog = false">取 消</el-button>
                <el-button type="primary" @click="alterUserForm()"
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
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getUsers,
  putSwitch,
  postUsers,
  getIDUsers,
  putIDUsers,
  deleteIDUsers,
} from "../../network/users";
export default {
  props: {},
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      // const regEmail =
      //   /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确格式的邮箱"));
    };
    var checkTel = (rule, value, callback) => {
      const regTel =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regTel.test(value)) {
        callback();
      }
      callback(new Error("请输入正确格式的手机号"));
    };
    return {
      queryInfo: {
        //列表
        query: null,
        pagenum: 1,
        pagesize: 4,
      },
      userList: [], //用户列表
      mg_state: null, //switch
      total: 0,
      addUserdialog: false, //添加用户对话框开关
      ruleForm: {
        username: "qweqwe",
        password: "qwewqwq",
        email: "qweqwe@qe.qe",
        mobile: "18888888888",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 18,
            message: "长度在 5 到 18 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { validator: checkEmail, trigger: "blur" },
          { required: true, message: "请输入邮箱", trigger: "blur" },
        ],
        mobile: [
          { validator: checkTel, trigger: "blur" },
          { required: true, message: "请输入电话", trigger: "blur" },
        ],
      },
      alterUserdialog: false,
      alterForm: {},
      alterFormRules: {
        email: [
          { validator: checkEmail, trigger: "blur" },
          { required: true, message: "请输入邮箱", trigger: "blur" },
        ],
        mobile: [
          { validator: checkTel, trigger: "blur" },
          { required: true, message: "请输入电话", trigger: "blur" },
        ],
      },
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
      getUsers(this.queryInfo).then((res) => {
        console.log(this.queryInfo);
        if (res.meta.status !== 200)
          return this.$message.error("获取用户列表失败");
        console.log(res);
        this.userList = res.data.users;
        this.total = res.data.total;
        console.log(this.userList);
        console.log(this.total);
      });
    },
    // 分页方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.init();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.init();
    },
    //switch开关方法
    switchChange(e) {
      let a = e.id;
      // console.log(e.mg_state);
      putSwitch(a, e.mg_state).then((res) => {
        if (res.meta.status !== 200) {
          e.mg_state != e.mg_state;
          console.log(res);
          console.log(e.mg_state);
          return this.$message.error("更新用户状态失败");
        }
        this.$message.success("更新用户状态成功");
        console.log(res);
      });
    },
    //添加用户
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // alert("submit!");
          console.log(formName);
          console.log(this.ruleForm);
          postUsers(this.ruleForm).then((res) => {
            console.log(res);
            if (res.meta.status !== 201) {
              this.$message.error(res.meta.msg);
            } else {
              this.$message.success(res.meta.msg);
              this.addUserdialog = false;
              this.init();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    //修改用户
    showModifyDialog(e) {
      console.log(e);
      this.alterUserdialog = true;
      getIDUsers(e).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        this.alterForm = res.data;
      });
    },
    alterUserdialogClose() {
      this.$refs.alterForm.resetFields();
    },
    alterUserForm() {
      this.$refs.alterForm.validate(async (valid) => {
        if (valid) {
          let data = {
            email: this.alterForm.email,
            mobile: this.alterForm.mobile,
          };
          putIDUsers(this.alterForm.id, data).then((res) => {
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg);
            }
            this.alterUserdialog = false;
            this.init();
            this.$message.success(res.meta.msg);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除用户
    deleteUser(e) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(e);
          deleteIDUsers(e).then((res) => {
            console.log(res);
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg);
            }
            this.$message.success(res.meta.msg);
            this.deleteUserDialog = false;
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
.add_user {
  margin-left: 30px;
}
</style>