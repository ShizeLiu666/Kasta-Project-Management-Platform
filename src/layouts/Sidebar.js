import React from "react";
import { Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import '../assets/scss/loader/Sidebar.css'
import CloseIcon from '@mui/icons-material/Close';
import MenuOpenIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';
import MenuIcon from '@mui/icons-material/KeyboardArrowLeftTwoTone';

const navigation = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: 'bi-bar-chart-line',
    allowedUserTypes: [99999, 1, 0],
  },
  {
    title: "Project",
    href: "/admin/project",
    icon: 'bi-folder2-open',
    allowedUserTypes: [99999, 1],
  },
  {
    title: "Network",
    href: "/admin/network",
    icon: 'bi-house-door',
    allowedUserTypes: [99999, 1, 0],
  },
  {
    title: "AuthCode",
    href: "/admin/auth-code-management",
    icon: 'bi-key',
    allowedUserTypes: [99999],
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: 'bi-person-circle',
    allowedUserTypes: [99999, 1, 0],
  },
  {
    title: "Log",
    href: "/admin/operation-log",
    icon: 'bi-clock-history',
    superUserOnly: true,
  },
  // {
  //   title: "Testing",
  //   href: "/admin/testing",
  //   icon: 'bi-file-earmark-excel-fill',
  // },
];

const Sidebar = ({ userType, toggleSidebar, isCollapsed }) => {
  let location = useLocation();

  return (
    <div className="sidebar-container">
      <div className="sidebar-close-button d-lg-none" onClick={toggleSidebar}>
        <CloseIcon />
      </div>
      <div className="sidebar-collapse-button d-none d-lg-flex" onClick={toggleSidebar}>
        {isCollapsed ? <MenuOpenIcon /> : <MenuIcon />}
      </div>
      <div className="p-2 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            (!navi.superUserOnly || userType === 99999) && (
              <NavItem key={index} className="sidenav-bg">
                <Link
                  to={navi.href}
                  className={
                    location.pathname === navi.href
                      ? "active nav-link py-3"
                      : "nav-link text-secondary py-3"
                  }
                  style={{
                    borderRadius: '5px',
                  }}
                  onClick={() => {
                    if (window.innerWidth < 992) {
                      toggleSidebar();
                    }
                  }}
                >
                  <i className={`bi ${navi.icon} me-2`}></i>
                  <span className={isCollapsed ? 'd-none' : ''}>
                    {navi.title}
                  </span>
                </Link>
              </NavItem>
            )
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;