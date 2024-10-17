import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Table } from 'reactstrap';
import InvitationItem from './InvitationItem';

const InvitationModal = ({ isOpen, toggle, invitations, onActionComplete }) => {
  useEffect(() => {
    if (invitations.length === 0 && isOpen) {
      toggle();
    }
  }, [invitations, isOpen, toggle]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Your Invitations</ModalHeader>
      <ModalBody>
        {invitations.length === 0 ? (
          <p>You have no pending invitations.</p>
        ) : (
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
                  onActionComplete={onActionComplete}
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
