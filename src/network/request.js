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
// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('Authorization')) {
            config.headers.Authorization = localStorage.getItem('Authorization');
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    });
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