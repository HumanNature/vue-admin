import {
    Request,
} from '../request';
//订单列表数据
export function getOrders(data) {
    return Request({
        method: 'get',
        url: 'api/private/v1/orders',
        params: data
    })
}
//修改订单状态
export function putIDOrders(id, data) {
    return Request({
        method: 'put',
        url: 'api/private/v1/orders/' + id,
        data: data
    })
}
//查询订单详情
export function getIDOrders(id) {
    return Request({
        method: 'get',
        url: 'api/private/v1/orders/' + id,
    })
}
//查看物流信息
export function getKuaidi(id) {
    return Request({
        method: 'get',
        url: 'api/private/v1/kuaidi/' + id,
    })
}
//添加订单
export function postOrders(data) {
    return Request({
        method: 'post',
        url: 'api/private/v1/orders/',
        data: data
        // data: {
        //     orders_name: gname,
        //     orders_cat: gcat,
        //     orders_price: gprice,
        //     orders_number: gnamber,
        //     orders_weight: gweight,
        //     orders_introduce: gintroduce,
        //     pics: gpics,
        //     attrs: gattrs,
        // }
    })
}