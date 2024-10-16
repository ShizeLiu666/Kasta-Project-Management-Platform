import React, { useState, useEffect } from 'react';
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
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  useEffect(() => {
    const userDetailsString = localStorage.getItem('userDetails');
    if (userDetailsString) {
      const userDetails = JSON.parse(userDetailsString);
      setOwnerDetails(userDetails);
    }

    const fetchMembers = async () => {
      try {
        const token = getToken();
        const response = await axiosInstance.get(`/projects/${projectId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Project Members API Response:', response.data);

        if (response.data.success) {
          setMembers(response.data.data);
          console.log('Project Members:', response.data.data);
        } else {
          setError(response.data.errorMsg);
          console.error('API Error:', response.data.errorMsg);
        }
      } catch (err) {
        setError('Failed to fetch project members');
        console.error('Error fetching project members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [projectId]);

  const toggleInviteModal = () => {
    setInviteModalOpen(!inviteModalOpen);
  };

  const handleInvite = () => {
    toggleInviteModal();
  };

  const handleMemberInvited = () => {
    // 重新获取成员列表
    const fetchMembers = async () => {
      try {
        const token = getToken();
        const response = await axiosInstance.get(`/projects/${projectId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Project Members API Response:', response.data);

        if (response.data.success) {
          setMembers(response.data.data);
          console.log('Project Members:', response.data.data);
        } else {
          setError(response.data.errorMsg);
          console.error('API Error:', response.data.errorMsg);
        }
      } catch (err) {
        setError('Failed to fetch project members');
        console.error('Error fetching project members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const cardTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <span>Project Members</span>
      <Button
        color="secondary"
        onClick={handleInvite}
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
            {members.map((member, index) => {
              const isOwner = member.role === 'OWNER';
              const displayMember = isOwner && ownerDetails ? ownerDetails : member;
              
              return (
                <tr key={index} className="border-top">
                  <td>
                    <div className="d-flex align-items-center p-2">
                      <img
                        src={displayMember.headPic || defaultAvatar}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                        onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
                      />
                      <div className="ms-3">
                        <h6 className="mb-0">{displayMember.account || displayMember.username}</h6>
                        <span className="text-muted">{displayMember.nickname || displayMember.nickName}</span>
                      </div>
                    </div>
                  </td>
                  <td>{member.role}</td>
                  <td>{member.memberStatus}</td>
                  <td>{/* Actions will be added here later */}</td>
                </tr>
              );
            })}
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
