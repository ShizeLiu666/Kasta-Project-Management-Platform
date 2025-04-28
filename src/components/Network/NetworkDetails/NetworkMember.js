import React, { useState } from 'react';
import { Spinner, Alert } from 'reactstrap';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import defaultAvatar from '../../../assets/images/users/normal_user.jpg';
import CustomAlert from '../../CustomComponents/CustomAlert';
import { useNetworkMembers } from './useNetworkQueries';

const NetworkMember = ({ networkId }) => {
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "info",
    duration: 2000
  });

  // 使用 React Query hook
  const { 
    data: members = [], 
    isLoading,
    error
  } = useNetworkMembers(networkId);

  // 状态样式
  const getStatusText = (status) => {
    switch (status) {
      case 'ACCEPT':
        return { 
          color: '#4CAF50',
          fontWeight: 450
        };
      case 'REJECT':
        return { 
          color: '#F44336',
          fontWeight: 450
        };
      case 'WAITING':
        return { 
          color: '#FF8D21',
          fontWeight: 450
        };
      default:
        return { 
          color: '#000',
          fontWeight: 450
        };
    }
  };

  // 角色样式
  const getRoleStyle = (role) => {
    switch (role) {
      case 'OWNER':
        return { 
          color: '#fbcd0b',
          fontWeight: 450
        };
      case 'ADMIN':
        return { 
          color: '#2196F3',
          fontWeight: 450
        };
      case 'VISITOR':
        return { 
          color: '#bdbdbd',
          fontWeight: 450
        };
      default:
        return { 
          color: '#bdbdbd',
          fontWeight: 450
        };
    }
  };

  // 处理错误状态
  if (error) {
    return (
      <Alert color="danger">
        {error.message || "Failed to load members"}
      </Alert>
    );
  }

  return (
    <>
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        severity={alert.severity}
        autoHideDuration={alert.duration}
      />

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <Spinner color="primary" />
        </Box>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
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
                    width: '60%',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  Account
                </TableCell>
                <TableCell 
                  sx={{ 
                    width: '40%',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: '#f8f9fa' }
                  }}
                >
                  <TableCell sx={{ width: '60%' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      overflow: 'hidden',
                      maxWidth: '100%'
                    }}>
                      <Avatar
                        src={member.headPic || defaultAvatar}
                        sx={{ 
                          width: 40,
                          height: 40,
                          flexShrink: 0
                        }}
                        imgProps={{
                          onError: (e) => {
                            e.target.onerror = null;
                            e.target.src = defaultAvatar;
                          }
                        }}
                      />
                      <Box sx={{ 
                        ml: 2,
                        minWidth: 0,
                        flex: 1
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          maxWidth: '100%'
                        }}>
                          <Tooltip 
                            title={member.account || member.username}
                            placement="top"
                          >
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '60%'
                              }}
                            >
                              {member.account || member.username}
                            </Typography>
                          </Tooltip>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              ml: 1,
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              flexShrink: 0,
                              ...getRoleStyle(member.role)
                            }}
                          >
                            ({member.role})
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {member.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={getStatusText(member.memberStatus)}
                    >
                      {member.memberStatus}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default NetworkMember;