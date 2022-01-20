import {
    Request,
} from './request';
export function postLogin(data) {
    return Request({
        method: 'post',
        url: 'api/private/v1/login',
        data: data
    })
}