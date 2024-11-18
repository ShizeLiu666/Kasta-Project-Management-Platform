import React, { useState, useEffect, useCallback } from 'react';
import { Form, FormGroup, Label } from 'reactstrap';
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CustomModal from '../../CustomComponents/CustomModal';
import { getToken } from '../../auth';
import axiosInstance from '../../../config';

const filter = createFilterOptions();

const UpdateAuthCodeModal = ({ isOpen, toggle, projectRoomId, onSuccess }) => {
  const [formData, setFormData] = useState({
    authorizationCode: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successAlert, setSuccessAlert] = useState('');
  const [validAuthCodes, setValidAuthCodes] = useState([]);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');

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
            (!code.usedBy || code.usedBy === currentUsername)
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
          .filter(code => code.usageCount < 10 && (!code.used_by || code.used_by === currentUsername))
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

  useEffect(() => {
    if (isOpen) {
      setFormData({ authorizationCode: "" });
      setError('');
      setSuccessAlert('');
      fetchAuthCodes();
    }
  }, [isOpen, fetchAuthCodes]);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccessAlert('');

    try {
      const token = getToken();
      if (!token) {
        setError("No token found, please log in again.");
        return;
      }

      const response = await axiosInstance.put('/project-rooms/update-code', {
        projectRoomId,
        code: formData.authorizationCode
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      if (data.success) {
        setSuccessAlert("Authorization code updated successfully.");
        onSuccess();
        setTimeout(() => {
          toggle();
        }, 2000);
      } else {
        setError(data.errorMsg || "Failed to update authorization code.");
      }
    } catch (error) {
      setError("An error occurred while updating the authorization code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Update Authorization Code"
      onSubmit={handleSubmit}
      submitText="Update"
      isSubmitting={isSubmitting}
      error={error}
      successAlert={successAlert}
      disabled={!formData.authorizationCode}
    >
      <Form>
        <FormGroup>
          <Label for="authCode">New Authorization Code</Label>
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
        </FormGroup>
      </Form>
    </CustomModal>
  );
};

export default UpdateAuthCodeModal;
