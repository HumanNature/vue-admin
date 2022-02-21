import {
    Request,
} from '../request';
//商品分类数据列表
export function getData() {
    return Request({
        method: 'get',
        url: 'api/private/v1/reports/type/1',
    })
}