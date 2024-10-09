import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Row,
  Col,
} from 'reactstrap';
import { Edit } from '@mui/icons-material'; // 导入编辑图标
import defaultAvatar from '../../assets/images/users/normal_user.jpg';
import './ProfileInfo.css'; // 确保创建这个 CSS 文件

const ProfileInfo = ({ userDetails: initialUserDetails, projectCount, onEditAvatar }) => {
  const [userDetails, setUserDetails] = useState(initialUserDetails);

  useEffect(() => {
    const handleUserDetailsUpdate = (event) => {
      setUserDetails(event.detail);
    };

    const handleStorageChange = (e) => {
      if (e.key === 'userDetailsUpdated') {
        const updatedUserDetails = JSON.parse(e.newValue);
        setUserDetails(updatedUserDetails);
      }
    };

    window.addEventListener('userDetailsUpdated', handleUserDetailsUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('userDetailsUpdated', handleUserDetailsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAvatarClick = () => {
    document.getElementById('avatarInput').click();
  };

  return (
    <Card className="h-100">
      <CardBody className="d-flex flex-column">
        <div className="text-center mt-4 avatar-container">
          <div className="avatar-wrapper">
            <img 
              src={userDetails.headPic || defaultAvatar} 
              className="rounded-circle avatar-image" 
              width="150" 
              height="150"
              alt="User Avatar" 
            />
            <div className="avatar-overlay" onClick={handleAvatarClick}>
              <Edit />
              <span>Edit</span>
            </div>
            <input
              type="file"
              id="avatarInput"
              style={{ display: 'none' }}
              onChange={onEditAvatar}
              accept="image/*"
            />
          </div>
          <CardTitle tag="h4" className="mt-2 mb-0">
            {userDetails.username}
          </CardTitle>
          <CardSubtitle className="text-muted">
            {userDetails.userType === 0 ? 'Owner' : userDetails.userType === 99999 ? 'Super User' : 'Unknown'}
          </CardSubtitle>
        </div>
        <Row className="text-center justify-content-md-center mt-2">
          <Col xs="4">
            <a href="/admin/projects" className="text-dark fw-bold text-decoration-none">
              <i className="bi-folder2-open"></i>
              <span className="font-medium ms-2">{projectCount}</span>
            </a>
          </Col>
        </Row>
        <div className="mt-4">
          <CardSubtitle className="text-muted fs-5">Nickname</CardSubtitle>
          <CardTitle tag="h5">{userDetails.nickName}</CardTitle>

          <CardSubtitle className="text-muted fs-5 mt-3">Email address</CardSubtitle>
          <CardTitle tag="h5">{userDetails.email}</CardTitle>

          <CardSubtitle className="text-muted fs-5 mt-3">Country Code</CardSubtitle>
          <CardTitle tag="h5">{userDetails.countryCode}</CardTitle>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfileInfo;