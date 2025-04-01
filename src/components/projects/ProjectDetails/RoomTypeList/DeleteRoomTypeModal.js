import React, { useState } from "react";
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth/auth';
import CustomModal from '../../../CustomComponents/CustomModal';

const DeleteRoomTypeModal = ({ isOpen, toggle, selectedRoomType, onRoomTypeDeleted }) => {
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteRoomType = async () => {
    const token = getToken();
    if (!token) {
      setError("No token found, please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.delete(
        `/project-rooms/${selectedRoomType.projectRoomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.data.success) {
        setSuccessAlert("Room type deleted successfully!");
        setTimeout(() => {
          setSuccessAlert("");
          toggle();
          onRoomTypeDeleted(selectedRoomType.projectRoomId);
        }, 1000);
      } else {
        setError(response.data.errorMsg || "Error deleting room type.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedRoomType) {
    return null;
  }

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Confirm Delete"
      onSubmit={handleDeleteRoomType}
      submitText="Delete"
      successAlert={successAlert}
      error={error}
      isSubmitting={isSubmitting}
      submitButtonColor="#dc3545"  // 使用 Bootstrap 的 danger 颜色
    >
      <p>Are you sure you want to delete the room type "{selectedRoomType.name}"?</p>
    </CustomModal>
  );
};

export default DeleteRoomTypeModal;
