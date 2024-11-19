import React, { useState, useEffect } from 'react';
import CustomModal from '../../../CustomComponents/CustomModal';
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth';

const LeaveProjectModal = ({ isOpen, toggle, projectId, onLeaveSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successAlert, setSuccessAlert] = useState('');

  const clearState = () => {
    setError('');
    setSuccessAlert('');
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!isOpen) {
      clearState();
    }
  }, [isOpen]);

  const handleLeaveProject = async () => {
    setIsSubmitting(true);
    clearState();

    try {
      const token = getToken();
      const response = await axiosInstance.post(`/projects/${projectId}/leave`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSuccessAlert('You have successfully left the project.');
        onLeaveSuccess({ success: true, data: response.data });
        await Promise.all([
          new Promise(resolve => setTimeout(resolve, 1000)),
          new Promise(resolve => {
            setTimeout(() => {
              clearState();
              toggle();
              resolve();
            }, 1000);
          })
        ]);
      } else {
        setError(response.data.errorMsg || 'Failed to leave the project');
        onLeaveSuccess({ success: false, errorMsg: response.data.errorMsg });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errorMsg || 
                      err.message || 
                      'An error occurred while leaving the project';
      setError(errorMsg);
      onLeaveSuccess({ success: false, errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Leave Project"
      onSubmit={handleLeaveProject}
      submitText="Leave Project"
      cancelText="Cancel"
      submitButtonColor="#dc3545"
      error={error}
      successAlert={successAlert}
      isSubmitting={isSubmitting}
    >
      <p>Are you sure you want to leave this project? This action cannot be undone.</p>
    </CustomModal>
  );
};

export default LeaveProjectModal;
