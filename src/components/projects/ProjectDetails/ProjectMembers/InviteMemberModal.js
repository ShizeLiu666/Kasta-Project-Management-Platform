import React, { useState, useEffect, useCallback } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import CustomModal from '../../../CustomModal';
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth/auth';

const InviteMemberModal = ({ isOpen, toggle, projectId, onMemberInvited }) => {
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const [successAlert, setSuccessAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState([]);

  const fetchMembers = useCallback(async () => {
    try {
      const token = getToken();
      const response = await axiosInstance.get(`/projects/${projectId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setMembers(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  }, [projectId]);

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen, fetchMembers]);

  const checkMemberStatus = (accountToCheck) => {
    const member = members.find(m => m.account === accountToCheck);
    if (!member) return null;
    return { role: member.role, status: member.memberStatus };
  };

  const handleSubmit = async () => {
    if (!account.trim()) {
      setError('Please enter an account');
      return;
    }

    const memberStatus = checkMemberStatus(account.trim());
    if (memberStatus) {
      if (memberStatus.role === 'OWNER') {
        setError('You cannot invite the project owner.');
        return;
      }
      if (memberStatus.status === 'WAITING') {
        setError('This user has already been invited and is waiting for response.');
        return;
      }
      if (memberStatus.status === 'ACCEPT') {
        setError('This user is already a member of the project.');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');
    setSuccessAlert('');

    try {
      const token = getToken();
      const response = await axiosInstance.post('/projects/invite', {
        account: account.trim(),
        role: 'VISITOR',
        projectId: projectId
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

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Invite Member"
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
      </Form>
    </CustomModal>
  );
};

export default InviteMemberModal;
