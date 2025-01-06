import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNetworkGroups, useGroupDevices } from '../useNetworkQueries';

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
  // 为每个组获取设备
  const { 
    data: devices = [], 
    isLoading: isLoadingDevices 
  } = useGroupDevices(networkId, group.groupId);

  return (
    <Box key={group.groupId} sx={{ mb: 4 }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2,
        pl: 0
      }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: '#fbcd0b',
            mb: 0.5,
            ml: 0.5
          }}
        >
          {group.name}
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: '#95a5a6',
              ml: 0.5,
              fontWeight: 400
            }}
          >
            - {group.groupId}
          </Typography>
        </Typography>
        <Typography
          variant="body2"
          sx={{
            ml: 0.5,
            color: 'text.secondary'
          }}
        >
          ({devices.length} {devices.length === 1 ? 'device' : 'devices'})
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 'none',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          width: '100%',
          '& .MuiTable-root': {
            tableLayout: 'fixed',
            width: '100%'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  width: '100%',
                  fontWeight: 'bold',
                  backgroundColor: '#f8f9fa'
                }}
              >
                Device Name
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoadingDevices ? (
              <TableRow>
                <TableCell>Loading devices...</TableCell>
              </TableRow>
            ) : devices.map((device) => (
              <TableRow
                key={device.deviceId}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: '#f8f9fa' }
                }}
              >
                <TableCell>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    maxWidth: '100%'
                  }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {device.name}
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: '#95a5a6',
                            ml: 0.5,
                            fontWeight: 400
                          }}
                        >
                          - {device.deviceId}
                        </Typography>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {device.appearanceShortname}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GroupList;