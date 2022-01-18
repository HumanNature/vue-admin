import {
    getRequest,
    postRequest,
} from './request';
export function getMenus(pagenum, pagesize) {
    return getRequest({
        url: 'api/private/v1/menus/',
        params: {
            pagenum,
            pagesize
        }
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