import React, { useEffect } from "react";
import { Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import '../assets/scss/loader/Sidebar.css'
import CloseIcon from '@mui/icons-material/Close';
import MenuOpenIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';
// import KeyboardArrowLeftTwoToneIcon from '@mui/icons-material/KeyboardArrowLeftTwoTone';
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
  // {
  //   title: "Testing",
  //   href: "/admin/testing",
  //   icon: 'bi-file-earmark-excel-fill',
  // },
];

const Sidebar = ({ userType, toggleSidebar, isCollapsed }) => {
  let location = useLocation();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sidebarContainer = document.querySelector('.sidebar-container');
          if (sidebarContainer) {
            if (window.scrollY >= 10) {
              sidebarContainer.style.top = '0';
            } else {
              sidebarContainer.style.top = '64px';
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
          {filteredNavigation.map((navi, index) => (
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
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
