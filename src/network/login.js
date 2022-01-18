import {
    getRequest,
    postRequest,
} from './request';
export function getDevice() {
    return getRequest({
        url: '/device/'
    })
}
export function postLogin(data) {
    return postRequest({
        url: 'api/private/v1/login',
        data: data
    })
}
export function postMonth(type) {
    return postRequest({
        url: '/excel/month',
        // 后面拼接type = 
        params: {
            type,
        }
    })
}