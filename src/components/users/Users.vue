<template>
  <div class="box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :getter="20">
        <el-col :span="6"
          ><el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear='init'
          >
            <el-button
              @click="init"
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button class="add_user" type="primary">添加用户</el-button>
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
          <template>
            <!-- <el-switch v-model="scope.row.mg_state"></el-switch> -->
            <el-tooltip
              class="item"
              effect="dark"
              content="增加"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
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
          </template>
        </el-table-column>
      </el-table>
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
import { getUsers, putSwitch } from "../../network/users";
export default {
  props: {},
  data() {
    return {
      queryInfo: {
        query: null,
        pagenum: 1,
        pagesize: 4,
      },
      userList: [],
      mg_state: null,
      total: 0,
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