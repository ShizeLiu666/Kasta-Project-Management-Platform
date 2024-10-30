import React, { useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import CustomModal from '../../../CustomModal';
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth';

const InviteMemberModal = ({ isOpen, toggle, projectId, onMemberInvited }) => {
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const [successAlert, setSuccessAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        onMemberInvited(response.data);  // 传递整个响应对象
        setTimeout(() => {
          toggle();
          setAccount('');
        }, 2000);
      } else {
        setError(response.data.errorMsg || 'Failed to invite member');
        onMemberInvited(response.data);  // 即使失败也传递响应对象
      }
    } catch (err) {
      setError('An error occurred while inviting the member');
      console.error('Error inviting member:', err);
      onMemberInvited({ success: false, errorMsg: err.message });  // 传递错误信息
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
