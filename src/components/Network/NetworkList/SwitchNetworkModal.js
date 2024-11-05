import React, { useState } from 'react';
import CustomModal from '../../CustomModal';
import axiosInstance from '../../../config';
import { getToken } from '../../auth';

const SwitchNetworkModal = ({ isOpen, toggle, network, currentNetworkId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirmSwitch = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = getToken();
      
      // 发送两个请求：一个设置旧网络为非当前，一个设置新网络为当前
      const requests = [
        // 设置旧的当前网络为非当前
        axiosInstance.put('/networks/selected', [{
          networkId: currentNetworkId,
          currentNetwork: false
        }], {
          headers: { Authorization: `Bearer ${token}` }
        }),
        
        // 设置新的网络为当前网络
        axiosInstance.put('/networks/selected', [{
          networkId: network.networkId,
          currentNetwork: true
        }], {
          headers: { Authorization: `Bearer ${token}` }
        })
      ];

      const responses = await Promise.all(requests);
      
      // 检查所有响应是否成功
      const allSuccess = responses.every(response => response.data.success);

      if (allSuccess) {
        onSuccess('Network switched successfully');
        toggle();
      } else {
        const errorMsg = responses.find(response => !response.data.success)?.data.errorMsg;
        setError(errorMsg || "Failed to switch network.");
      }
    } catch (error) {
      setError(error.response?.data?.errorMsg || "An error occurred while switching network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Switch Network"
      onSubmit={handleConfirmSwitch}
      submitText="Switch"
      cancelText="Cancel"
      submitButtonColor="#007bff"
      isSubmitting={isSubmitting}
      error={error}
    >
      <p>Are you sure you want to switch to network "{network?.meshName}"?</p>
      <p style={{ color: '#6c757d', fontSize: '0.9em' }}>
        This will set "{network?.meshName}" as your current network.
      </p>
    </CustomModal>
  );
};

export default SwitchNetworkModal;
