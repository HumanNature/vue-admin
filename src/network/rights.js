import {
    Request,
} from './request';
//所有权限列表
export function getRightstype(data) {
    return Request({
        method: 'get',
        url: 'api/private/v1/rights/' + data,
    })
}
//角色管理
export function getRoles() {
    return Request({
        method: 'get',
        url: 'api/private/v1/roles'
    })
}

export function postRoles(use) {
    return Request({
        method: 'post',
        url: 'api/private/v1/roles/',
        data: use
    })
}
export function getIDRoles(id) {
    return Request({
        method: 'get',
        url: 'api/private/v1/roles/' + id,
    })
}
export function putIDRoles(id, data) {
    return Request({
        method: 'put',
        url: 'api/private/v1/roles/' + id,
        data: data
    })
}
export function deleteIDRoles(id) {
    return Request({
        method: 'delete',
        url: 'api/private/v1/roles/' + id,
    })
}
export function postRolesID(roleId, rids) {
    return Request({
        method: 'post',
        url: 'api/private/v1/roles/' + roleId + '/rights',
        data: {
            rids: rids
        },
    })
}
export function deleteRolesID(roleId, rightId) {
    return Request({
        method: 'delete',
        url: 'api/private/v1/roles/' + roleId + '/rights/' + rightId,
    })
}