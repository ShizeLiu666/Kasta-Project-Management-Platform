import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import CustomModal from '../../../CustomComponents/CustomModal';
import axiosInstance from '../../../../config';
import { getToken, getUserDetails } from '../../../auth';

const InviteMemberModal = ({ isOpen, toggle, projectId, onMemberInvited, currentMembers = [] }) => {
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const [successAlert, setSuccessAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setAccount('');
    setError('');
    setSuccessAlert('');
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setError('');
    setSuccessAlert('');

    if (!account.trim()) {
      setError('Please enter an account');
      onMemberInvited({ success: false, errorMsg: 'Please enter an account' });
      return;
    }

    const currentUser = getUserDetails();
    if (currentUser && currentUser.username && 
        account.trim().toLowerCase() === currentUser.username.toLowerCase()) {
      setError('You cannot invite yourself to the project');
      onMemberInvited({ success: false, errorMsg: 'You cannot invite yourself to the project' });
      return;
    }

    if (Array.isArray(currentMembers)) {
      const existingMember = currentMembers.find(
        member => member.account?.toLowerCase() === account.trim().toLowerCase() ||
                  member.username?.toLowerCase() === account.trim().toLowerCase()
      );

      if (existingMember) {
        if (existingMember.memberStatus === 'WAITING') {
          const errorMsg = 'This user has already been invited and is pending response';
          setError(errorMsg);
          onMemberInvited({ success: false, errorMsg });
          return;
        }
        if (existingMember.memberStatus === 'ACCEPT') {
          const errorMsg = 'This user is already a member of the project';
          setError(errorMsg);
          onMemberInvited({ success: false, errorMsg });
          return;
        }
      }
    }

    setIsSubmitting(true);

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
          resetForm();
        }, 1000);
      } else {
        setError(response.data.errorMsg || 'Failed to invite member');
        onMemberInvited(response.data);
      }
    } catch (err) {
      const errorMsg = 'An error occurred while inviting the member';
      setError(errorMsg);
      console.error('Error inviting member:', err);
      onMemberInvited({ success: false, errorMsg });
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
