import axios from 'axios'
// 创建axios实例
const service = axios.create({
  timeout: 15000
})

// request拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
  Promise.Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(data => {
    return data
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
