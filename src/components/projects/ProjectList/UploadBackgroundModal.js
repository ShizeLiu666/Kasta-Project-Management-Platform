import React, { useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import axiosInstance from '../../../config';
import { getToken } from '../../auth/auth';
import CustomModal from '../../CustomModal';

const UploadBackgroundModal = ({ isOpen, toggle, projectId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [successAlert, setSuccessAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsSubmitting(true);
    try {
      const token = getToken();
      const response = await axiosInstance.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const updateResponse = await updateProjectBackground(response.data.data);
        if (updateResponse.data.success) {
          setSuccessAlert('Background image updated successfully!');
          setTimeout(() => {
            setSuccessAlert('');
            toggle();
            onUploadSuccess(updateResponse.data.data); // 返回更新后的项目信息
          }, 2000);
        } else {
          setError(updateResponse.data.errorMsg || 'Failed to update project background.');
        }
      } else {
        setError(response.data.errorMsg || 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('An error occurred while uploading the image.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProjectBackground = async (imageUrl) => {
    try {
      const token = getToken();
      return await axiosInstance.put(
        `/projects/modify`,
        { 
          projectId: projectId,
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
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Upload Background Image"
      onSubmit={handleSubmit}
      submitText="Upload"
      successAlert={successAlert}
      error={error}
      isSubmitting={isSubmitting}
      disabled={!file}
      submitButtonColor="#fbcd0b"
    >
      <Form>
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
      </Form>
    </CustomModal>
  );
};

export default UploadBackgroundModal;
