import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import axiosInstance from '../../../config'; 
import { getToken } from '../../auth/auth';
import CustomModal from '../../CustomModal';

const CreateRoomTypeModal = ({ isOpen, toggle, projectId, onRoomTypeCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    typeCode: "",
    des: "",
    authorizationCode: ""
  });
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTypeCodeManuallyEdited, setIsTypeCodeManuallyEdited] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", typeCode: "", des: "", authorizationCode: "" });
      setError("");
      setSuccessAlert("");
      setIsTypeCodeManuallyEdited(false);
    }
  }, [isOpen]);

  const generateTypeCode = (name) => {
    const words = name
      .split(" ")
      .filter((word) => word.toLowerCase() !== "room" && word.trim() !== "");
    const initials = words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("");
    return initials;
  };

  useEffect(() => {
    if (!isTypeCodeManuallyEdited) {
      setFormData(prev => ({ ...prev, typeCode: generateTypeCode(formData.name) }));
    }
  }, [formData.name, isTypeCodeManuallyEdited]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'typeCode') {
      setIsTypeCodeManuallyEdited(true);
    }
  };

  const isFormValid = () => {
    return formData.name && formData.typeCode && formData.authorizationCode;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError("Please fill in all required fields.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("No token found, please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        "/project-rooms",
        {
          projectId,
          ...formData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSuccessAlert("Room type created successfully!");
        setTimeout(() => {
          setSuccessAlert("");
          toggle();
          onRoomTypeCreated(response.data.data);
        }, 1000);
      } else {
        setError(response.data.errorMsg || "Error creating room type.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Create New Room Type"
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
          <Label for="authorizationCode">
            <span style={{ color: "red" }}>*</span> Auth Code:
          </Label>
          <Input
            type="text"
            name="authorizationCode"
            id="authorizationCode"
            value={formData.authorizationCode}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="name">
            <span style={{ color: "red" }}>*</span> Room Type Name:
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
        <FormGroup>
          <Label for="typeCode">
            <span style={{ color: "red" }}>*</span> Room Type Code:
          </Label>
          <Input
            type="text"
            name="typeCode"
            id="typeCode"
            value={formData.typeCode}
            onChange={handleChange}
            required
          />
        </FormGroup>
        {/* <FormGroup>
          <Label for="des">Description:</Label>
          <Input
            type="text"
            name="des"
            id="des"
            value={formData.des}
            onChange={handleChange}
          />
        </FormGroup> */}
      </Form>
    </CustomModal>
  );
};

export default CreateRoomTypeModal;