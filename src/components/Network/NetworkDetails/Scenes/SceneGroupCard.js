import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';

// 截断文本组件
const TruncatedText = ({ text, maxLength = 20 }) => {
  const truncatedText = text?.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text || '-';

  return (
    <Tooltip
      title={text || '-'}
      placement="top"
      arrow
      sx={{
        tooltip: {
          backgroundColor: '#333',
          fontSize: '0.875rem',
          padding: '8px 12px',
          maxWidth: 'none'
        },
        arrow: {
          color: '#333'
        }
      }}
    >
      <span style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'block'
      }}>
        {truncatedText}
      </span>
    </Tooltip>
  );
};

const SceneGroupCard = ({ group }) => {
  // 获取组图标
  const iconSrc = require('../../../../assets/icons/NetworkOverview/Group.png');
  
  // 获取组ID，支持多种可能的字段名
  const groupId = group.groupId || group.gid || group.id || 'Unknown ID';
  
  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        padding: 2,
        backgroundColor: 'rgba(0, 150, 136, 0.05)', // 更新为 #009688 的浅色背景
        borderRadius: 2,
      }}
    >
      {/* 组图标 */}
      <Box 
        sx={{ 
          width: 40, 
          height: 40, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 1,
          mx: 'auto'
        }}
      >
        <img 
          src={iconSrc}
          alt="Group"
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
      </Box>
      
      {/* 组类型标签 */}
      <Typography
        variant="caption"
        component="div"
        align="center"
        sx={{
          color: '#009688', // 更新为 #009688
          fontWeight: 500,
          letterSpacing: '0.2px',
          textTransform: 'uppercase',
          fontSize: '0.7rem',
          mb: 1
        }}
      >
        Group
      </Typography>
      
      {/* 组名称 */}
      <Typography
        variant="body2"
        align="center"
        sx={{
          fontWeight: 600,
          color: '#2c3e50',
          mb: 0.5
        }}
      >
        <TruncatedText text={group.name || 'Unnamed Group'} maxLength={15} />
      </Typography>
      
      {/* 组ID */}
      <Typography
        variant="caption"
        align="center"
        sx={{
          color: '#95a5a6',
          fontSize: '0.7rem'
        }}
      >
        <TruncatedText text={`ID: ${groupId}`} maxLength={16} />
      </Typography>
    </Box>
  );
};

export default SceneGroupCard;
