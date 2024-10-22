import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "reactstrap";
import "./FullLayout.css";

const FullLayout = () => {
  const [userType, setUserType] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [showInvitations, setShowInvitations] = useState(false);

  useEffect(() => {
    // 从 localStorage 获取用户详情
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails && userDetails.userType) {
      setUserType(userDetails.userType);
      // setShowInvitations(true); // 登录后自动显示邀请弹窗
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // const toggleInvitationModal = () => {
  //   setShowInvitations(!showInvitations);
  // };

  return (
    <main>
      {/********header**********/}
      <Header toggleSidebar={toggleSidebar} />
      <div className="pageWrapper d-lg-flex content-container">
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
