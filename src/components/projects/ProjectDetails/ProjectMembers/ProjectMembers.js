import React, { useState, useEffect, useCallback } from 'react';
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
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth/auth';
import defaultAvatar from '../../../../assets/images/users/normal_user.jpg'; // 请确保有一个默认头像图片
import ComponentCard from '../../../CustomComponents/ComponentCard';
import InviteMemberModal from './InviteMemberModal';
import LeaveProjectModal from './LeaveProjectModal';
import CustomButton from '../../../CustomComponents/CustomButton';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import RemoveMemberModal from './RemoveMemberModal';
import Tooltip from '@mui/material/Tooltip';

const ProjectMembers = ({ projectId, userRole, onLeaveProject }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      const response = await axiosInstance.get(`/projects/${projectId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log('Project Members Response:', response.data);
      // console.log('Project Members Data:', response.data.data);

      if (response.data.success) {
        const sortedMembers = response.data.data.sort((a, b) => {
          if (a.role === 'OWNER') return -1;
          if (b.role === 'OWNER') return 1;
          if (a.isCurrentUser) return -1;
          if (b.isCurrentUser) return 1;
          return 0;
        });
        setMembers(sortedMembers);
      } else {
        setError(response.data.errorMsg);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to fetch project members');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Status Text
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

  const cardTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <span>Project Members</span>
      <div>
        <CustomButton
          type="invite"
          onClick={() => setInviteModalOpen(true)}
          allowedRoles={['OWNER']}
          userRole={userRole}
          style={{ marginRight: '10px' }}
        >
          Invite Member
        </CustomButton>
        <CustomButton
          type="leave"
          onClick={() => setLeaveModalOpen(true)}
          allowedRoles={['VISITOR', 'MEMBER']}
          userRole={userRole}
        >
          Leave Project
        </CustomButton>
      </div>
    </div>
  );

  const handleLeaveProjectSuccess = () => {
    onLeaveProject();
  };

  const handleRemoveSuccess = () => {
    fetchMembers();  // 重新获取成员列表
  };

  // Role Style
  const getRoleStyle = (role) => {
    switch (role) {
      case 'OWNER':
        return { 
          color: '#fbcd0b',
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

  return (
    <>
      <ComponentCard title={cardTitle}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <Spinner color="primary" />
          </Box>
        ) : error ? (
          <Alert color="danger">{error}</Alert>
        ) : (
          <TableContainer 
            component={Paper} 
            sx={{ 
              boxShadow: 'none',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              width: '100%',  // 固定容器宽度
              '& .MuiTable-root': {
                tableLayout: 'fixed',  // 固定表格布局
                width: '100%'
              }
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      width: '45%',  // 增加账户列宽度，因为现在包含了角色信息
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    Account
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      width: '27.5%',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Status
                  </TableCell>
                  {userRole === 'OWNER' && (
                    <TableCell 
                      sx={{ 
                        width: '27.5%',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Actions
                    </TableCell>
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
                    <TableCell sx={{ width: '45%' }}>
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
                    
                    {userRole === 'OWNER' && (
                      <TableCell>
                        {member.role !== 'OWNER' && (
                          <CustomButton
                            type="remove"
                            onClick={() => {
                              setSelectedMember(member);
                              setRemoveModalOpen(true);
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
      </ComponentCard>
      <InviteMemberModal
        isOpen={inviteModalOpen}
        toggle={() => setInviteModalOpen(!inviteModalOpen)}
        projectId={projectId}
        onMemberInvited={fetchMembers}
        currentMembers={members}
      />
      <LeaveProjectModal
        isOpen={leaveModalOpen}
        toggle={() => setLeaveModalOpen(!leaveModalOpen)}
        projectId={projectId}
        onLeaveSuccess={handleLeaveProjectSuccess}
      />
      <RemoveMemberModal
        isOpen={removeModalOpen}
        toggle={() => {
          setRemoveModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        projectId={projectId}
        onMemberRemoved={handleRemoveSuccess}
      />
    </>
  );
};

export default ProjectMembers;
