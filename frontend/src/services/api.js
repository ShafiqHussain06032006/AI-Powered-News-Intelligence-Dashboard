import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/news/',
  timeout: 10000,
})

// Response interceptor to map backend structured errors
api.interceptors.response.use(
  res => res,
  err => {
    if(err.response && err.response.data){
      const data = err.response.data
      return Promise.reject(new Error(data.message || JSON.stringify(data)))
    }
    return Promise.reject(err)
  }
)

export default api
