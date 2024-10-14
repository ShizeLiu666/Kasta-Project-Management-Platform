import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";

const FullLayout = () => {
  const [userType, setUserType] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // 从 localStorage 获取用户详情
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails && userDetails.userType) {
      setUserType(userDetails.userType);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <main>
      {/********header**********/}
      <Header toggleSidebar={toggleSidebar} />
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        <aside className={`sidebarArea shadow ${sidebarOpen ? 'showSidebar' : ''}`} id="sidebarArea">
          <Sidebar userType={userType} toggleSidebar={toggleSidebar} />
        </aside>
        {/********Content Area**********/}
        <div className="contentArea">
          {/********Middle Content**********/}
          <Container className="p-4" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
