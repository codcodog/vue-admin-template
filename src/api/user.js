import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_API
console.log('base url', BASE_URL)

export function login(data) {
  return request({
    url: BASE_URL+'/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: BASE_URL+'/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: BASE_URL+'/user/logout',
    method: 'post'
  })
}
