import React from "react";
import { Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import '../assets/scss/loader/Sidebar.css'

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
];

const Sidebar = ({ userType }) => {
  // console.log("User Type in Sidebar:", userType)
  let location = useLocation();

  return (
    <div>
      <div className="d-flex align-items-center"></div>
      <div className="p-3 mt-2">
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
                >
                  <i className={navi.icon}></i>
                  <span className="ms-3 d-inline-block">{navi.title}</span>
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