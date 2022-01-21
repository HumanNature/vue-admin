import {
    Request,
} from './request';
export function getUsers(data) {
    return Request({
        method: 'get',
        url: 'api/private/v1/users/',
        params: data

    })
}
export function postUsers(use) {
    return Request({
        method: 'post',
        url: 'api/private/v1/users/',
        data: use
    })
}
export function putSwitch(uid, type) {
    return Request({
        method: 'put',
        url: "api/private/v1/users/" + uid + "/state/" + type
    })
}