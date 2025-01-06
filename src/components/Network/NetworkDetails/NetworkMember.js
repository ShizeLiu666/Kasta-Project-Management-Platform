import React, { useState } from 'react';
import { Spinner } from 'reactstrap';
import Box from '@mui/material/Box';
import CustomAlert from '../../CustomComponents/CustomAlert';
import CustomButton from '../../CustomComponents/CustomButton';
import InviteMemberModal from './InviteMemberModal';
import MemberTable from '../../CustomComponents/MemberTable';
import { useNetworkMembers } from './useNetworkQueries';

const NetworkMember = ({ networkId }) => {
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "info",
    duration: 2000
  });
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // 使用 React Query hook
  const { 
    data: members = [], 
    isLoading,
    error,
    refetch: fetchMembers 
  } = useNetworkMembers(networkId);

  // 获取当前用户角色
  const currentUserRole = members.find(member => member.isCurrentUser)?.role;

  const handleInviteMember = (response) => {
    if (response.success) {
      setAlert({
        isOpen: true,
        message: 'Member invited successfully',
        severity: 'success',
        duration: 2000
      });
      fetchMembers(); // 使用 refetch 刷新数据
    } else {
      setAlert({
        isOpen: true,
        message: response.errorMsg || 'Failed to invite member',
        severity: 'error',
        duration: 2000
      });
    }
  };

  // 处理错误状态
  if (error) {
    return (
      <CustomAlert
        isOpen={true}
        message={error.message || "Failed to load members"}
        severity="error"
        duration={2000}
      />
    );
  }

  return (
    <div>
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        severity={alert.severity}
        autoHideDuration={alert.duration}
      />

      {false && (
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
      )}

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <Spinner color="primary" />
        </Box>
      ) : (
        <MemberTable
          members={members}
          currentUserRole={currentUserRole}
          showActions={true}
          onRemoveMember={(member) => {
            // TODO: 处理移除成员的逻辑
            console.log('Remove member:', member);
          }}
        />
      )}

      {false && (
        <InviteMemberModal
          isOpen={inviteModalOpen}
          toggle={() => setInviteModalOpen(false)}
          networkId={networkId}
          onMemberInvited={handleInviteMember}
        />
      )}
    </div>
  );
};

export default NetworkMember;