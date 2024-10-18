import React, { useState } from 'react';
import CustomModal from '../../../CustomModal';
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth/auth';

const LeaveProjectModal = ({ isOpen, toggle, projectId, onLeaveSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successAlert, setSuccessAlert] = useState('');

  const handleLeaveProject = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccessAlert('');

    try {
      const token = getToken();
      const response = await axiosInstance.post(`/projects/${projectId}/leave`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSuccessAlert('You have successfully left the project.');
        setTimeout(() => {
          onLeaveSuccess();
          toggle();
        }, 2000);
      } else {
        setError(response.data.errorMsg || 'Failed to leave the project');
      }
    } catch (err) {
      setError('An error occurred while leaving the project');
      console.error('Error leaving project:', err);
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
      submitButtonColor="#dc3545"  // danger color for the leave button
      error={error}
      successAlert={successAlert}
      isSubmitting={isSubmitting}
    >
      <p>Are you sure you want to leave this project? This action cannot be undone.</p>
    </CustomModal>
  );
};

export default LeaveProjectModal;