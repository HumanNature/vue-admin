<template>
  <div class="box">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="canvas"></div>
    </el-card>
  </div>
</template>

<script>
import { getData } from "../../network/data/data";
export default {
  props: {},
  data() {
    return {
      echartsdata: null,
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {
    this.init();

    // window.onresize = function () {
    //   EChartDate.resize;
    // };
  },

  methods: {
    init() {
      let EChartDate = this.$echarts.init(document.querySelector(".canvas"));
      getData().then((res) => {
        console.log(res);
        this.echartsdata = res.data;
      });
      let option = {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        legend: {
          data: ["华东", "华南", "华西", "华北", "其他"],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [
              "2022-1-1",
              "2022-1-10",
              "2022-1-20",
              "2022-2-1",
              "2022-2-10",
              "2022-2-20",
              "2022-3-1",
            ],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "华东",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "华南",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [120, 182, 191, 234, 290, 330, 310],
          },
          {
            name: "华北",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: "华西",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [220, 332, 301, 334, 390, 330, 320],
          },
          {
            name: "其他",
            type: "line",
            stack: "Total",
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [120, 232, 301, 234, 390, 330, 320],
          },
        ],
      };
      EChartDate.setOption(option);
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
.canvas {
  margin: 0 15px;
  width: 600px;
  height: 400px;
}
</style>