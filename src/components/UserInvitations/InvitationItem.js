import React from 'react';
import InvitationActions from './InvitationActions';

const InvitationItem = ({ invitation, onActionComplete }) => {
  return (
    <tr>
      <td>{invitation.name}</td>
      <td>{invitation.address}</td>
      <td>
        <InvitationActions projectId={invitation.projectId} onActionComplete={onActionComplete} />
      </td>
    </tr>
  );
};

export default InvitationItem;
