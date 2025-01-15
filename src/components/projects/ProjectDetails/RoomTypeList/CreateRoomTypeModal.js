import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth';
import CustomModal from '../../../CustomComponents/CustomModal';
import CustomAlert from '../../../CustomComponents/CustomAlert';

const filter = createFilterOptions();

const CreateRoomTypeModal = ({ 
  isOpen, 
  toggle, 
  projectId, 
  onRoomTypeCreated,
  validAuthCodes,
  refreshAuthCodes,
  existingRoomTypes
}) => {
  // console.log('CreateRoomTypeModal validAuthCodes:', validAuthCodes);
  
  const [formData, setFormData] = useState({
    name: "",
    typeCode: "",
    des: "",
    authorizationCode: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTypeCodeManuallyEdited, setIsTypeCodeManuallyEdited] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [nameError, setNameError] = useState("");

  const resetState = () => {
    setFormData({
      name: "",
      typeCode: "",
      des: "",
      authorizationCode: ""
    });
    setError("");
    setIsSubmitting(false);
    setShowCreateModal(true);
    setConfirmModalOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetState();
      refreshAuthCodes();
    }
  }, [isOpen, refreshAuthCodes]);

  const handleMainToggle = () => {
    resetState();
    toggle();
  };

  const handleConfirmCancel = () => {
    setConfirmModalOpen(false);
    setShowCreateModal(true);
  };

  const toggleConfirmModal = () => {
    if (!isSubmitting) {
      setConfirmModalOpen(!confirmModalOpen);
      setShowCreateModal(!showCreateModal);
    }
  };

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
    console.log('Form Data after handleChange:', formData);
    
    if (name === 'typeCode') {
      setIsTypeCodeManuallyEdited(true);
    }
    
    if (name === 'name') {
      const trimmedValue = value.trim();
      if (trimmedValue && existingRoomTypes?.some(
        room => room.name.toLowerCase() === trimmedValue.toLowerCase()
      )) {
        setNameError("* This room type name already exists");
      } else {
        setNameError("");
      }
    }
  };

  const handleAuthCodeChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      setFormData(prev => ({ ...prev, authorizationCode: newValue.trim() }));
    } else if (newValue && newValue.code) {
      setFormData(prev => ({ ...prev, authorizationCode: newValue.code.trim() }));
    } else if (newValue === null) {
      setFormData(prev => ({ ...prev, authorizationCode: '' }));
    }
    console.log('Form Data after handleAuthCodeChange:', formData);
  };

  const isFormValid = () => {
    console.log('Checking form validity:', {
      name: formData.name,
      typeCode: formData.typeCode,
      authCode: formData.authorizationCode,
      nameError
    });
    return formData.name && 
           formData.typeCode && 
           formData.authorizationCode && 
           !nameError;
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      setError("Please fill in all required fields.");
      return;
    }
    toggleConfirmModal();
  };

  const handleConfirmedSubmit = async () => {
    const token = getToken();
    if (!token) {
      setError("No token found, please log in again.");
      return;
    }

    setIsSubmitting(true);
    setError("");

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
        onRoomTypeCreated(response.data.data);
        toggle();
        setConfirmModalOpen(false);
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 1000);
        resetState();
      } else {
        setError(response.data.errorMsg || "Error creating room type.");
        setConfirmModalOpen(false);
        setShowCreateModal(true);
      }
    } catch (error) {
      setError("An unexpected error occurred.");
      setConfirmModalOpen(false);
      setShowCreateModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CustomModal
        isOpen={isOpen && showCreateModal}
        toggle={handleMainToggle}
        title="Create New Room Type"
        onSubmit={handleSubmit}
        submitText="Create"
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
            <Autocomplete
              id="auth-code-select"
              options={validAuthCodes || []}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                return `${option.code} (${10 - option.configUploadCount} uploads left)`;
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                return filtered;
              }}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.code}>
                  {`${option.code} (${10 - option.configUploadCount} uploads left)`}
                </Box>
              )}
              freeSolo
              selectOnFocus
              clearOnBlur={false}
              handleHomeEndKeys
              value={formData.authorizationCode}
              onChange={handleAuthCodeChange}
              onInputChange={(event, newInputValue) => {
                setFormData(prev => ({
                  ...prev,
                  authorizationCode: newInputValue.trim()
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Choose or enter an auth code"
                  fullWidth
                  className="custom-form-control"
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                />
              )}
            />
            <div style={{ 
              marginTop: '8px',
              fontSize: '0.875rem',
              color: '#666'
            }}>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ color: 'red', marginRight: '4px' }}>•</span>
                One authorization code can only be assigned to one room type
              </div>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ color: 'red', marginRight: '4px' }}>•</span>
                Authorization code binding cannot be revoked once assigned
              </div>
              <div>
                <span style={{ color: 'red', marginRight: '4px' }}>•</span>
                New authorization code usage limits: 10 times for web configuration uploads, 50 times for app configuration
              </div>
            </div>
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
            {nameError && (
              <div style={{ 
                color: '#dc3545', 
                fontSize: '0.875rem',
                marginTop: '4px' 
              }}>
                {nameError}
              </div>
            )}
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

      <CustomModal
        isOpen={confirmModalOpen}
        toggle={handleConfirmCancel}
        title="Confirm Creation"
        onSubmit={handleConfirmedSubmit}
        submitText="Yes, Create"
        cancelText="Cancel"
        submitButtonColor="#fbcd0b"
        cancelButtonColor="#6c757d"
        isSubmitting={isSubmitting}
        disabled={isSubmitting}
      >
        <div>
          <p style={{ marginBottom: '16px' }}>Please confirm the following details:</p>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            margin: 0,
            marginBottom: '16px'
          }}>
            <li><strong>Room Type Name:</strong> {formData.name}</li>
            <li><strong>Type Code:</strong> {formData.typeCode}</li>
            <li><strong>Auth Code:</strong> {formData.authorizationCode}</li>
          </ul>
          <p style={{ 
            color: '#dc3545',
            fontWeight: 'bold',
            marginBottom: 0
          }}>
            * Warning: The authorization code binding cannot be revoked once assigned.
          </p>
        </div>
      </CustomModal>

      <CustomAlert
        isOpen={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        message="Room type created successfully!"
        severity="success"
        autoHideDuration={3000}
      />
    </>
  );
};

export default CreateRoomTypeModal;
