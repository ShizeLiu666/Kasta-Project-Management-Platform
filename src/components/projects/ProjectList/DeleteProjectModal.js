import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import { getToken } from '../../auth/auth';

const DeleteProjectModal = ({ isOpen, toggle, onDelete, project }) => {
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    // 每次 modal 打开时重置状态
    if (isOpen) {
      setError("");
      setSuccessAlert(false);
      setPassword("");
    }
  }, [isOpen]);

  const handleDelete = async (e) => {
    e.preventDefault();
    
    if (!project) {
      setError("Project information is missing. Please try again.");
      return;
    }

    // 首先验证密码
    if (password !== project.password) {
      setError("Incorrect password. Please try again.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token not found, please log in again");
      return;
    }

    try {
      const response = await axios.delete(`/projects/${project.projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSuccessAlert(true);
        setTimeout(() => {
          setSuccessAlert(false);
          toggle();
          onDelete();
        }, 1000);
      } else {
        setError(response.data.errorMsg || "Error deleting project.");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (!project) {
    return null; // 或者显示一个错误消息
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Confirm Delete</ModalHeader>
      <ModalBody style={{paddingBottom: "0px"}}>
        {successAlert && <Alert color="success">Project deleted successfully!</Alert>}
        {error && <Alert color="danger">{error}</Alert>}
        <p>Are you sure you want to delete the project "{project.name}"?</p>
        <Form onSubmit={handleDelete}>
          <FormGroup>
            <Label for="password">
              <span style={{ color: "red" }}>*</span> Enter project password to confirm:
            </Label>
            <Input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button 
          color="danger" 
          onClick={handleDelete}
          style={{ fontWeight: "bold" }}
          disabled={!password}
        >
          Delete
        </Button>{' '}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteProjectModal;