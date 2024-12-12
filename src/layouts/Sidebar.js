import React from "react";
import { Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import '../assets/scss/loader/Sidebar.css'
import CloseIcon from '@mui/icons-material/Close';
import MenuOpenIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';
// import KeyboardArrowLeftTwoToneIcon from '@mui/icons-material/KeyboardArrowLeftTwoTone';
import MenuIcon from '@mui/icons-material/KeyboardArrowLeftTwoTone';

const navigation = [
  {
    title: "Projects",
    href: "/admin/projects",
    icon: 'bi-folder2-open',
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: 'bi-person-circle',
  },
  {
    title: "AuthCode",
    href: "/admin/auth-code-management",
    icon: 'bi-key',
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