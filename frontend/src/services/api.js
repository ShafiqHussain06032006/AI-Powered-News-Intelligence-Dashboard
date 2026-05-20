import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/news/',
  timeout: 10000,
})

api.interceptors.response.use(
  res => res,
  err => {
    // central error handling — frontend will show proper toasts
    return Promise.reject(err)
  }
)

export default api
