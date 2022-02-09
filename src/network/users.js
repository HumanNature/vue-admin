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
export function getIDUsers(id) {
    return Request({
        method: 'get',
        url: 'api/private/v1/users/' + id,
    })
}
export function putIDUsers(id, data) {
    return Request({
        method: 'put',
        url: 'api/private/v1/users/' + id,
        data: data
    })
}
export function deleteIDUsers(id) {
    return Request({
        method: 'delete',
        url: 'api/private/v1/users/' + id,
    })
}
//分配角色
export function putIDRoles(id, e) {
    return Request({
        method: 'put',
        url: 'api/private/v1/users/'+ id+'/role',
        data: {
            rid: e
        }
    })
}