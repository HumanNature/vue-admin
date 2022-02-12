import {
    Request,
} from '../request';
//商品列表数据
export function getGoods(data) {
    return Request({
        method: 'get',
        url: 'api/private/v1/goods',
        params: data
    })
}
//添加商品
export function postGoods(data) {
    return Request({
        method: 'post',
        url: 'api/private/v1/goods/',
        data: data
        // data: {
        //     goods_name: gname,
        //     goods_cat: gcat,
        //     goods_price: gprice,
        //     goods_number: gnamber,
        //     goods_weight: gweight,
        //     goods_introduce: gintroduce,
        //     pics: gpics,
        //     attrs: gattrs,
        // }
    })
}
//id查询商品
export function getIDGoods(id) {
    return Request({
        method: 'get',
        url: 'api/private/v1/goods/' + id,
    })
}
//编辑提交商品
export function putIDGoods(id, cname) {
    return Request({
        method: 'put',
        url: 'api/private/v1/goods/' + id,
        data: {
            cat_name: cname
        }
    })
}
//删除商品
export function deleteIDGoods(id) {
    return Request({
        method: 'delete',
        url: 'api/private/v1/goods/' + id,
    })
}
//同步商品
export function putGoodsSync(id) {
    return Request({
        method: 'put',
        url: 'api/private/v1/goods/' + id + '/attributes',
    })
}