import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  // 移除未使用的导入
  // CardSubtitle,
  // Row,
  // Col,
} from 'reactstrap';
import { Edit } from '@mui/icons-material';
import FolderIcon from '@mui/icons-material/Folder';
import defaultAvatar from '../../assets/images/users/normal_user.jpg';
import './ProfileInfo.css';

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

  const getUserTypeLabel = () => {
    switch(userDetails.userType) {
      case 0: return 'Normal User';
      case 1: return 'Project User';
      case 99999: return 'Super User';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="profile-card shadow-sm">
      <CardBody className="d-flex flex-column">
        <div className="text-center mt-2 mt-md-4 avatar-container">
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
          <CardTitle tag="h4" className="mt-3 mb-0">
            {userDetails.username}
          </CardTitle>
          <span className="user-type-badge">
            {getUserTypeLabel()}
          </span>
        </div>
        
        <div className="project-count-wrapper mt-3">
          <a href="/admin/projects" className="text-decoration-none d-flex align-items-center">
            <FolderIcon className="project-count-icon" />
            <span className="font-medium text-dark">{projectCount} Projects</span>
          </a>
        </div>
        
        <div className="user-info-section mt-4">
          <div className="profile-info-item">
            <span className="profile-info-label">Nickname</span>
            <span className="profile-info-value">{userDetails.nickName || 'Not Set'}</span>
          </div>
          
          <div className="profile-info-item">
            <span className="profile-info-label">Email</span>
            <span className="profile-info-value text-break">{userDetails.email}</span>
          </div>
          
          <div className="profile-info-item">
            <span className="profile-info-label">Country Code</span>
            <span className="profile-info-value">{userDetails.countryCode || 'Not Set'}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfileInfo;
