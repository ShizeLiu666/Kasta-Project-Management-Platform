import React, { useState, useEffect, useCallback } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth';
import CustomModal from '../../../CustomComponents/CustomModal';
import CustomAlert from '../../../CustomComponents/CustomAlert';

const filter = createFilterOptions();

const CreateRoomTypeModal = ({ isOpen, toggle, projectId, onRoomTypeCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    typeCode: "",
    des: "",
    authorizationCode: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTypeCodeManuallyEdited, setIsTypeCodeManuallyEdited] = useState(false);
  const [validAuthCodes, setValidAuthCodes] = useState([]);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      setIsSuperUser(userDetails.userType === 99999);
      setCurrentUsername(userDetails.username);
    }
  }, []);

  const fetchValidAuthCodes = useCallback(async (token) => {
    try {
      const response = await axiosInstance.get('/authorization-codes', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: 1000 },
      });

      if (response.data.success) {
        const validCodes = response.data.data.content
          .filter(code => 
            code.usageCount < 10 && 
            (!code.usedBy || code.usedBy === currentUsername) &&
            code.valid === true
          )
          .map(code => ({
            code: code.code,
            label: `${code.code} (${10 - code.usageCount} uses left)`,
            usageCount: code.usageCount
          }));
        setValidAuthCodes(validCodes);
      } else {
        console.error('Failed to fetch auth codes:', response.data.errorMsg);
      }
    } catch (error) {
      console.error('Error fetching auth codes:', error);
    }
  }, [currentUsername]);

  const fetchProjectRoomCodes = useCallback(async (token) => {
    try {
      const initialResponse = await axiosInstance.get('/authorization-codes/project-room-code', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 0, size: 1 },
      });

      if (initialResponse.data.success) {
        const totalElements = initialResponse.data.data.totalElements;

        const fullResponse = await axiosInstance.get('/authorization-codes/project-room-code', {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 0, size: totalElements },
        });

        if (fullResponse.data.success) {
          const validCodes = fullResponse.data.data.content
            .filter(code => 
              code.usageCount < 10 && 
              (!code.usedBy || code.usedBy === currentUsername) &&
              code.valid === true
            )
            .map(code => ({
              code: code.code,
              label: `${code.code} (${10 - code.usageCount} uses left)`,
              usageCount: code.usageCount
            }));
          setValidAuthCodes(validCodes);
        } else {
          console.error('Failed to fetch project room codes:', fullResponse.data.errorMsg);
        }
      } else {
        console.error('Failed to fetch initial project room codes:', initialResponse.data.errorMsg);
      }
    } catch (error) {
      console.error('Error fetching project room codes:', error);
    }
  }, [currentUsername]);

  const fetchAuthCodes = useCallback(async () => {
    try {
      const token = getToken();
      if (isSuperUser) {
        await fetchValidAuthCodes(token);
      } else {
        await fetchProjectRoomCodes(token);
      }
    } catch (error) {
      console.error('Error fetching auth codes:', error);
    }
  }, [isSuperUser, fetchValidAuthCodes, fetchProjectRoomCodes]);

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
      fetchAuthCodes();
    }
  }, [isOpen, fetchAuthCodes]);

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
    if (name === 'typeCode') {
      setIsTypeCodeManuallyEdited(true);
    }
  };

  const handleAuthCodeChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      // 用户输入了自定义的 Auth Code
      setFormData(prev => ({ ...prev, authorizationCode: newValue.trim() }));
    } else if (newValue && newValue.inputValue) {
      // 用户创建了新的 Auth Code
      setFormData(prev => ({ ...prev, authorizationCode: newValue.inputValue.trim() }));
    } else if (newValue && newValue.code) {
      // 用户选择了预设的 Auth Code
      setFormData(prev => ({ ...prev, authorizationCode: newValue.code.trim() }));
    } else {
      // 清空选择
      setFormData(prev => ({ ...prev, authorizationCode: '' }));
    }
  };

  const isFormValid = () => {
    return formData.name && formData.typeCode && formData.authorizationCode;
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
      }
    } catch (error) {
      setError("An unexpected error occurred.");
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
              options={validAuthCodes}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option.label;
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                // 建议创建新值
                const isExisting = options.some((option) => inputValue === option.code);
                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    inputValue,
                    label: `Use "${inputValue}"`,
                  });
                }
                return filtered;
              }}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.code || option.inputValue}>
                  {option.label}
                </Box>
              )}
              freeSolo
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              value={formData.authorizationCode}
              onChange={handleAuthCodeChange}
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
              isOptionEqualToValue={(option, value) => option.code === value.code}
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
