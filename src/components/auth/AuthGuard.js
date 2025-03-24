import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken, handleUnauthenticated } from './auth';

/**
 * 检查JWT token是否过期，带缓存机制减少计算开销
 * @param {string} token JWT token
 * @returns {boolean} 如果token已过期或无效，返回true
 */
const isTokenExpired = (() => {
  // 缓存最近检查的token和结果
  let lastCheckedToken = null;
  let lastResult = true;
  let lastCheckTime = 0;
  
  return (token) => {
    if (!token) return true;
    
    const now = Date.now();
    
    // 如果是同一个token，且上次检查在30秒内，直接返回缓存结果
    if (token === lastCheckedToken && (now - lastCheckTime) < 30000) {
      return lastResult;
    }
    
    try {
      // JWT token的格式是三段式的，我们需要中间部分（payload）
      const base64Url = token.split('.')[1];
      if (!base64Url) return true;
      
      // 解码Base64
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // 检查是否有exp字段（过期时间），exp是Unix时间戳（秒）
      if (!payload.exp) {
        // 更新缓存
        lastCheckedToken = token;
        lastResult = false;
        lastCheckTime = now;
        return false; // 如果没有过期时间，假设不过期
      }
      
      // 比较当前时间和过期时间
      const currentTime = now / 1000; // 转换为秒
      const result = payload.exp < currentTime;
      
      // 更新缓存
      lastCheckedToken = token;
      lastResult = result;
      lastCheckTime = now;
      
      return result;
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return true; // 解析错误，视为过期
    }
  };
})();

/**
 * 认证守卫组件，用于保护需要登录的路由
 * 如果用户未登录，自动重定向到登录页面
 */
const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const location = useLocation();

  // 检查认证状态的函数
  const checkAuthentication = () => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else if (token && isTokenExpired(token)) {
      // 如果token存在但已过期
      console.log('Token expired, redirecting to login page');
      handleUnauthenticated('Your session has expired. Please log in again.');
      setIsAuthenticated(false);
    } else {
      // 如果没有token
      setIsAuthenticated(false);
      // 设置延迟重定向标志
      setRedirecting(true);
      
      // 3秒后进行重定向，给用户足够时间查看提示
      setTimeout(() => {
        setRedirecting(false);
      }, 3000);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // 初始检查
    checkAuthentication();
    
    // 设置定时器，每12小时检查一次token是否过期
    // 对于一个月过期的token，这个频率更加合理
    const tokenCheckInterval = setInterval(() => {
      const token = getToken();
      // 只有在有token时才检查过期
      if (token && isTokenExpired(token)) {
        console.log('Periodic check: Token expired');
        handleUnauthenticated('Your session has expired. Please log in again.');
        setIsAuthenticated(false);
      }
    }, 12 * 60 * 60 * 1000); // 12小时
    
    // 用户活动检测 - 在页面变为活动状态时检查
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible, checking token');
        const token = getToken();
        if (token && isTokenExpired(token)) {
          console.log('Token expired after inactivity');
          handleUnauthenticated('Your session has expired. Please log in again.');
          setIsAuthenticated(false);
        }
      }
    };
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 清理函数，组件卸载时清除定时器和事件监听
    return () => {
      clearInterval(tokenCheckInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (isLoading) {
    // 可以在这里显示加载指示器
    return <div>Loading...</div>;
  }

  // 显示认证过期提示并等待重定向
  if (!isAuthenticated) {
    return (
      <> 
        {/* 只有当不再显示提示或等待时间结束时才重定向 */}
        {!redirecting && <Navigate to="/login" state={{ from: location.pathname }} />}
        
        {/* 显示一个简单的等待界面 */}
        {redirecting && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{
              padding: '20px',
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              <h2>Session Expired</h2>
              <p>Your session has expired or you are not logged in.</p>
              <p>Redirecting to login page...</p>
            </div>
          </div>
        )}
      </>
    );
  }

  // 已通过认证，显示子组件
  return children;
};

export default AuthGuard;