import React, { useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import CustomModal from '../../CustomComponents/CustomModal';
import axiosInstance from '../../../config';
import { getToken } from '../../auth';

const InviteMemberModal = ({ isOpen, toggle, networkId, onMemberInvited }) => {
  const [account, setAccount] = useState('');
  const [role, setRole] = useState('VISITOR');
  const [error, setError] = useState('');
  const [successAlert, setSuccessAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'VISITOR', label: 'Visitor' }
  ];

  const handleSubmit = async () => {
    if (!account.trim()) {
      setError('Please enter an account');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessAlert('');

    try {
      const token = getToken();
      const response = await axiosInstance.post('/networks/invite', {
        account: account.trim(),
        networkId: networkId,
        role: role,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSuccessAlert('Member invited successfully');
        onMemberInvited(response.data);
        setTimeout(() => {
          toggle();
          setAccount('');
          setRole('VISITOR');
        }, 2000);
      } else {
        setError(response.data.errorMsg || 'Failed to invite member');
        onMemberInvited(response.data);
      }
    } catch (err) {
      setError('An error occurred while inviting the member');
      console.error('Error inviting member:', err);
      onMemberInvited({ success: false, errorMsg: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAccount('');
    setRole('VISITOR');
    toggle();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={handleClose}
      title="Invite Network Member"
      onSubmit={handleSubmit}
      submitText="Invite"
      error={error}
      successAlert={successAlert}
      isSubmitting={isSubmitting}
    >
      <Form>
        <FormGroup>
          <Label for="account">Account</Label>
          <Input
            type="text"
            name="account"
            id="account"
            placeholder="Enter account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="role">Role</Label>
          <Input
            type="select"
            name="role"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Form>
    </CustomModal>
  );
};

export default InviteMemberModal;