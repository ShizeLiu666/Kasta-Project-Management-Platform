import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import axiosInstance from '../../../config'; 
import { getToken } from '../../auth';
import CustomModal from '../../CustomComponents/CustomModal';

const CreateProjectModal = ({ isOpen, toggle, fetchProjects }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    des: "",
    // password: ""  // 注释掉密码字段
  });
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", address: "", des: "" });
      setError("");
      setSuccessAlert("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    return formData.name && formData.address;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError("Please fill in all required fields.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token not found, please log in again");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessAlert("");

    try {
      const response = await axiosInstance.post(
        "/projects",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSuccessAlert("Project created successfully!");
        fetchProjects();
        toggle();
      } else {
        setError(response.data.errorMsg || "Error creating project.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Create New Project"
      onSubmit={handleSubmit}
      submitText="Create"
      successAlert={successAlert}
      error={error}
      isSubmitting={isSubmitting}
      disabled={!isFormValid()}
      submitButtonColor="#fbcd0b"
    >
      <Form>
        <FormGroup>
          <Label for="name">
            <span style={{ color: "red" }}>*</span> Project Name:
          </Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        {/* 注释掉密码字段
        <FormGroup>
          <Label for="password">
            <span style={{ color: "red" }}>*</span> Password:
          </Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormGroup>
        */}
        <FormGroup>
          <Label for="address">
            <span style={{ color: "red" }}>*</span> Address:
          </Label>
          <Input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
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
      </Form>
    </CustomModal>
  );
};

export default CreateProjectModal;
