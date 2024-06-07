
import axios from "axios"

const baseURL = import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_TEST: ""

// 创建axios实例
const request = axios.create({
  baseURL,
  timeout: 20000, // 超时时间
})

// request拦截器
request.interceptors.request.use(
  async config => {
    return config
  },
  error => Promise.reject(error)
)

// respone拦截器
request.interceptors.response.use(
  response => {
    // code为非100是抛错
    const res = response.data
    if (res.code === 0 && res.data) {
      return res.data
    }
    return Promise.reject(res)
  },
  error => {
    let defaultMessage = "server is busy, try later..."
    let errorMessage = error.message || defaultMessage
    if (error.message.includes("timeout")) {
      errorMessage = defaultMessage
    }
    return Promise.reject(errorMessage)
  }
)

export default request
