import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert } from 'reactstrap';
import axios from "axios";
import axiosInstance from '../../config'; 
import { getToken } from '../../auth/auth';

const DeleteRoomTypeModal = ({ isOpen, toggle, selectedRoomType, onRoomTypeDeleted }) => {
  const [error, setError] = useState("");

  const handleDeleteRoomType = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError("No token found, please log in again.");
        return;
      }

      const response = await axiosInstance.delete(
        `/project-rooms/${selectedRoomType.projectRoomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        onRoomTypeDeleted(selectedRoomType.projectRoomId);
        toggle();
      } else {
        setError("Error deleting room type: " + response.data.errorMsg);
      }
    } catch (error) {
      setError("An unexpected error occurred while deleting the room type.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Confirm Delete</ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        Are you sure you want to delete this room type?
      </ModalBody>
      <ModalFooter>
        <Button 
          color="danger" 
          onClick={handleDeleteRoomType}
          size="sm"
          style={{ fontWeight: "bold" }}
        >
          Delete
        </Button>{' '}
        <Button color="secondary" onClick={toggle} size="sm">
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteRoomTypeModal;