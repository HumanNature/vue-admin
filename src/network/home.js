import {
    Request,
} from './request';
export function getMenus(pagenum, pagesize) {
    return Request({
        method: 'get',
        url: 'api/private/v1/menus/',
        params: {
            pagenum,
            pagesize
        }
    })
}