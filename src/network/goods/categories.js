import {
    Request,
} from '../request';
//商品分类数据列表
export function getCategories(data) {
    return Request({
        method: 'get',
        url: 'api/private/v1/categories',
        params: data
    })
}
//添加分类
export function postCategories(pid, cname, level) {
    return Request({
        method: 'post',
        url: 'api/private/v1/categories/',
        data: {
            cat_pid: pid,
            cat_name: cname,
            cat_level: level
        }
    })
}
//id查询分类
export function getIDCategories(id) {
    return Request({
        method: 'get',
        url: 'api/private/v1/categories/' + id,
    })
}
//编辑提交分类
export function putIDCategories(id, cname) {
    return Request({
        method: 'put',
        url: 'api/private/v1/categories/' + id,
        data: {
            cat_name: cname
        }
    })
}
//删除分类
export function deleteIDCategories(id) {
    return Request({
        method: 'delete',
        url: 'api/private/v1/categories/' + id,
    })
}
//分类参数
//参数列表
export function getCategoriesList(roleId, sel) {
    return Request({
        method: 'get',
        url: 'api/private/v1/categories/' + roleId + '/attributes',
        data: {
            sel: sel
        },
    })
}
//添加动态参数或者静态属性
export function addAttributes(id, cname, sel, vals) {
    return Request({
        method: 'post',
        url: 'api/private/v1/categories/' + id + '/attributes',
        data: {
            attr_name: cname,
            attr_sel: sel,
            attr_vals: vals
        },
    })
}
//删除参数
export function deleteParam(id, attrid) {
    return Request({
        method: 'delete',
        url: 'api/private/v1/categories/' + id + '/attributes' + attrid,
    })
}
//根据id查询参数
export function getIDParam(id, attrId) {
    return Request({
        method: 'get',
        url: 'api/private/v1/categories/' + id + '/attributes' + attrId,
    })
}
//编辑提交参数
export function putIDParam(id, attrId, cname, sel, vals) {
    return Request({
        method: 'put',
        url: 'api/private/v1/categories/' + id + '/attributes' + attrId,
        data: {
            attr_name: cname,
            attr_sel: sel,
            attr_vals: vals,
        }
    })
}