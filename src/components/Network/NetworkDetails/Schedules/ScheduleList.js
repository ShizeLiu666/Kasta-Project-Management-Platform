import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNetworkSchedules } from '../useNetworkQueries';

// 抽取成单独的组件以优化性能
const ScheduleItem = ({ schedule }) => (
  <TableRow
    key={schedule.scheduleId}
    sx={{
      '&:hover': { backgroundColor: '#f8f9fa' }
    }}
  >
    <TableCell>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {schedule.name}
      </Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body2" sx={{ color: '#95a5a6' }}>
        {schedule.scheduleId}
      </Typography>
    </TableCell>
    <TableCell>{schedule.sortOrder}</TableCell>
    <TableCell>
      {schedule.iconUrl && (
        <Box
          component="img"
          src={schedule.iconUrl}
          alt={schedule.name}
          sx={{
            width: 24,
            height: 24,
            objectFit: 'contain'
          }}
        />
      )}
    </TableCell>
  </TableRow>
);

const ScheduleList = ({ networkId }) => {
  const { 
    data: schedules = [], 
    isLoading, 
    error,
  } = useNetworkSchedules(networkId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading schedules...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 3 }}>
        <Typography>{error.message || 'Failed to load schedules'}</Typography>
      </Box>
    );
  }

  if (!schedules.length) {
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
          No schedules found in this network
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
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Schedule Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Schedule ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Sort Order</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Icon</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <ScheduleItem key={schedule.scheduleId} schedule={schedule} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ScheduleList;