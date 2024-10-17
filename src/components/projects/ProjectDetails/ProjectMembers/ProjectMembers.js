import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button } from 'reactstrap';
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth/auth';
import defaultAvatar from '../../../../assets/images/users/normal_user.jpg'; // 请确保有一个默认头像图片
import ComponentCard from '../../../AuthCodeManagement/ComponentCard';
import InviteMemberModal from './InviteMemberModal';

const ProjectMembers = ({ projectId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
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

  const toggleInviteModal = () => {
    setInviteModalOpen(!inviteModalOpen);
  };

  const handleMemberInvited = () => {
    fetchMembers();
  };

  const getStatusDot = (status) => {
    let color;
    switch (status) {
      case 'ACCEPT':
        color = 'green';
        break;
      case 'REJECT':
        color = 'red';
        break;
      case 'WAITING':
        color = 'orange';
        break;
      default:
        color = 'grey';
    }
    return (
      <span
        style={{
          height: '10px',
          width: '10px',
          backgroundColor: color,
          borderRadius: '50%',
          display: 'inline-block',
          marginLeft: '10px',
        }}
      />
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const cardTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <span>Project Members</span>
      <Button
        color="secondary"
        onClick={toggleInviteModal}
        style={{
          backgroundColor: "#fbcd0b",
          borderColor: "#fbcd0b",
          color: "#fff",
          fontWeight: "bold",
          textTransform: "none",
        }}
      >
        Invite Member
      </Button>
    </div>
  );

  return (
    <>
      <ComponentCard title={cardTitle}>
        <Table className="no-wrap mt-3 align-middle" responsive borderless>
          <thead>
            <tr>
              <th>Account</th>
              <th>Role</th>
              <th>Member Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index} className="border-top">
                <td>
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
                <td>{member.role}</td>
                <td>
                  {member.role !== 'OWNER' && (
                    <>
                      {member.memberStatus}
                      {getStatusDot(member.memberStatus)}
                    </>
                  )}
                </td>
                <td>{/* Actions will be added here later */}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ComponentCard>
      <InviteMemberModal
        isOpen={inviteModalOpen}
        toggle={toggleInviteModal}
        projectId={projectId}
        onMemberInvited={handleMemberInvited}
      />
    </>
  );
};

export default ProjectMembers;
