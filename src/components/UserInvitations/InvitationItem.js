import React from 'react';
import InvitationActions from './InvitationActions';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

const InvitationItem = ({ invitation, onActionComplete }) => {
  const cellStyle = {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '12px 16px',  // 添加适当的内边距
    fontSize: '0.875rem'   // 设置合适的字体大小
  };

  return (
    <tr>
      <td style={cellStyle}>
        <Tooltip title={invitation.name} placement="top">
          <Box component="span" sx={{ 
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {invitation.name}
          </Box>
        </Tooltip>
      </td>
      <td style={cellStyle}>
        <Tooltip title={invitation.address} placement="top">
          <Box component="span" sx={{ 
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {invitation.address}
          </Box>
        </Tooltip>
      </td>
      <td style={{ 
        padding: '12px 16px',
        width: '170px',    // 与 InvitationActions 中的宽度匹配
        minWidth: '170px'  // 确保最小宽度
      }}>
        <InvitationActions 
          projectId={invitation.projectId} 
          onActionComplete={onActionComplete} 
        />
      </td>
    </tr>
  );
};

export default InvitationItem;
