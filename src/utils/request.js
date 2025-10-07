import axios from 'axios'
import { ElNotification } from 'element-plus'
import { getToken } from '@/utils/auth.js'

// create an axios instance
const service = axios.create({
  baseURL: 'http://127.0.0.1:8080/api', // url = base url + request url
  timeout: 5000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response) => {
    const res = response.data

    if (res.code !== 0) {
      ElNotification({
        message: res.message || 'Error',
        type: 'error',
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    ElNotification({
      message: error.message,
      type: 'error',
    })
    return Promise.reject(error)
  },
)

export default service
