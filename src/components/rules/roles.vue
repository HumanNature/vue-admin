<template>
  <div class="box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }"
        >权限管理</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/rights' }"
        >角色管理</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 添加角色 -->
      <!-- 添加用户 -->
      <el-col :span="4">
        <el-button class="add_user" type="primary" @click="addUserdialog = true"
          >添加用户</el-button
        >
        <!-- <el-dialog
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
          </el-dialog> -->
      </el-col>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- <pre> {{ scope.row }}</pre> -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'flex_row']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="4">
                <el-tag
                  closable
                  type="danger"
                  @close="TagClose(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'flex_row']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :gutter="24"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="TagClose(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item1.children"
                      :key="item3.id"
                      closable
                      type="warning"
                      @close="TagClose(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- <el-switch v-model="scope.row.mg_state"></el-switch> -->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="showModifyDialog(scope.row.id)"
                >编辑</el-button
              >
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
                >删除</el-button
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限 "
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                icon="el-icon-setting"
                type="warning"
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </el-tooltip>
            <!-- 修改用户的对话框 -->
            <el-dialog
              title="分配权限"
              :visible.sync="setRightDialogVisible"
              @close="setRightDialogClosed"
              width="50%"
            >
              <el-tree
                :data="list"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :default-checked-keys="defKeys"
                :props="treeProps"
                ref="treeRef"
              >
              </el-tree>

              <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="allotRights()"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {
  getRoles,
  getRightstype,
  postRolesID,
  deleteRolesID,
} from "../../network/roles/rights";
export default {
  props: {},
  data() {
    return {
      rolesList: [],
      alterForm: null,
      setRightDialogVisible: false,
      list: [],
      treeProps: {
        children: "children",
        label: "authName",
      },
      defKeys: [105, 116],
      roleId: "", //当前即将分配权限的角色id
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
      getRoles().then((res) => {
        if (res.meta.status != 200) {
          this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        console.log(res);
        this.rolesList = res.data;
      });
    },
    showModifyDialog(e) {
      console.log(e);
    },
    deleteUser(e) {
      console.log(e);
    },
    alterUserdialog(e) {
      console.log(e);
    },
    alterUserdialogClose() {
      console.log(1);
    },
    alterUserForm() {
      console.log(1);
    },
    //根据id删除对应用户权限
    TagClose(role, rightId) {
      console.log(role.id, rightId);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(role.id, rightId);
          deleteRolesID(role.id, rightId).then((res) => {
            console.log(res);
            if (res.meta.status !== 200) {
              this.$message({
                type: "error",
                message: res.meta.msg,
              });
            }
            this.$message({
              type: "success",
              message: res.meta.msg,
            });
            //把删除后的列表重新赋值给children，不用刷新页面
            role.children = res.data;
          });

          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //展示分配权限的对话框
    showSetRightDialog(role) {
      this.roleId = role.id;
      this.setRightDialogVisible = true;
      getRightstype("tree").then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.list = res.data;
        this.getLeafKeys(role, this.defKeys);
      });
    },
    getLeafKeys(node, arr) {
      //如果当前node阶段不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    //点击为角色分配权限
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      console.log(keys);
      const isStr = keys.join(",");
      console.log(this.roleId);
      postRolesID(this.roleId, isStr).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
      });
      this.setRightDialogVisible = false;
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
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-row {
  margin: 0 40px;
}
.flex_row {
  display: flex;
  align-items: center;
}
</style>