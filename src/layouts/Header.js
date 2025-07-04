import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button
} from "reactstrap";
import kasta_logo from "../assets/images/logos/kasta_logo.png";
import '../assets/scss/loader/Header.css';
import { getUserDetails } from '../components/auth/auth';
import defaultAvatar from '../assets/images/users/normal_user.jpg';
import CustomModal from '../components/CustomComponents/CustomModal';

const Header = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatar);
  const navigate = useNavigate();

  const updateAvatar = (userDetails) => {
    setAvatarSrc(userDetails?.headPic || defaultAvatar);
  };

  useEffect(() => {
    updateAvatar(getUserDetails());

    const handleUserDetailsUpdate = (event) => {
      updateAvatar(event.detail);
    };

    const handleStorageChange = (e) => {
      if (e.key === 'userDetailsUpdated') {
        const updatedUserDetails = JSON.parse(e.newValue);
        updateAvatar(updatedUserDetails);
      }
    };

    window.addEventListener('userDetailsUpdated', handleUserDetailsUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('userDetailsUpdated', handleUserDetailsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const showMobilemenu = () => {
    toggleSidebar();
  };
  const toggleLogoutModal = () => setLogoutModalOpen(!logoutModalOpen);

  const handleLogout = () => {
    // 保存 Remember Me 凭据
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    
    // 清除 localStorage 和 sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // 如果存在 Remember Me 凭据，则重新保存
    if (rememberedUsername) {
      localStorage.setItem('rememberedUsername', rememberedUsername);
    }
    if (rememberedPassword) {
      localStorage.setItem('rememberedPassword', rememberedPassword);
    }
    
    toggleLogoutModal();
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate('/admin/profile');
  };

  return (
    <>
      <Navbar dark expand="md" className="fix-header header-background">
        <div className="d-flex align-items-center">
          <NavbarBrand href="/admin/dashboard">
            <img src={kasta_logo} alt="logo" className="logo" />
          </NavbarBrand>
          <Button
            color="primary"
            className="d-lg-none"
            onClick={showMobilemenu}
          >
            <i className="bi bi-list"></i>
          </Button>
        </div>
        <div className="ms-auto d-flex align-items-center">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle color="transparent" className="d-flex align-items-center">
              <img
                src={avatarSrc}
                alt="profile"
                className="rounded-circle"
                width="45"
                height="45"
              />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Info</DropdownItem>
              <DropdownItem onClick={handleEditProfile}>Edit Profile</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={toggleLogoutModal}>Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Navbar>

      <CustomModal
        isOpen={logoutModalOpen}
        toggle={toggleLogoutModal}
        title="Confirm Logout"
        onSubmit={handleLogout}
        submitText="Yes, Logout"
        cancelText="Cancel"
        submitButtonColor="#fbcd0b"
        cancelButtonColor="#6c757d"
      >
        Are you sure you want to log out?
      </CustomModal>
    </>
  );
};

export default Header;
