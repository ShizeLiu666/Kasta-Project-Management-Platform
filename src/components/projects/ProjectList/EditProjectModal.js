import React, { useState, useEffect } from "react";
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
import { getToken } from '../../auth/auth';
import axiosInstance from '../../../config'; 

const EditProjectModal = ({ isOpen, toggle, fetchProjects, project }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    des: "",
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        address: project.address || "",
        des: project.des || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [project]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    if (!project) return false;
    const { name, address, des, currentPassword, newPassword } = formData;
    const isChanged = name !== "" || 
                      address !== "" || 
                      des !== "" || 
                      newPassword !== "";
    return currentPassword !== "" && isChanged;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!project) {
      setError("Project information is missing. Please try again.");
      return;
    }

    if (formData.currentPassword !== project.password) {
      setError("Current password is incorrect. Please try again.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token not found, please log in again");
      return;
    }

    const attributes = {};
    if (formData.name !== project.name && formData.name !== "") attributes.name = formData.name;
    if (formData.address !== project.address && formData.address !== "") attributes.address = formData.address;
    if (formData.des !== project.des && formData.des !== "") attributes.des = formData.des;
    if (formData.newPassword !== "") attributes.password = formData.newPassword;

    if (Object.keys(attributes).length === 0) {
      setError("No changes detected. Please modify at least one field.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const updatedFormData = new FormData();
    updatedFormData.append('projectId', project.projectId);
    Object.keys(attributes).forEach(key => {
      updatedFormData.append(key, attributes[key]);
    });

    // 添加这个循环来打印 FormData 的内容
    for (let pair of updatedFormData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const response = await axiosInstance.put(
        `/projects/modify`,
        { 
          projectId: project.projectId,
          attributes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'application/json'
          },
        }
      );
      console.log("Server response:", response.data);
      if (response.data.success) {
        setSuccessAlert(true);
        setError("");
        setTimeout(() => {
          setSuccessAlert(false);
          toggle();
          fetchProjects();
        }, 1000);
      } else {
        setError(response.data.errorMsg || "Error updating project");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error details:", err.response ? err.response.data : err);
      setError("An unexpected error occurred.");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (!project) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Edit Project</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {successAlert && <Alert color="success">Project updated successfully</Alert>}
          {error && <Alert color="danger">{error}</Alert>}
          <FormGroup>
            <Label for="name">Project Name:</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="address">Address:</Label>
            <Input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="des">Description:</Label>
            <Input
              type="text"
              name="des"
              id="des"
              value={formData.des}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="currentPassword">
              <span style={{ color: "red" }}>*</span> Current Password:
            </Label>
            <Input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="newPassword">New Password:</Label>
            <Input
              type="password"
              name="newPassword"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </FormGroup>
          <Button
            color="secondary"
            type="submit"
            style={{
              backgroundColor: "#fbcd0b",
              borderColor: "#fbcd0b",
              fontWeight: "bold",
            }}
            disabled={!isFormValid()}
          >
            Update
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default EditProjectModal;