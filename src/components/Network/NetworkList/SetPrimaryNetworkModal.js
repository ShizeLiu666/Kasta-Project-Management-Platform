import React, { useState } from 'react';
import CustomModal from '../../CustomComponents/CustomModal';
import axiosInstance from '../../../config';
import { getToken } from '../../auth/auth';

const SetPrimaryNetworkModal = ({ isOpen, toggle, network, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirmSetPrimary = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = getToken();
      const response = await axiosInstance.post(
        `/networks/${network.networkId}/set-primary-network`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        onSuccess('Primary network updated successfully');
        toggle();
      } else {
        setError(response.data.errorMsg || "Failed to set primary network.");
      }
    } catch (error) {
      setError(error.response?.data?.errorMsg || "An error occurred while setting primary network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Set Primary Network"
      onSubmit={handleConfirmSetPrimary}
      submitText="Confirm"
      cancelText="Cancel"
      submitButtonColor="#fbcd0b"
      isSubmitting={isSubmitting}
      error={error}
    >
      <p>Are you sure you want to set "{network?.meshName}" as your primary network?</p>
    </CustomModal>
  );
};

export default SetPrimaryNetworkModal; 