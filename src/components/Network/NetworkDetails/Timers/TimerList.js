import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNetworkTimers } from '../useNetworkQueries';

// 辅助函数
const formatTime = (hour, min, second) => {
  const h = Number(hour || 0);
  const m = Number(min || 0);
  const s = Number(second || 0);
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatAction = (action) => {
  switch (action) {
    case 0: return 'OFF';
    case 1: return 'ON';
    default: return '-';
  }
};

const formatEntityType = (type) => {
  switch (type) {
    case 0: return 'Device';
    case 1: return 'Group';
    default: return '-';
  }
};

// 抽取成单独的组件以优化性能
const TimerItem = ({ timer }) => (
  <TableRow
    key={timer.timerId}
    sx={{
      '&:hover': { backgroundColor: '#f8f9fa' }
    }}
  >
    <TableCell>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {timer.name || 'Unnamed Timer'}
      </Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body2" sx={{ color: '#95a5a6' }}>
        {formatTime(timer.hour, timer.minute, timer.second)}
      </Typography>
    </TableCell>
    <TableCell>{formatAction(timer.action)}</TableCell>
    <TableCell>{formatEntityType(timer.entityType)}</TableCell>
    <TableCell>
      <Typography variant="body2" sx={{ color: '#95a5a6' }}>
        {timer.timerId || 'N/A'}
      </Typography>
    </TableCell>
  </TableRow>
);

const TimerList = ({ networkId }) => {
  const { 
    data: timers = [], 
    isLoading, 
    error,
  } = useNetworkTimers(networkId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading timers...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 3 }}>
        <Typography>{error.message || 'Failed to load timers'}</Typography>
      </Box>
    );
  }

  if (!timers.length) {
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
          No timers found in this network
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 'none',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          width: '100%'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Timer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Entity Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Timer ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timers.map((timer) => (
              <TimerItem key={timer.timerId} timer={timer} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimerList;