import React, { useState, useEffect } from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import HomeIcon from '@mui/icons-material/Home';
import defaultAvatar from '../../assets/images/users/normal_user.jpg';
import { countryOptions } from '../Login/CountryCodeSelect';
import axiosInstance from '../../config';
import { getToken } from '../auth';
import './DashboardUserInfo.css';

const UserInfo = ({ userDetails }) => {
  const showProjects = userDetails.userType === 1 || userDetails.userType === 99999;
  const [projectCount, setProjectCount] = useState(0);
  const [networkCount, setNetworkCount] = useState(0);

  // 获取项目数量
  const fetchProjectCount = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await axiosInstance.get("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const acceptedProjects = response.data.data.filter(project => 
          project.role === 'OWNER' || project.memberStatus === 'ACCEPT'
        );
        setProjectCount(acceptedProjects.length);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // 获取网络数量
  const fetchNetworkCount = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await axiosInstance.get('/networks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setNetworkCount(response.data.data.length);
      }
    } catch (error) {
      console.error("Error fetching networks:", error);
    }
  };

  useEffect(() => {
    if (showProjects) {
      fetchProjectCount();
    }
    fetchNetworkCount();
  }, [showProjects]);

  // 根据 countryCode 获取国家名称
  const getCountryName = (code) => {
    if (!code) return 'Not Set';
    const country = countryOptions.find(country => country.code === code);
    return country ? country.en : 'Not Set';
  };

  return (
    <div 
      className="user-info-card" 
      style={{ 
        height: '500px',
        position: 'relative'
      }}
    >
      <div className="overlay"></div>
      
      <div className="user-info-content">
        <div className="user-info-header">
          <div className="avatar-wrapper-dashboard">
            {userDetails.headPic ? (
              <img
                src={userDetails.headPic}
                alt="User Avatar"
                className="avatar-image-dashboard"
              />
            ) : (
              <img
                src={defaultAvatar}
                alt="Default Avatar"
                className="avatar-image-dashboard"
              />
            )}
          </div>
          <h3 className="user-name" style={{
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            fontWeight: 600
          }}>
            {userDetails.username}
          </h3>
          <p className="user-role">
            {userDetails.userType === 99999 ? 'Super User' : 
             userDetails.userType === 1 ? 'Project Member' : 'Normal User'}
          </p>
        </div>
        
        <div className="user-stats">
          {showProjects && (
            <div className="stat-item">
              <FolderIcon sx={{ color: '#fff', fontSize: 28 }} />
              <div className="stat-info">
                <span className="stat-value">{projectCount}</span>
                <span className="stat-label">Projects</span>
              </div>
            </div>
          )}
          <div className="stat-item">
            <HomeIcon sx={{ color: '#fff', fontSize: 28 }} />
            <div className="stat-info">
              <span className="stat-value">{networkCount}</span>
              <span className="stat-label">Networks</span>
            </div>
          </div>
        </div>

        <div className="user-details">
          <div className="detail-item">
            <span className="detail-label">Nickname</span>
            <span className="detail-value">
              {userDetails.nickName || 'Not Set'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{userDetails.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Country</span>
            <span className="detail-value">
              {getCountryName(userDetails.countryCode)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;