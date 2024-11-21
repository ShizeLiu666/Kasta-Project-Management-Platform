import React from 'react';
import axiosInstance from '../config';
import Alert from '@mui/material/Alert';
import ReactDOM from 'react-dom';

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

  ReactDOM.render(
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
    </Alert>,
    alertContainer
  );

  setTimeout(() => {
    ReactDOM.unmountComponentAtNode(alertContainer);
    document.body.removeChild(alertContainer);
  }, 3000);
};

// 添加拦截器来处理 token 过期
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token 过期
      removeToken();
      removeUsername();
      localStorage.removeItem('userDetails');
      
      // 显示警告
      showAlert('warning', 'Your session has expired. Please log in again.');
      
      // 重定向到登录页面
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }
    return Promise.reject(error);
  }
);

// 导出 axiosInstance，以便在其他地方使用
export { axiosInstance };