import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";
import './FullLayout.css';
import ChatBot from "../components/CustomComponents/ChatBot";

const FullLayout = () => {
  const [userType, setUserType] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth >= 992) {
      setIsCollapsed(!isCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails && userDetails.userType) {
      setUserType(userDetails.userType);
    }
  }, []);

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
        <div className="contentArea">
          <Container className="p-4" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
      <ChatBot />
    </main>
  );
};

export default FullLayout;
