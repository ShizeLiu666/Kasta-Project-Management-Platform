import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { getToken } from '../auth/auth';
import axiosInstance from '../../config'; 
import CustomModal from '../CustomComponents/CustomModal';
import { styled } from '@mui/material/styles';

// 自定义状态切换组件
const StatusSwitch = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px',
  borderRadius: '34px',
  backgroundColor: '#f8f9fa',
  position: 'relative',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background-color 300ms',

  '& .switch-track': {
    width: '150px',
    height: '34px',
    borderRadius: '34px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },

  '& .switch-thumb': {
    width: '75px',
    height: '30px',
    borderRadius: '30px',
    backgroundColor: 'white',
    position: 'absolute',
    left: '2px',
    transition: 'transform 300ms, background-color 300ms',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 1,
  },

  '& .switch-text': {
    flex: 1,
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '0.875rem',
    fontWeight: 500,
    zIndex: 2,
    transition: 'color 300ms',
  },

  '&[data-checked="true"]': {
    '& .switch-thumb': {
      transform: 'translateX(71px)',
      backgroundColor: '#198754',
    },
    '& .switch-text.valid': {
      color: '#fff',
    },
  },

  '&[data-checked="false"]': {
    '& .switch-thumb': {
      transform: 'translateX(0)',
      backgroundColor: '#dc3545',
    },
    '& .switch-text.invalid': {
      color: '#fff',
    },
  },
}));

const CustomStatusSwitch = ({ checked, onChange }) => (
  <StatusSwitch
    data-checked={checked}
    onClick={() => onChange(!checked)}
    role="switch"
    aria-checked={checked}
  >
    <div className="switch-track">
      <div className="switch-text invalid">Invalid</div>
      <div className="switch-text valid">Valid</div>
      <div className="switch-thumb" />
    </div>
  </StatusSwitch>
);

const EditAuthCodeModal = ({ isOpen, toggle, authCode, onEditAuthCode }) => {
  const [formData, setFormData] = useState({
    valid: false,
    note: ''
  });
  const [error, setError] = useState("");
  const [successAlert, setSuccessAlert] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authCode) {
      setFormData({
        valid: Boolean(authCode.valid),
        note: authCode.note || ''
      });
      setError("");
      setSuccessAlert("");
    }
  }, [authCode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'note' && value.length <= 255) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleValidityChange = () => {
    setFormData(prev => ({ ...prev, valid: !prev.valid }));
  };

  const isFormValid = () => {
    if (!authCode) return false;
    
    // 检查是否有实际变更
    const hasValidityChange = formData.valid !== authCode.valid;
    const hasNoteChange = formData.note.trim() !== (authCode.note || '').trim();
    
    return hasValidityChange || hasNoteChange;
  };

  const handleSubmit = async () => {
    if (!authCode) {
      setError("Authorization code information is missing. Please try again.");
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

    setIsSubmitting(true);
    try {
      // 处理有效性更改
      if (formData.valid !== authCode.valid) {
        const validityResponse = await axiosInstance.put(
          `/authorization-codes/update-validity/${authCode.code}`,
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { isValid: formData.valid }
          }
        );
        if (!validityResponse.data.success) {
          throw new Error(validityResponse.data.errorMsg || "Error updating validity");
        }
      }

      // 处理备注更改
      if (formData.note.trim() !== (authCode.note || '').trim()) {
        const noteResponse = await axiosInstance.put(
          `/authorization-codes/update-note/${authCode.code}`,
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { note: formData.note.trim() }
          }
        );
        if (!noteResponse.data.success) {
          throw new Error(noteResponse.data.errorMsg || "Error updating note");
        }
      }

      setSuccessAlert("Authorization code updated successfully!");
      setTimeout(() => {
        setSuccessAlert("");
        toggle();
        onEditAuthCode({
          ...authCode,
          valid: formData.valid,
          note: formData.note.trim()
        });
      }, 1000);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authCode) {
    return null;
  }

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Edit Authorization Code"
      onSubmit={handleSubmit}
      submitText="Update"
      successAlert={successAlert}
      error={error}
      isSubmitting={isSubmitting}
      submitButtonColor="#fbcd0b"
      disabled={!isFormValid()}
    >
      <Form>
        <FormGroup>
          <Label className="d-flex justify-content-between align-items-center mb-2">
            <span>Status:</span>
            <CustomStatusSwitch
              checked={formData.valid}
              onChange={handleValidityChange}
            />
          </Label>
        </FormGroup>
        <FormGroup>
          <Label for="note">Note:</Label>
          <Input
            type="textarea"
            name="note"
            id="note"
            value={formData.note}
            onChange={handleChange}
            maxLength={255}
            rows={3}
            placeholder="Enter note (max 255 characters)..."
          />
          <small className="text-muted">
            {formData.note.length}/255 characters
          </small>
        </FormGroup>
      </Form>
    </CustomModal>
  );
};

export default EditAuthCodeModal;