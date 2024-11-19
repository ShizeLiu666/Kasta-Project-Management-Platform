import React, { useState } from "react";
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth';
import CustomModal from '../../../CustomComponents/CustomModal';

const RemoveMemberModal = ({ isOpen, toggle, member, projectId, onMemberRemoved }) => {
    const [error, setError] = useState("");
    const [successAlert, setSuccessAlert] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRemoveMember = async () => {
        const token = getToken();
        if (!token) {
            setError("No token found, please log in again.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post(
                '/projects/remove-member',
                {
                    projectId: projectId,
                    memberName: member.account || member.username
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (response.data.success) {
                setSuccessAlert("Member removed successfully!");
                setTimeout(() => {
                    setSuccessAlert("");
                    toggle();
                    if (onMemberRemoved) {
                        onMemberRemoved();
                    }
                }, 1000);
            } else {
                setError(response.data.errorMsg || "Error removing member.");
            }
        } catch (error) {
            console.error('Error removing member:', error);
            setError(error.response?.data?.errorMsg || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!member) {
        return null;
    }

    return (
        <CustomModal
            isOpen={isOpen}
            toggle={toggle}
            title="Remove Member"
            onSubmit={handleRemoveMember}
            submitText="Remove"
            successAlert={successAlert}
            error={error}
            isSubmitting={isSubmitting}
            submitButtonColor="#dc3545"
        >
            <p>
                Are you sure you want to remove member "{member.account || member.username}"
                {member.nickname && ` (${member.nickname})`} from this project?
            </p>
        </CustomModal>
    );
};

export default RemoveMemberModal;