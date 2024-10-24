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
    console.log('Request:', config.method.toUpperCase(), config.url);
    console.log('Full URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
