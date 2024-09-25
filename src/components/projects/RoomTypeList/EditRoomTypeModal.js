import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import axios from 'axios';
import axiosInstance from '../../config'; 
import { getToken } from '../../auth/auth';

const EditRoomTypeModal = ({ isOpen, toggle, roomType, onRoomTypeUpdated }) => {
  const [name, setName] = useState(roomType.name);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Room Type Name cannot be empty');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setError('No token found, please log in again.');
        return;
      }

      const response = await axiosInstance.post(
        '/project-rooms',
        {
          projectId: roomType.projectId,
          name,
          typeCode: roomType.typeCode,
          des: roomType.des,
          iconUrl: roomType.iconUrl,
          projectRoomId: roomType.projectRoomId, // 添加这个字段来表示这是一个更新操作
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        onRoomTypeUpdated(response.data.data);
        toggle();
      } else {
        setError('Error updating room type: ' + response.data.errorMsg);
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      console.error('Error updating room type:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Edit Room Type</ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">New Room Type Name:</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>
          <Button 
            color="primary" 
            size="sm" 
            type="submit" 
            style={{ backgroundColor: "#fbcd0b", borderColor: "#fbcd0b", fontWeight: "bold" }}
            disabled={!name.trim()} // 禁用按钮如果名称为空
          >
            Update
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default EditRoomTypeModal;