import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import axiosInstance from '../../../config'; 
import { getToken } from '../../auth/auth';

const EditRoomTypeModal = ({ isOpen, toggle, roomType, onRoomTypeUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    typeCode: '',
  });
  const [error, setError] = useState('');
  const [successAlert, setSuccessAlert] = useState(false);

  useEffect(() => {
    if (roomType) {
      setFormData({
        name: roomType.name || '',
        typeCode: roomType.typeCode || '',
      });
    }
  }, [roomType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    if (!roomType) return false;
    const { name, typeCode } = formData;
    return name.trim() !== '' || typeCode.trim() !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!roomType) {
      setError("Room type information is missing. Please try again.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token not found, please log in again");
      return;
    }

    const attributes = {};
    if (formData.name !== roomType.name && formData.name.trim() !== '') attributes.name = formData.name.trim();
    if (formData.typeCode !== roomType.typeCode && formData.typeCode.trim() !== '') attributes.typeCode = formData.typeCode.trim();

    if (Object.keys(attributes).length === 0) {
      setError("No changes detected. Please modify at least one field.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/project-rooms/modify`,
        { 
          projectRoomId: roomType.projectRoomId,
          attributes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSuccessAlert(true);
        setError("");
        setTimeout(() => {
          setSuccessAlert(false);
          toggle();
          onRoomTypeUpdated(response.data.data);
        }, 1000);
      } else {
        setError(response.data.errorMsg || "Error updating room type");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (!roomType) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Edit Room Type</ModalHeader>
      <ModalBody>
        {successAlert && <Alert color="success">Room type updated successfully</Alert>}
        {error && <Alert color="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Room Type Name:</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="typeCode">Type Code:</Label>
            <Input
              type="text"
              name="typeCode"
              id="typeCode"
              value={formData.typeCode}
              onChange={handleChange}
            />
          </FormGroup>
          <Button 
            color="primary" 
            size="sm" 
            type="submit" 
            style={{ backgroundColor: "#fbcd0b", borderColor: "#fbcd0b", fontWeight: "bold" }}
            disabled={!isFormValid()}
          >
            Update
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default EditRoomTypeModal;