import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Table, Alert } from 'reactstrap';
import InvitationItem from './InvitationItem';
import axiosInstance from '../../config';
import { getToken } from '../auth/auth';

const InvitationModal = ({ isOpen, toggle }) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchInvitations();
    }
  }, [isOpen]);

  const fetchInvitations = async () => {
    try {
      const token = getToken();
      const response = await axiosInstance.get('/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const pendingInvitations = response.data.data.filter(project => project.memberStatus === 'WAITING');
        setInvitations(pendingInvitations);
      } else {
        setError(response.data.errorMsg || 'Failed to fetch invitations');
      }
    } catch (err) {
      setError('An error occurred while fetching invitations');
      console.error('Error fetching invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvitationAction = (actionType, projectId) => {
    setMessage({ type: 'success', text: `Successfully ${actionType}ed invitation for project ${projectId}` });
    fetchInvitations(); // 重新获取邀请列表
    
    // 3秒后清除消息
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Your Invitations</ModalHeader>
      <ModalBody>
        {message && (
          <Alert color={message.type} className="mb-3">
            {message.text}
          </Alert>
        )}
        {loading && <p>Loading invitations...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading && !error && invitations.length === 0 && (
          <p>You have no pending invitations.</p>
        )}
        {!loading && !error && invitations.length > 0 && (
          <Table>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map(invitation => (
                <InvitationItem 
                  key={invitation.projectId} 
                  invitation={invitation} 
                  onActionComplete={handleInvitationAction}
                />
              ))}
            </tbody>
          </Table>
        )}
      </ModalBody>
    </Modal>
  );
};

export default InvitationModal;
