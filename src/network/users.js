import {
    Request,
} from './request';
export function getUsers(pagenum, pagesize, query) {
    return Request({
        method: 'get',
        url: 'api/private/v1/users/',
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}