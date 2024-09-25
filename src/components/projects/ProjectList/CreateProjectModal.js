import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import axiosInstance from '../../../config'; 
import { getToken } from '../../auth/auth'; // 导入 getToken 函数

const CreateProjectModal = ({ isOpen, toggle, fetchProjects }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [des, setDes] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState(false); // Track success alert

  // Check if the required fields are empty
  const isFormValid = name && password && address;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken(); // 使用 getToken 函数获取 token
    if (!token) {
      setError("Authentication token not found, please log in again");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/projects",
        { name, address, des, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSuccessAlert(true);
        setError(""); // Clear any previous errors
        setTimeout(() => {
          setSuccessAlert(false);
          toggle(); // Close modal after 1 second
          fetchProjects(); // Refresh the project list after creating a new project
        }, 1000);
      } else {
        setError(response.data.errorMsg || "Error creating project.");
        setTimeout(() => setError(""), 3000); // Keep the modal open, alert for 3 seconds
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setTimeout(() => setError(""), 3000); // Keep the modal open, alert for 3 seconds
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Create New Project</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {successAlert && <Alert color="success">Project created successfully</Alert>}
          {error && <Alert color="danger">{error}</Alert>}
          <FormGroup>
            <Label for="name">
              <span style={{ color: "red" }}>*</span> Project Name:
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">
              <span style={{ color: "red" }}>*</span> Password:
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
          <FormGroup>
            <Label for="address">
              <span style={{ color: "red" }}>*</span> Address:
            </Label>
            <Input
              type="text"
              name="address"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="des">Description:</Label>
            <Input
              type="text"
              name="des"
              id="des"
              value={des}
              onChange={(e) => setDes(e.target.value)}
            />
          </FormGroup>
          <Button
            color="secondary"
            size="sm"
            type="submit"
            style={{
              backgroundColor: "#fbcd0b",
              borderColor: "#fbcd0b",
              fontWeight: "bold",
            }}
            disabled={!isFormValid} // Disable the button if form is not valid
          >
            Create
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CreateProjectModal;