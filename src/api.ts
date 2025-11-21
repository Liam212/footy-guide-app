import axios, { AxiosError } from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_API_KEY,
  },
  timeout: 10000,
})

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    console.error('API error:', error)
    return Promise.reject(error)
  },
)
