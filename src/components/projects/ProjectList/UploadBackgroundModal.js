import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import axiosInstance from '../../../config';
import { getToken } from '../../auth/auth';

const UploadBackgroundModal = ({ isOpen, toggle, projectId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid image file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = getToken();
      const response = await axiosInstance.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("File upload response:", response.data);  // 打印上传文件的响应

      if (response.data.success) {
        // 上传成功后，调用更新项目背景的 API
        const updateResponse = await updateProjectBackground(response.data.data);
        console.log("Project background update response:", updateResponse.data);  // 打印更新项目背景的响应
        
        setSuccess(true);
        setError('');
        onUploadSuccess(response.data.data);
        setTimeout(() => {
          setSuccess(false);
          toggle();
        }, 2000);
      } else {
        setError(response.data.errorMsg || 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('An error occurred while uploading the image.');
    }
  };

  const updateProjectBackground = async (imageUrl) => {
    try {
      const token = getToken();
      return await axiosInstance.put(
        `/projects/modify`,  // 修正的 API 端点
        { 
          projectId: projectId,  // 使用 projectId 而不是 projectRoomId
          attributes: { iconUrl: imageUrl }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
    } catch (error) {
      console.error('Error updating project background:', error);
      throw error;
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Upload Background Image</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">Background image updated successfully!</Alert>}
          <FormGroup>
            <Label for="backgroundFile">Select Image:</Label>
            <Input
              type="file"
              name="file"
              id="backgroundFile"
              onChange={handleFileChange}
              accept="image/*"
            />
          </FormGroup>
          <Button 
            color="secondary" 
            type="submit" 
            disabled={!file}
            style={{
              backgroundColor: "#fbcd0b",
              borderColor: "#fbcd0b",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Upload
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default UploadBackgroundModal;