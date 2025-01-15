import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";
import './FullLayout.css';

const FullLayout = () => {
  const [userType, setUserType] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      // 自动处理侧边栏状态
      if (window.innerWidth < 992) {
        setSidebarOpen(false);
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 切换侧边栏
  const toggleSidebar = () => {
    if (window.innerWidth >= 992) {
      setIsCollapsed(!isCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // 获取用户类型
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails && userDetails.userType) {
      setUserType(userDetails.userType);
    }
  }, []);

  // 计算内容区域的类名
  const getContentClassName = () => {
    let className = 'contentArea';
    if (windowWidth >= 992 && isCollapsed) {
      className += ' content-collapsed';
    }
    return className;
  };

  return (
    <main>
      <Header toggleSidebar={toggleSidebar} />
      <div className="pageWrapper d-lg-flex content-container">
        <aside 
          className={`sidebarArea shadow ${sidebarOpen ? 'showSidebar' : ''} ${isCollapsed ? 'collapsed' : ''}`} 
          id="sidebarArea"
        >
          <Sidebar 
            userType={userType} 
            toggleSidebar={toggleSidebar}
            isCollapsed={isCollapsed}
          />
        </aside>
        <div className={getContentClassName()}>
          <Container 
            className="p-4" 
            fluid
            style={{
              maxWidth: windowWidth >= 1800 ? '1800px' : '100%'
            }}
          >
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
