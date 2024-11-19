import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../CustomComponents/CustomModal';
import axiosInstance from '../../config';
import { getToken } from '../auth';

const DeleteAccountModal = ({ isOpen, toggle }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = getToken();
      const response = await axiosInstance.delete('/users/delete', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // 清除本地存储
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        const rememberedPassword = localStorage.getItem('rememberedPassword');
        
        localStorage.clear();
        sessionStorage.clear();
        
        if (rememberedUsername) {
          localStorage.setItem('rememberedUsername', rememberedUsername);
        }
        if (rememberedPassword) {
          localStorage.setItem('rememberedPassword', rememberedPassword);
        }

        // 重定向到登录页面
        navigate("/login");
      } else {
        setError(response.data.errorMsg || "Failed to delete account.");
      }
    } catch (error) {
      setError("An error occurred while deleting the account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Delete Account"
      onSubmit={handleConfirmDelete}
      submitText="Delete"
      cancelText="Cancel"
      submitButtonColor="#dc3545"
      cancelButtonColor="#6c757d"
      isSubmitting={isSubmitting}
      error={error}
    >
      <p>Are you sure you want to delete your account? This action cannot be undone.</p>
    </CustomModal>
  );
};

export default DeleteAccountModal;
