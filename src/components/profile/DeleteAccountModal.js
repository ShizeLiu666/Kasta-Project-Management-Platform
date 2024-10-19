import React from 'react';
import CustomModal from '../CustomModal';

const DeleteAccountModal = ({ isOpen, toggle, onConfirmDelete }) => {
  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Delete Account"
      onSubmit={onConfirmDelete}
      submitText="Delete"
      cancelText="Cancel"
      submitButtonColor="#dc3545"
      cancelButtonColor="#6c757d"
    >
      <p>Are you sure you want to delete your account? This action cannot be undone.</p>
    </CustomModal>
  );
};

export default DeleteAccountModal;

