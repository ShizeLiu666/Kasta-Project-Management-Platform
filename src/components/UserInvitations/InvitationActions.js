import React from 'react';
import { Button } from 'reactstrap';
import axiosInstance from '../../config';
import { getToken } from '../auth';

const InvitationActions = ({ projectId, onActionComplete }) => {
  const handleAction = async (action) => {
    try {
      const token = getToken();
      const response = await axiosInstance.post(`/projects/${projectId}/${action}-invitation`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log(`${action.charAt(0).toUpperCase() + action.slice(1)}ed invitation for project ${projectId}`);
        onActionComplete(action, projectId);  // 确保这里正确调用
      } else {
        console.error(`Failed to ${action} invitation:`, response.data.errorMsg);
        onActionComplete(action, projectId, response.data.errorMsg);  // 可以传递错误信息
      }
    } catch (err) {
      console.error(`Error ${action}ing invitation:`, err);
      onActionComplete(action, projectId, err.message);  // 可以传递错误信息
    }
  };

  return (
    <>
      <Button color="success" size="sm" onClick={() => handleAction('accept')}>Accept</Button>
      {' '}
      <Button color="danger" size="sm" onClick={() => handleAction('reject')}>Reject</Button>
    </>
  );
};

export default InvitationActions;
