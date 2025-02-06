import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { getUserDetails, getToken } from '../auth';
import ProfileInfo from './ProfileInfo';
import ProfileSettings from './ProfileSettings';
import axiosInstance from '../../config';
import CustomAlert from '../CustomComponents/CustomAlert';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [projectCount, setProjectCount] = useState(0);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "info",
    duration: 2000
  });

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
        localStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
        window.dispatchEvent(new CustomEvent('userDetailsUpdated', { detail: updatedUserDetails }));
        setAlert({
          isOpen: true,
          message: 'Avatar updated successfully!',
          severity: 'success',
          duration: 2000
        });
      } else {
        setAlert({
          isOpen: true,
          message: response.data.errorMsg || 'Failed to update avatar',
          severity: 'error',
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setAlert({
        isOpen: true,
        message: 'Error uploading avatar',
        severity: 'error',
        duration: 2000
      });
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
  }, []);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        severity={alert.severity}
        autoHideDuration={alert.duration}
      />
      <Row className="h-100">
        <Col xs="12" md="12" lg="3" className="h-150">
          <ProfileInfo 
            userDetails={userDetails} 
            projectCount={projectCount} 
            onEditAvatar={handleEditAvatar}
          />
        </Col>
        <Col xs="12" md="12" lg="9" className="h-150">
          <ProfileSettings 
            userDetails={userDetails} 
            autocomplete="new-password"
          />
        </Col>
      </Row>
    </div>
  );
};

export default Profile;