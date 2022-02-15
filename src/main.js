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
//引入VueQuillEditor
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)
//时间戳转换挂载在mian上
Vue.filter('dateFormat', function (val) {
  const dt = new Date(val)
  const Y = dt.getFullYear()
  const M = (dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1).padStart(2,'0')
  const D = (dt.getDate()+'').padStart(2,'0')
  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')
  return `${Y}-${M}-${D} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')