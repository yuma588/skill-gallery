import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data
      },
      (error) => {
        if (error.response) {
          const { status, data } = error.response

          switch (status) {
            case 401:
              ElMessage.error('登录已过期，请重新登录')
              localStorage.removeItem('token')
              window.location.href = '/login'
              break
            case 403:
              ElMessage.error('没有权限访问')
              break
            case 404:
              ElMessage.error('请求的资源不存在')
              break
            case 500:
              ElMessage.error('服务器错误，请稍后重试')
              break
            default:
              ElMessage.error(data.message || '请求失败')
          }
        } else {
          ElMessage.error('网络错误，请检查网络连接')
        }
        return Promise.reject(error)
      }
    )
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }
}

export const api = new ApiClient()
export default api
