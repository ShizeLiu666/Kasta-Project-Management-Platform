import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import CustomModal from '../../../CustomComponents/CustomModal';
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth';
import { PRODUCT_TYPE_MAP } from '../PRODUCT_TYPE_MAP';

const DeleteDeviceModal = ({ isOpen, toggle, devices, networkId, onSuccess }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [requestPreview, setRequestPreview] = useState(null);

  // 处理设备选择
  const handleDeviceSelect = (e) => {
    const deviceId = e.target.value;
    const device = devices.find(d => d.deviceId.toString() === deviceId);
    setSelectedDevice(device);
    
    // 更新请求预览
    if (device) {
      const requestBody = {
        networkId: networkId,
        deviceId: device.deviceId
      };
      setRequestPreview(JSON.stringify(requestBody, null, 2));
    } else {
      setRequestPreview(null);
    }
  };

  // 提交删除请求
  const handleSubmit = async () => {
    try {
      if (!selectedDevice) {
        setError('Please select a device to delete');
        return;
      }

      setIsSubmitting(true);
      setError('');

      const requestBody = {
        networkId: networkId,
        deviceId: selectedDevice.deviceId
      };
      
      console.log('Delete device request:', requestBody);

      const token = getToken();
      const response = await axiosInstance.delete('/devices/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: requestBody  // 在DELETE请求中，请求体需要通过data属性传递
      });

      if (response.data.success) {
        onSuccess();
        toggle();
      } else {
        setError(response.data.errorMsg || 'Failed to delete device');
      }
    } catch (error) {
      setError(error.response?.data?.errorMsg || 'Failed to delete device');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Delete Device"
      onSubmit={handleSubmit}
      submitText="Delete Device"
      isSubmitting={isSubmitting}
      error={error}
      submitButtonColor="#dc3545"
    >
      <Form>
        <FormGroup>
          <Label for="deviceSelect">Select Device to Delete</Label>
          <Input
            type="select"
            name="deviceSelect"
            id="deviceSelect"
            onChange={handleDeviceSelect}
            value={selectedDevice?.deviceId || ''}
          >
            <option value="">Select a device</option>
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.name} ({PRODUCT_TYPE_MAP[device.productType] || device.productType})
              </option>
            ))}
          </Input>
        </FormGroup>
        
        {selectedDevice && (
          <div className="selected-device-info" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <p style={{ margin: '0', fontSize: '14px' }}><strong>Device ID:</strong> {selectedDevice.deviceId}</p>
            <p style={{ margin: '0', fontSize: '14px' }}><strong>Type:</strong> {PRODUCT_TYPE_MAP[selectedDevice.productType] || selectedDevice.productType}</p>
            <p style={{ margin: '0', fontSize: '14px' }}><strong>Name:</strong> {selectedDevice.name}</p>
          </div>
        )}
        
        {requestPreview && (
          <FormGroup>
            <Label for="requestPreview">Request Format:</Label>
            <Alert color="info" style={{ fontFamily: 'monospace', whiteSpace: 'pre', overflow: 'auto' }}>
              {requestPreview}
            </Alert>
          </FormGroup>
        )}
      </Form>
    </CustomModal>
  );
};

export default DeleteDeviceModal; 