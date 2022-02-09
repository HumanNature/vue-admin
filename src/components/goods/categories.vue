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
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="add"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="bdd"
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
import { getCategories } from "../../network/goods/categories";
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
</style>