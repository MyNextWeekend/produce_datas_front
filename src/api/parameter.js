import request from '@/utils/request'

export function ParameterAdd(query) {
  return request({
    url: '/parameter/add',
    method: 'post',
    data: query
  })
}

export function ParameterDelete(query) {
  return request({
    url: '/parameter/delete',
    method: 'post',
    data: query
  })
}

export function ParameterUpdate(query) {
  return request({
    url: '/parameter/update',
    method: 'post',
    data: query
  })
}

export function ParameterQuery(query) {
  return request({
    url: '/parameter/query',
    method: 'post',
    data: query
  })
}

export function ParameterStatistic(query) {
  return request({
    url: '/parameter/statistic',
    method: 'post',
    data: query
  })
}

export function ParameterInfo(query) {
  return request({
    url: '/parameter/info',
    method: 'post',
    data: query
  })
}