import React, { useState, useEffect } from "react";
import { getToken } from '../auth';
import axiosInstance from '../../config'; 
import CustomModal from '../CustomComponents/CustomModal';

const EditAuthCodeModal = ({ isOpen, toggle, authCode, onEditAuthCode }) => {
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccessAlert("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!authCode) {
      setError("Authorization code information is missing. Please try again.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token not found, please log in again");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.put(
        `/authorization-codes/update-validity/${authCode.code}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            isValid: !authCode.valid
          }
        }
      );

      if (response.data.success) {
        setSuccessAlert("Authorization code updated successfully!");
        setTimeout(() => {
          setSuccessAlert("");
          toggle();
          onEditAuthCode({ ...authCode, valid: !authCode.valid });
        }, 1000);
      } else {
        setError(response.data.errorMsg || "Error updating authorization code.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authCode) {
    return null;
  }

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Confirm Update"
      onSubmit={handleSubmit}
      submitText="Update"
      successAlert={successAlert}
      error={error}
      isSubmitting={isSubmitting}
      submitButtonColor="#007bff"
    >
      <p>
        Are you sure you want to change the status of the authorization code "{authCode.code}" to {authCode.valid ? 'invalid' : 'valid'}?
      </p>
    </CustomModal>
  );
};

export default EditAuthCodeModal;