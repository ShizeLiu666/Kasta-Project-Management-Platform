import axios from 'axios';
console.log('NODE_ENV:', process.env.NODE_ENV);
const baseURL = '/api';
// const baseURL = 'http://kastacloud.com:8080/api';
// const baseURL = process.env.NODE_ENV === 'production' 
//   ? 'http://kastacloud.com:8080/api' 
//   : '/api';

console.log(`baseURL:`, baseURL);

const axiosInstance = axios.create({
  baseURL: baseURL,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 只在开发环境下显示请求日志
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error.message);
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 只在开发环境下显示响应日志
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // 只记录错误状态和消息
    if (error.response) {
      console.error(`[API Error] ${error.response.status}: ${error.response.data.errorMsg || error.message}`);
    } else {
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
