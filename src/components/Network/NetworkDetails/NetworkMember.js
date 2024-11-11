import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from 'reactstrap';
import Box from '@mui/material/Box';
import axiosInstance from '../../../config';
import { getToken } from '../../auth';
import CustomAlert from '../../CustomAlert';
import CustomButton from '../../CustomButton';
import InviteMemberModal from './InviteMemberModal';
import MemberTable from '../../MemberTable';

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

      {loading ? (
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