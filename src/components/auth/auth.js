import React from 'react';
import axiosInstance from '../../config';
import Alert from '@mui/material/Alert';
import { createRoot } from 'react-dom/client';

export const setToken = (token, rememberMe) => {
    if (rememberMe) {
        localStorage.setItem("authToken", token);
    } else {
        sessionStorage.setItem("authToken", token);
    }
};

export const getToken = () => {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
};

export const removeToken = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
};

// 同样的方法也可以用于用户名
export const saveUsername = (username, rememberMe) => {
    if (rememberMe) {
        localStorage.setItem("username", username);
    } else {
        sessionStorage.setItem("username", username);
    }
};

export const getUsername = () => {
    return localStorage.getItem("username") || sessionStorage.getItem("username");
};

export const removeUsername = () => {
    localStorage.removeItem("username");
    sessionStorage.removeItem("username");
};

export const saveUserDetails = (userDetails) => {
  localStorage.setItem('userDetails', JSON.stringify(userDetails));
};

export const getUserDetails = () => {
    const storedDetails = localStorage.getItem('userDetails');
    if (storedDetails) {
      return JSON.parse(storedDetails);
    }
};

export const getCurrentUser = () => {
  const userDetails = getUserDetails();
  if (userDetails) {
    return userDetails;
  }
  return null;
};

const showAlert = (severity, message) => {
  const alertContainer = document.createElement('div');
  document.body.appendChild(alertContainer);

  const root = createRoot(alertContainer);
  root.render(
    <Alert 
      severity={severity}
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }}
    >
      {message}
    </Alert>
  );

  setTimeout(() => {
    root.unmount();
    document.body.removeChild(alertContainer);
  }, 3000);
};

// 新增：集中处理未认证的情况
export const handleUnauthenticated = (message = "Your session has expired. Please log in again.") => {
  // 清除认证相关数据
  removeToken();
  removeUsername();
  localStorage.removeItem('userDetails');
  
  // 显示警告
  showAlert('warning', message);
  
  // 重定向到登录页面
  setTimeout(() => {
    window.location.href = '/login';
  }, 3000);
};

// 请求拦截器 - 检查token是否存在
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request URL in interceptor:', config.url);
    
    // 登录和注册等不需要token的路径
    if (config.url && (
      config.url.includes('/login') || 
      config.url.includes('/register') || 
      config.url.includes('/forgot-password') ||
      config.url.includes('/reset-password')
    )) {
      console.log('Skipping token check for authentication route');
      return config;
    }
    
    // 已经有Authorization头的请求不需要再添加
    if (config.headers.Authorization) {
      console.log('Request already has Authorization header');
      return config;
    }
    
    // 获取token并检查
    const token = getToken();
    if (!token) {
      // 只有在非登录/注册页面才显示警告
      if (!window.location.href.includes('/login')) {
        console.log('No token found and not on login page, redirecting');
        handleUnauthenticated("No token found, please log in again.");
      } else {
        console.log('No token found but on login page, continuing without warning');
      }
      return Promise.reject(new Error('No authentication token found'));
    }
    
    // 添加token到请求头
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 添加拦截器来处理 token 过期
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token 过期，使用集中处理函数
      handleUnauthenticated();
    }
    return Promise.reject(error);
  }
);

// 导出 axiosInstance，以便在其他地方使用
export { axiosInstance };