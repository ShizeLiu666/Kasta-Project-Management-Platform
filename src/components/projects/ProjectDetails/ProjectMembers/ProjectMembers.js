import React, { useState, useEffect, useCallback } from 'react';
import { Spinner, Alert } from 'reactstrap';
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
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth';
import defaultAvatar from '../../../../assets/images/users/normal_user.jpg'; // 请确保有一个默认头像图片
import ComponentCard from '../../../AuthCodeManagement/ComponentCard';
import InviteMemberModal from './InviteMemberModal';
import LeaveProjectModal from './LeaveProjectModal';
import CustomButton from '../../../CustomButton';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import RemoveMemberModal from './RemoveMemberModal';

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

      console.log('Project Members Response:', response.data);
      console.log('Project Members Data:', response.data.data);

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

  const getStatusChip = (status) => {
    let color;
    let label = status;
    let backgroundColor;
    let textColor;

    switch (status) {
      case 'ACCEPT':
        backgroundColor = '#28a745';  // 使用和 invite 相同的绿色
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
                      width: '37.5%',  // 账户列占 40%
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
                      width: '20%',  // 角色列占 20%
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Role
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      width: '20%',  // 状态列占 20%
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Status
                  </TableCell>
                  {userRole === 'OWNER' && (
                    <TableCell 
                      sx={{ 
                        width: '22.5%',  // 操作列占 20%
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
                    <TableCell sx={{ width: '40%' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        overflow: 'hidden'  // 确保内容不会溢出
                      }}>
                        <Avatar
                          src={member.headPic || defaultAvatar}
                          sx={{ 
                            width: 40,
                            height: 40,
                            flexShrink: 0  // 防止头像被压缩
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
                              fontSize: { xs: '0.875rem', sm: '1rem' }  // 响应式字体大小
                            }}
                          >
                            {member.account || member.username}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            {member.nickname || member.nickName}
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
