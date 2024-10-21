import React, { useState, useEffect, useCallback } from 'react';
import { Table, Spinner, Alert, Badge } from 'reactstrap';
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth/auth';
import defaultAvatar from '../../../../assets/images/users/normal_user.jpg'; // 请确保有一个默认头像图片
import ComponentCard from '../../../AuthCodeManagement/ComponentCard';
import InviteMemberModal from './InviteMemberModal';
import LeaveProjectModal from './LeaveProjectModal';
import CustomButton from '../../../CustomButton';

const ProjectMembers = ({ projectId, userRole, onLeaveProject }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

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
      setError('Failed to fetch project members');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const getStatusBadge = (status) => {
    let color;
    switch (status) {
      case 'ACCEPT':
        color = 'success';
        break;
      case 'REJECT':
        color = 'danger';
        break;
      case 'WAITING':
        color = 'warning';
        break;
      default:
        color = 'secondary';
    }
    return <Badge color={color} style={{ borderRadius: '4px'}}>{status}</Badge>;
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

  return (
    <>
      <ComponentCard title={cardTitle}>
        {loading ? (
          <Spinner color="primary" />
        ) : error ? (
          <Alert color="danger">{error}</Alert>
        ) : (
          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Account</th>
                <th style={{ width: '30%' }}>Role</th>
                <th style={{ width: '30%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index} className="border-top">
                  <td style={{ width: '40%' }}>
                    <div className="d-flex align-items-center p-2">
                      <img
                        src={member.headPic || defaultAvatar}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                        onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
                      />
                      <div className="ms-3">
                        <h6 className="mb-0">{member.account || member.username}</h6>
                        <span className="text-muted">{member.nickname || member.nickName}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ width: '30%' }}>{member.role}</td>
                  <td style={{ width: '30%' }}>
                    {member.role !== 'OWNER' && getStatusBadge(member.memberStatus)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
    </>
  );
};

export default ProjectMembers;
