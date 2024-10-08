import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { getUserDetails, getToken } from '../auth/auth';
import ProfileInfo from './ProfileInfo';
import ProfileSettings from './ProfileSettings';
import axiosInstance from '../../config';
import Alert from "@mui/material/Alert";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [projectCount, setProjectCount] = useState(0);
  const [alert, setAlert] = useState({ show: false, message: '', severity: '' });

  const fetchProjectList = async () => {
    try {
      const token = getToken();
      const response = await axiosInstance.get('/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        return response.data.data || [];
      } else {
        console.error('Failed to fetch projects:', response.data.errorMsg);
        return [];
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };

  const handleEditAvatar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = getToken();
      const response = await axiosInstance.post('/users/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const updatedUserDetails = { ...userDetails, headPic: response.data.data };
        setUserDetails(updatedUserDetails);
        // 更新本地存储
        localStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
        // 如果您使用了其他持久化方法，也要在这里更新
        window.dispatchEvent(new CustomEvent('userDetailsUpdated', { detail: updatedUserDetails }));
        setAlert({ show: true, message: 'Avatar updated successfully!', severity: 'success' });
      } else {
        setAlert({ show: true, message: response.data.errorMsg || 'Failed to update avatar', severity: 'error' });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setAlert({ show: true, message: 'Error uploading avatar', severity: 'error' });
    }
  };

  useEffect(() => {
    const details = getUserDetails();
    setUserDetails(details);

    const getProjects = async () => {
      const projects = await fetchProjectList();
      setProjectCount(projects.length);
    };

    getProjects();

    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {alert.show && (
        <Alert 
          severity={alert.severity}
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
        >
          {alert.message}
        </Alert>
      )}
      <Row className="h-100">
        <Col xs="12" md="12" lg="4" className="h-100">
          <ProfileInfo 
            userDetails={userDetails} 
            projectCount={projectCount} 
            onEditAvatar={handleEditAvatar}
          />
        </Col>
        <Col xs="12" md="12" lg="8" className="h-100">
          <ProfileSettings userDetails={userDetails} />
        </Col>
      </Row>
    </>
  );
};

export default Profile;