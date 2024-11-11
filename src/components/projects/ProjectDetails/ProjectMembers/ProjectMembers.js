import React, { useState, useEffect, useCallback } from 'react';
import { Spinner, Alert } from 'reactstrap';
import Box from '@mui/material/Box';
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth';
import ComponentCard from '../../../AuthCodeManagement/ComponentCard';
import InviteMemberModal from './InviteMemberModal';
import LeaveProjectModal from './LeaveProjectModal';
import CustomButton from '../../../CustomButton';
import RemoveMemberModal from './RemoveMemberModal';
// 导入新的 MemberTable 组件
import MemberTable from '../../../MemberTable';

const ProjectMembers = ({ projectId, userRole, onLeaveProject }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);

  // fetchMembers 保持不变
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
      console.error('Error fetching members:', err);
      setError('Failed to fetch project members');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

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
    fetchMembers();
  };

  // 处理移除成员的回调
  const handleRemoveMember = (member) => {
    setSelectedMember(member);
    setRemoveModalOpen(true);
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
          <MemberTable
            members={members}
            currentUserRole={userRole}
            showActions={true}
            onRemoveMember={handleRemoveMember}
          />
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
