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
          ><el-input placeholder="请输入内容">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button class="add_user" type="primary">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getUsers } from "../../network/users";
export default {
  props: {},
  data() {
    return {
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 2,
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
      getUsers(1,2).then((res) => {
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
.add_user {
  margin-left: 30px;
}
</style>