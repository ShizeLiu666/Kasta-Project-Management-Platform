import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Collapse, IconButton, Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNetworkGroups, useGroupDevices } from '../useNetworkQueries';
import GroupDeviceCard from './GroupDeviceCard';

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
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
            borderBottom: expanded ? '1px solid rgba(224, 224, 224, 0.7)' : 'none',
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
              onClick={() => setExpanded(!expanded)}
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
                    <GroupDeviceCard device={device} />
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

export default GroupList;