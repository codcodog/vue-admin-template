import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_API

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

// 获取某股信息
export function getStockInfo(data) {
    return request({
        url: BASE_URL+'/stock/info',
        method: 'get',
        params: data
    })
}

// 更新某股信息
export function updateStockInfo(data) {
    return request({
        url: BASE_URL+'/stock/info/update',
        method: 'post',
        data
    })
}

// 增量同步
export function incrSync(data) {
    return request({
        url: BASE_URL+'/stock/sync/incr',
        method: 'post',
        data
    })
}

// 获取某股同步日志
export function getLog(data) {
    return request({
        url: BASE_URL+'/stock/log',
        method: 'get',
        params: data
    })
}

// 获取 codes 列表
export function getCodes() {
    return request({
        url: BASE_URL+'/stock/codes',
        method: 'get',
    })
}

// 删除某股
export function del(data) {
    return request({
        url: BASE_URL+'/stock/delete',
        method: 'post',
        data
    })
}

// 获取bias
export function getBias(data) {
    return request({
        url: BASE_URL+'/data/bias',
        method: 'get',
        params: data
    })
}

// 新增/更新 价格监控
export function savePriceMonitor(data) {
    return request({
        url: BASE_URL+'/price/monitor/save',
        method: 'post',
        data
    })
}

// 获取监控价格数据
export function getPriceMonitor(data) {
    return request({
        url: BASE_URL+'/price/monitor',
        method: 'get',
        params: data
    })
}
