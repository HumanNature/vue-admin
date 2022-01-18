import axios from 'axios';
var baseURL = 'http://127.0.0.1:8888/'
export function getRequest(config) {
    // 1.创建axios实例
    const instance = axios.create({
        baseURL: baseURL,
        timeout: 5000,
        withCredentials: true,

    })
    return instance(config)
}
// 请求拦截
axios.interceptors.request.use(
    (confing) => {
        //设置请求头
        if (localStorage.eToken) {
            confing.headers.Authorization = window.sessionStorage.getItem('token')
        }
        return confing
    },
    (error) => {
        return Promise.reject(error)
    }
)
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