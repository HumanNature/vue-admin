<template>
  <div class="box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row class="isrow" :getter="20">
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
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="orderlist" style="width: 100%" border stripe>
        <el-table-column width="60px" type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column width="90px" prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column width="80px" prop="pay_status" label="是否付款">
          <template v-slot="scope">
            <!-- {{ scope.row.pay_status }}
                <el-tag>标签一</el-tag>
                <el-tag type="success">标签二</el-tag>
                <el-tag type="info">标签三</el-tag>
                <el-tag type="warning">标签四</el-tag> -->
            <el-tag v-if="scope.row.pay_status === '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-if="scope.row.pay_status === '0'" type="danger"
              >未付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column width="90px" prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column width="220px" prop="create_time" label="下单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column width="180px" label="操作">
          <template v-slot="scope">
            <!-- <el-switch v-model="scope.row.mg_state"></el-switch> -->
            <el-tooltip
              class="item"
              effect="light"
              content="修改订单地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="showModifyDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <!-- 修改地址的对话框 -->
            <el-dialog
              title="修改地址"
              :visible.sync="addresUserdialog"
              width="50%"
              @close="addresUserdialogClose"
            >
              <el-form
                :model="addresForm"
                :rules="addresFormRules"
                ref="addresForm"
                label-width="100px"
                class="demo-addresForm"
              >
                <el-form-item label="省市区/县" prop="address1">
                  <el-cascader
                    :options="cityOption"
                    v-model.trim="addresForm.address1"
                  >
                  </el-cascader>
                  <!-- <el-input "></el-input> -->
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                  <el-input v-model.trim="addresForm.address2"></el-input>
                </el-form-item>
              </el-form>

              <span slot="footer" class="dialog-footer">
                <el-button @click="addresUserdialog = false">取 消</el-button>
                <el-button type="primary" @click="addresUserForm(scope.row)"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
            <el-tooltip
              class="item"
              effect="light"
              content="物流信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                icon="el-icon-location"
                type="success"
                @click="deleteUser(scope.row)"
              ></el-button>
            </el-tooltip>
            <!-- 物流信息的对话框 -->
            <el-dialog
              title="物流进度"
              :visible.sync="progressVisible"
              width="50%"
              @close="progressVisibleClose"
            >
              <!-- <div>{{ progressInfo }}</div> -->
              <el-timeline :reverse="false">
                <el-timeline-item
                  v-for="(item, index) in progressInfo"
                  :key="index"
                  :timestamp="item.time"
                >
                  {{ item.context }}
                </el-timeline-item>
              </el-timeline>
              <!-- <el-form
                :model="addresForm"
                :rules="addresFormRules"
                ref="addresForm"
                label-width="100px"
                class="demo-addresForm"
              >
                <el-form-item label="省市区/县" prop="address1">
                  <el-cascader
                    :options="cityOption"
                    :value="city"
                    v-model.trim="addresForm.address1"
                    @change="changeProvince"
                    change-on-select
                  >
                  </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                  <el-input v-model.trim="addresForm.address2"></el-input>
                </el-form-item>
              </el-form> -->
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        v-if="total != 0"
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
import { getOrders } from "../../network/orders/orders";
import cityOptions from "../../network/orders/city_data2017_element";
export default {
  props: {},
  data() {
    return {
      queryInfo: {
        //列表
        query: "",
        pagenum: 2,
        pagesize: 10,
      },
      orderlist: [],
      total: 0,
      addresUserdialog: false,
      addresForm: {},
      addresFormRules: {
        address1: [
          { required: true, message: "请输入省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      cityOption: cityOptions,
      progressVisible: false,
      progressInfo: {}, //快递物流信息
    };
  },

  components: {},

  computed: {},

  beforeMount() {},
  created() {
    this.init();
  },
  mounted() {},

  methods: {
    init() {
      getOrders(this.queryInfo).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        }
        console.log(res);
        this.orderlist = res.data.goods;
        // this.queryInfo.pagenum = res.data.pagenum;
        this.total = res.total;
        this.$message.success(res.meta.msg);
      });
    },
    addresUserdialogClose() {
      // console.log(1);
      this.$refs.addresForm.resetFields();
    },
    addresUserForm(e) {
      console.log(e);
    },
    handleSizeChange(newsize) {
      //bug 分页功能的 pager 未渲染出来
      console.log(`每页 ${newsize} 条`);
      this.queryInfo.pagesize = newsize;
      this.init();
    },
    handleCurrentChange(newPage) {
      console.log(`每页 ${newPage} 条`);
      this.queryInfo.pagenum = newPage;
      this.init();
    },
    showModifyDialog(row) {
      this.addresUserdialog = true;
      console.log(row);
    }, //修改地址的对话框
    deleteUser(row) {
      this.progressVisible = true;
      this.progressInfo = [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ];

      console.log(this.progressInfo);
      console.log(row);
    }, //物流信息对话框
    progressVisibleClose() {}, //关闭对话框
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
.isrow {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
.el-tooltip {
  margin-right: 15px;
}
/deep/ .el-dialog {
  box-shadow: none !important;
}
</style>