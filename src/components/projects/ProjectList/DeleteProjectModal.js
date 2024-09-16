import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert } from "reactstrap";
import axios from "axios";

const DeleteProjectModal = ({ isOpen, toggle, onDelete, projectId }) => {
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.delete(`/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSuccessAlert(true);
        setTimeout(() => {
          setSuccessAlert(false);
          toggle(); // Close modal after success
          onDelete(); // Call the onDelete function to refresh the project list
        }, 1000);
      } else {
        setError(response.data.errorMsg || "Error deleting project.");
        setTimeout(() => setError(""), 3000); // Keep the modal open, alert for 3 seconds
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Confirm Delete</ModalHeader>
      <ModalBody>
        {successAlert && <Alert color="success">Project deleted successfully!</Alert>}
        {error && <Alert color="danger">{error}</Alert>}
        Are you sure you want to delete this Project?
      </ModalBody>
      <ModalFooter>
        <Button 
          color="danger" 
          onClick={handleDelete}
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

export default DeleteProjectModal;