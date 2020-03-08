import request from '@/utils/request'

const BASE_URL = 'http://stock.com'

// 获取股票数据
// data: {
//  type: 0,
//  params: {
//      code: 'sz.000016',
//      start: '2020-03-05',
//      end: '2020-03-06'
//  }
// }
export function getStockData(data) {
    switch(data.type) {
        case 0:
            data = getClose(data.params);
            break;
        case 1:
            data = getLow(data.params);
            break;
        case 2:
            data = getHigh(data.params);
            break;
        default:
            data = {
                code: 1,
                message: '非法 type',
                data: []
            }
    }
    return data
}

// 获取 close 数据
function getClose(data) {
    return request({
        url: BASE_URL+'/data/close',
        method: 'get',
        params: data
    })
}

// 获取 low 数据
function getLow(data) {
    return request({
        url: BASE_URL+'/data/low',
        method: 'get',
        params: data
    })
}

// 获取 high 数据
function getHigh(data) {
    return request({
        url: BASE_URL+'/data/high',
        method: 'get',
        params: data
    })
}

// 新增股票
export function addStock(data) {
    return request({
        url: BASE_URL+'/stock/add',
        method: 'post',
        data
    })
}

// 获取股票
export function getStock() {
    return request({
        url: BASE_URL+'/stock/list',
        method: 'get'
    })
}

// 初始化股票数据
export function initStock(data) {
    return request({
        url: BASE_URL+'/stock/init',
        method: 'post',
        data
    })
}

// 跟踪该股
export function track(data) {
    return request({
        url: BASE_URL+'/stock/track',
        method: 'post',
        data
    })
}

// 不再跟踪该股
export function untrack(data) {
    return request({
        url: BASE_URL+'/stock/untrack',
        method: 'post',
        data
    })
}
