import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入echarts
// import echarts from 'echarts'  //这里的引用只是适用于echarts5.0以下的版本
import * as echarts from 'echarts' //这里的引用是适用于echarts5.0以上的版本
Vue.prototype.$echarts = echarts;
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  //为请求头对象，添加Token验证的Authorization字段
  config.headers.Authorization = window.localStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
//引入vue-table
import ZkTable from 'vue-table-with-tree-grid'
Vue.use(ZkTable)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')