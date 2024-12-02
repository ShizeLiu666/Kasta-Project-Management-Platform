import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth';
import CustomModal from '../../../CustomComponents/CustomModal';

const EditRoomTypeModal = ({ isOpen, toggle, roomType, onRoomTypeUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    typeCode: '',
    des: ''
  });
  const [error, setError] = useState('');
  const [successAlert, setSuccessAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (roomType) {
      setFormData({
        name: roomType.name || '',
        typeCode: roomType.typeCode || '',
        des: roomType.des || ''
      });
    }
  }, [roomType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    if (!roomType) return false;
    
    // 检查每个字段是否有实际变更，同时处理可能的undefined值
    const hasNameChange = formData.name.trim() !== (roomType.name || '').trim();
    const hasTypeCodeChange = formData.typeCode.trim() !== (roomType.typeCode || '').trim();
    const hasDesChange = formData.des.trim() !== (roomType.des || '').trim();
    
    return hasNameChange || hasTypeCodeChange || hasDesChange;
  };

  const handleSubmit = async () => {
    if (!roomType) {
      setError("Room type information is missing. Please try again.");
      return;
    }

    if (!isFormValid()) {
      setError("No changes detected. Please modify at least one field.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token not found, please log in again");
      return;
    }

    const attributes = {};
    // 安全地处理可能为undefined的值
    const currentName = (roomType.name || '').trim();
    const currentTypeCode = (roomType.typeCode || '').trim();
    const currentDes = (roomType.des || '').trim();

    const newName = formData.name.trim();
    const newTypeCode = formData.typeCode.trim();
    const newDes = formData.des.trim();

    if (newName !== currentName) {
      attributes.name = newName;
    }
    if (newTypeCode !== currentTypeCode) {
      attributes.typeCode = newTypeCode;
    }
    if (newDes !== currentDes) {
      attributes.des = newDes;
    }

    if (Object.keys(attributes).length === 0) {
      setError("No changes detected. Please modify at least one field.");
      return;
    }

    setIsSubmitting(true);
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
        setSuccessAlert("Room type updated successfully!");
        setTimeout(() => {
          setSuccessAlert("");
          toggle();
          onRoomTypeUpdated(response.data.data);
        }, 1000);
      } else {
        setError(response.data.errorMsg || "Error updating room type");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!roomType) {
    return null;
  }

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Edit Room Type"
      onSubmit={handleSubmit}
      submitText="Update"
      successAlert={successAlert}
      error={error}
      isSubmitting={isSubmitting}
      submitButtonColor="#007bff"
      disabled={!isFormValid()}
    >
      <Form>
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

export default EditRoomTypeModal;
