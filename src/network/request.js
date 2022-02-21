import axios from 'axios';
//引入nprogress
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
var baseURL = 'http://127.0.0.1:8888/'
// 1.创建axios实例
const instance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    // withCredentials: true,
})
export function Request(config) {

    return instance(config)
}
// 请求拦截
instance.interceptors.request.use(config => {
    NProgress.start()
    //为请求头对象，添加Token验证的Authorization字段
    // console.log(window.localStorage.getItem('token'));
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})
//拦截隐藏进度条
//再次拦截，为了获取数据中data中的data，拦截第一次data
instance.interceptors.response.use(res => {
    NProgress.done()
    return res.data;
  })
export function postRequest(config) {
    // 1.创建axios实例
    const instance = axios.create({
        baseURL: baseURL,
        timeout: 5000,
        method: 'post',
        responseType: 'blob',
        headers: {
            'Access-Control-Allow-Origin': '127.0.0.1'
        }
    })
    return instance(config)
}
export {
    baseURL
}