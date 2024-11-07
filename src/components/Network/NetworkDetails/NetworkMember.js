import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from 'reactstrap';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import axiosInstance from '../../../config';
import { getToken } from '../../auth';
import CustomAlert from '../../CustomAlert';
import CustomButton from '../../CustomButton';
import InviteMemberModal from './InviteMemberModal';
import defaultAvatar from '../../../assets/images/users/normal_user.jpg';

const NetworkMember = ({ networkId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "info",
    duration: 2000
  });
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setAlert({
          isOpen: true,
          message: "No token found, please log in again.",
          severity: "error",
          duration: 2000
        });
        return;
      }

      const response = await axiosInstance.get(`/networks/${networkId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const sortedMembers = response.data.data.sort((a, b) => {
          if (a.role === 'OWNER') return -1;
          if (b.role === 'OWNER') return 1;
          return 0;
        });
        setMembers(sortedMembers);
        
        // 找到当前用户的角色
        const currentUser = sortedMembers.find(member => member.isCurrentUser);
        if (currentUser) {
          setCurrentUserRole(currentUser.role);
        }
      } else {
        setAlert({
          isOpen: true,
          message: response.data.errorMsg || 'Failed to fetch members',
          severity: "error",
          duration: 2000
        });
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setAlert({
        isOpen: true,
        message: error.response?.data?.errorMsg || 'Error fetching members',
        severity: "error",
        duration: 2000
      });
    } finally {
      setLoading(false);
    }
  }, [networkId]);

  useEffect(() => {
    if (networkId) {
      fetchMembers();
    }
  }, [networkId, fetchMembers]);

  const getStatusChip = (status) => {
    let color;
    let label = status;
    let backgroundColor;
    let textColor;

    switch (status) {
      case 'ACCEPT':
        backgroundColor = '#28a745';
        textColor = '#fff';
        break;
      case 'REJECT':
        color = 'error';
        break;
      case 'WAITING':
        backgroundColor = '#FCB249';
        textColor = '#fff';
        break;
      default:
        color = 'default';
    }

    return (
      <Chip 
        label={label} 
        color={color}
        size="small"
        sx={{ 
          borderRadius: '4px',
          minWidth: '80px',
          justifyContent: 'center',
          ...(backgroundColor && {
            backgroundColor,
            color: textColor,
            '&:hover': {
              backgroundColor: backgroundColor
            }
          })
        }} 
      />
    );
  };

  const handleInviteMember = (response) => {
    if (response.success) {
      setAlert({
        isOpen: true,
        message: 'Member invited successfully',
        severity: 'success',
        duration: 2000
      });
      fetchMembers(); // 刷新成员列表
    } else {
      setAlert({
        isOpen: true,
        message: response.errorMsg || 'Failed to invite member',
        severity: 'error',
        duration: 2000
      });
    }
  };

  return (
    <div>
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        severity={alert.severity}
        autoHideDuration={alert.duration}
      />

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <CustomButton
          type="invite"
          onClick={() => setInviteModalOpen(true)}
          allowedRoles={['OWNER']}
          userRole={currentUserRole}
        >
          Invite Member
        </CustomButton>
      </div>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <Spinner color="primary" />
        </Box>
      ) : (
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
                <TableCell sx={{ width: '37.5%', fontWeight: 'bold' }}>Account</TableCell>
                <TableCell sx={{ width: '20%', fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ width: '20%', fontWeight: 'bold' }}>Status</TableCell>
                {currentUserRole === 'OWNER' && (
                  <TableCell sx={{ width: '22.5%', fontWeight: 'bold' }}>Actions</TableCell>
                )}
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
                  <TableCell>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      overflow: 'hidden'
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
                      <Box sx={{ ml: 2 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }}
                        >
                          {member.account}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          {member.nickname}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={member.role}
                      size="small"
                      sx={{ 
                        borderRadius: '4px',
                        backgroundColor: member.role === 'OWNER' ? '#FE0760' : 'default',
                        color: member.role === 'OWNER' ? '#fff' : 'inherit'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {member.role !== 'OWNER' && getStatusChip(member.memberStatus)}
                  </TableCell>
                  
                  {currentUserRole === 'OWNER' && (
                    <TableCell>
                      {member.role !== 'OWNER' && (
                        <CustomButton
                          type="remove"
                          onClick={() => {
                            // TODO: 处理移除成员的逻辑
                          }}
                          icon={<PersonRemoveIcon sx={{ fontSize: '16px' }} />}
                          color="#f62d51"
                          style={{
                            minWidth: 'auto',
                            height: '24px',
                            padding: '0 8px',
                            fontSize: '0.8125rem',
                            fontWeight: 'normal',
                            borderRadius: '4px',
                            marginLeft: '0',
                            marginRight: '0'
                          }}
                        >
                          Remove
                        </CustomButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <InviteMemberModal
        isOpen={inviteModalOpen}
        toggle={() => setInviteModalOpen(false)}
        networkId={networkId}
        onMemberInvited={handleInviteMember}
      />
    </div>
  );
};

export default NetworkMember;