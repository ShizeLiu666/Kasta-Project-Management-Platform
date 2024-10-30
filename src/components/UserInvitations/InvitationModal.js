import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Table } from 'reactstrap';
import InvitationItem from './InvitationItem';

const InvitationModal = ({ isOpen, toggle, invitations, onActionComplete }) => {
  useEffect(() => {
    if (invitations.length === 0 && isOpen) {
      toggle();
    }
  }, [invitations, isOpen, toggle]);

  const modalStyle = {
    maxWidth: '800px',  // 增加最大宽度
    width: '90%',       // 响应式宽度
    margin: '1.75rem auto'
  };

  const tableStyle = {
    minWidth: '650px',  // 设置最小宽度
    tableLayout: 'fixed' // 固定表格布局
  };

  const columnStyles = {
    projectName: { width: '30%' },
    address: { width: '45%' },
    actions: { width: '25%' }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered style={modalStyle}>
      <ModalHeader toggle={toggle}>Your Invitations</ModalHeader>
      <ModalBody>
        {invitations.length === 0 ? (
          <p>You have no pending invitations.</p>
        ) : (
          <Table responsive hover style={tableStyle}>
            <thead>
              <tr>
                <th style={columnStyles.projectName}>Project Name</th>
                <th style={columnStyles.address}>Address</th>
                <th style={columnStyles.actions}>Actions</th>
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
