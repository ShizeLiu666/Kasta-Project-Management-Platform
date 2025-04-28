import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Collapse, IconButton, Chip, Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNetworkGroups, useGroupDevices } from '../useNetworkQueries';
import { PRODUCT_TYPE_MAP } from '../PRODUCT_TYPE_MAP';

// 复用从 FIVE_INPUT.js 的工具函数
const getDeviceTypeFromProductType = (productType) => {
  const entry = Object.entries(PRODUCT_TYPE_MAP).find(([key, value]) => key === productType);
  return entry ? entry[1] : null;
};

const getDeviceIcon = (productType) => {
  try {
    const deviceType = getDeviceTypeFromProductType(productType);
    if (!deviceType) return null;
    return require(`../../../../assets/icons/DeviceType/${deviceType}.png`);
  } catch (error) {
    return require(`../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
  }
};

const formatDisplayText = (text) => {
  if (!text) return '';
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

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

const DeviceCard = ({ device }) => {
  // 尝试获取设备类型属性 (检查多个可能的字段名)
  const productType = device.productType || device.product_type || device.type;
  const deviceType = getDeviceTypeFromProductType(productType);
  const iconSrc = getDeviceIcon(productType);

  // 添加设备ID的显示，以便查找问题
  const deviceId = device.deviceId || device.did || device.id;

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        padding: 2,
        backgroundColor: '#f8f9fa',
        borderRadius: 2,
        // 移除悬停效果和边框
      }}
    >
      {/* 设备图标 */}
      <Box 
        sx={{ 
          width: 40, 
          height: 40, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 1,
          mx: 'auto' // 居中图标
        }}
      >
        <img 
          src={iconSrc}
          alt={deviceType || 'Device'}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
      </Box>
      
      {/* 设备类型 */}
      <Typography
        variant="caption"
        component="div"
        align="center"
        sx={{
          color: '#666',
          fontWeight: 500,
          letterSpacing: '0.2px',
          textTransform: 'uppercase',
          fontSize: '0.7rem',
          mb: 1
        }}
      >
        {formatDisplayText(deviceType) || '未知设备'}
      </Typography>
      
      {/* 设备名称 */}
      <Typography
        variant="body2"
        align="center"
        sx={{
          fontWeight: 600,
          color: '#2c3e50',
          mb: 0.5
        }}
      >
        <TruncatedText text={device.name} maxLength={15} />
      </Typography>
      
      {/* 设备ID */}
      <Typography
        variant="caption"
        align="center"
        sx={{
          color: '#95a5a6',
          fontSize: '0.7rem'
        }}
      >
        <TruncatedText text={deviceId} maxLength={16} />
      </Typography>
    </Box>
  );
};

const GroupList = ({ networkId }) => {
  // 使用 React Query hooks
  const { 
    data: groups = [], 
    isLoading, 
    error 
  } = useNetworkGroups(networkId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading groups...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 3 }}>
        <Typography>{error.message || 'Failed to load groups'}</Typography>
      </Box>
    );
  }

  if (!groups.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          color: '#666',
          backgroundColor: '#fafbfc',
          borderRadius: '12px',
          border: '1px dashed #dee2e6'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No groups found in this network
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {groups.map((group) => (
        <GroupItem key={group.groupId} group={group} networkId={networkId} />
      ))}
    </Box>
  );
};

// 抽取成单独的组件以优化性能
const GroupItem = ({ group, networkId }) => {
  const [expanded, setExpanded] = useState(true);
  
  // 为每个组获取设备
  const { 
    data: devices = [], 
    isLoading: isLoadingDevices 
  } = useGroupDevices(networkId, group.groupId);

  return (
    <Box sx={{ mb: 4 }}>
      <Paper 
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          borderColor: 'rgba(224, 224, 224, 0.7)'
        }}
      >
        {/* 组标题和展开/折叠按钮 */}
        <Box 
          onClick={() => setExpanded(!expanded)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
            borderBottom: expanded ? '1px solid rgba(224, 224, 224, 0.7)' : 'none',
            cursor: 'pointer',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {group.name}
              <Typography
                component="span"
                variant="body2"
                sx={{ color: '#95a5a6', ml: 1, fontWeight: 400 }}
              >
                - {group.groupId}
              </Typography>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`${devices.length} Device${devices.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{
                bgcolor: 'rgba(251, 205, 11, 0.1)',
                color: '#fbcd0b',
                fontWeight: 500,
                mr: 1
              }}
            />
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>
        
        {/* 设备网格布局 */}
        <Collapse in={expanded}>
          <Box sx={{ p: 2 }}>
            {isLoadingDevices ? (
              <Typography align="center" py={2}>Loading devices...</Typography>
            ) : !devices.length ? (
              <Typography align="center" py={2} color="text.secondary">
                No devices in this group
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {devices.map((device) => (
                  <Grid item key={device.deviceId} xs={12} sm={6} md={3}>
                    <DeviceCard device={device} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default GroupList;