import React, { useState } from 'react';
import axiosInstance from '../../config';
import { getToken } from '../auth';
import CustomButton from '../CustomComponents/CustomButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

export const handleInvitationAction = async (projectId, projectName, action, onActionComplete) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post(
      `/projects/${projectId}/${action}-invitation`, 
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      console.log(`${action.charAt(0).toUpperCase() + action.slice(1)}ed invitation for project: ${projectName}`);
      onActionComplete(action, projectId, null, projectName);
      return true;
    } else {
      console.error(`Failed to ${action} invitation for ${projectName}:`, response.data.errorMsg);
      onActionComplete(action, projectId, response.data.errorMsg, projectName);
      return false;
    }
  } catch (err) {
    console.error(`Error ${action}ing invitation for ${projectName}:`, err);
    onActionComplete(action, projectId, err.message, projectName);
    return false;
  }
};

export const handleBulkInvitationAction = async (action, onActionComplete, onSuccess) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post(
      `/projects/${action}-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      console.log(`Bulk ${action} completed successfully`);
      onActionComplete(action);
      if (onSuccess) {
        onSuccess();
      }
      return true;
    } else {
      console.error(`Failed to ${action} all invitations:`, response.data.errorMsg);
      onActionComplete(action, null, response.data.errorMsg);
      return false;
    }
  } catch (err) {
    console.error(`Error ${action}ing all invitations:`, err);
    onActionComplete(action, null, err.message);
    return false;
  }
};

const InvitationActions = ({ projectId, projectName, onActionComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    await handleInvitationAction(projectId, projectName, action, onActionComplete);
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  const buttonStyle = {
    minWidth: '100px',  // 设置固定最小宽度
    maxWidth: '100px',  // 设置固定最大宽度
    height: '32px',
    // padding: '4px 8px',
    fontSize: '0.875rem',  // 14px
    whiteSpace: 'nowrap',  // 防止文字换行
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        gap: '8px',  // 使用 gap 替代 marginRight
        alignItems: 'center',
        justifyContent: 'flex-end',  // 靠右对齐
        minWidth: '170px',  // 确保按钮容器有足够的最小宽度
        maxWidth: '170px',  // 限制最大宽度
      }}
    >
      <CustomButton
        type="invite"
        onClick={() => handleAction('accept')}
        disabled={isProcessing}
        icon={<CheckIcon sx={{ fontSize: '12px' }} />}
        style={buttonStyle}
      >
        Accept
      </CustomButton>
      <CustomButton
        type="remove"
        onClick={() => handleAction('reject')}
        disabled={isProcessing}
        icon={<CloseIcon sx={{ fontSize: '12px' }} />}
        style={buttonStyle}
      >
        Reject
      </CustomButton>
    </Box>
  );
};

export default InvitationActions;
