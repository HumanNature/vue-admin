<template>
  <div class="box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }"
        >权限管理</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/rights' }"
        >权限列表</el-breadcrumb-item
      >
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 用户列表 -->
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == '0'" type="success">一级</el-tag>
            <el-tag v-else-if="scope.row.level == '1'" type="info">二级</el-tag>
            <el-tag v-else-if="scope.row.level == '2'" type="warning"
              >三级</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightstype } from "../../network/rights";
export default {
  props: {},
  data() {
    return {
      rightsList: [],
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
      let a = "list";
      getRightstype(a).then((res) => {
        if (res.meta.status != 200) {
          this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        console.log(res);
        this.rightsList = res.data;
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
</style>