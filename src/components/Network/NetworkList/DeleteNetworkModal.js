import React, { useState, useEffect } from "react";
import { getToken } from '../../auth';
import axiosInstance from '../../../config';
import CustomModal from '../../CustomComponents/CustomModal';

const DeleteNetworkModal = ({ isOpen, toggle, onDelete, network }) => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError("");
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!network) {
      setError("Network information is missing. Please try again.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token not found, please log in again");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.delete(`/networks/${network.networkId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toggle();
        if (onDelete) {
          onDelete('Network deleted successfully');
        }
      } else {
        setError(response.data.errorMsg || "Error deleting network.");
      }
    } catch (err) {
      setError(err.response?.data?.errorMsg || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!network) {
    return null;
  }

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Confirm Delete"
      onSubmit={handleDelete}
      submitText="Delete"
      error={error}
      isSubmitting={isSubmitting}
      submitButtonColor="#dc3545"
    >
      <p>Are you sure you want to delete the network "{network.meshName}"?</p>
      <p style={{ color: '#dc3545' }}>This action cannot be undone.</p>
    </CustomModal>
  );
};

export default DeleteNetworkModal;
