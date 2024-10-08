import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavbarBrand,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import kasta_logo from "../assets/images/logos/kasta_logo.png";
import '../assets/scss/loader/Header.css';
import { getUserDetails } from '../components/auth/auth';
import defaultAvatar from '../assets/images/users/normal_user.jpg';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatar);
  const navigate = useNavigate();

  const updateAvatar = (userDetails) => {
    setAvatarSrc(userDetails?.headPic || defaultAvatar);
  };

  useEffect(() => {
    // const storedUsername = getUsername();
    // if (storedUsername) {
    //   setUsername(storedUsername);
    // }
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
  const Handletoggle = () => setIsOpen(!isOpen);
  const showMobilemenu = () => document.getElementById("sidebarArea").classList.toggle("showSidebar");
  const toggleModal = () => setModalOpen(!modalOpen);

  const handleLogout = () => {
    console.log("Logout button clicked");
    localStorage.clear(); // Clear localStorage
    sessionStorage.clear(); // Clear sessionStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <Navbar dark expand="md" className="fix-header header-background">
      <div className="d-flex align-items-center">
        <NavbarBrand href="/admin/projects">
          <img src={kasta_logo} alt="logo" className="logo" />
        </NavbarBrand>
        <Button
          color="primary"
          className="d-lg-none"
          onClick={() => showMobilemenu()}
        >
          <i className="bi bi-list"></i>
        </Button>
      </div>
      <div className="hstack gap-2">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>
      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          {/* Add more navigation items if needed */}
        </Nav>
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
            <DropdownItem>My Account</DropdownItem>
            <DropdownItem>Edit Profile</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={toggleModal}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Collapse>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Confirm Logout</ModalHeader>
        <ModalBody>
          Are you sure you want to log out?
        </ModalBody>
        <ModalFooter>
          <Button 
            onClick={handleLogout}
            size="sm"
            style={{ backgroundColor: "#fbcd0b", borderColor: "#fbcd0b", fontWeight: "bold" }}
          >
            Yes, Logout
          </Button>{' '}
          <Button color="secondary" onClick={toggleModal} size="sm">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Navbar>
  );
};

export default Header;