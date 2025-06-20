import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'post',
    headers:{"token":token}
  })
}

export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'post',
    headers:{"token":token}
  })
}
