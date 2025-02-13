import React, { useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import CustomModal from '../../../CustomComponents/CustomModal';
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth';
import { PRODUCT_TYPE_MAP } from '../PRODUCT_TYPE_MAP';

const AddDeviceModal = ({ isOpen, toggle, networkId, onSuccess }) => {
  // 生成随机整数的辅助函数
  const generateRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // 生成UUID格式的字符串
  const generateUUID = () => {
    const segments = [8, 4, 4, 4, 12]; // UUID 格式的各段长度
    return segments
      .map(len => {
        let result = '';
        for (let i = 0; i < len; i++) {
          result += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
        }
        return result;
      })
      .join('-');
  };

  // 生成DHM Key (48位十六进制)
  const generateDHMKey = () => {
    let result = '';
    for (let i = 0; i < 48; i++) {
      result += '0123456789abcdef'[Math.floor(Math.random() * 16)];
    }
    return result;
  };

  // 生成Device Hash (8位十六进制)
  const generateDeviceHash = () => {
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += '0123456789abcdef'[Math.floor(Math.random() * 16)];
    }
    return result;
  };

  // 生成随机的初始值
  const initialFormData = {
    did: generateRandomInt(10000, 99999),     // 5位随机整数
    dhmKey: generateDHMKey(),  // 48位十六进制
    name: '',
    uuid: generateUUID(),    // 标准UUID格式
    deviceHash: generateDeviceHash(), // 8位十六进制
    productType: '',
    deviceType: '',
    appearanceShortname: '',
    iconLocal: '',
    passphrase: '',
    networkId: networkId
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 获取所有可用的设备类型名称
  const deviceTypeOptions = Object.values(PRODUCT_TYPE_MAP)
    .sort((a, b) => a.localeCompare(b));

  // 当 productType 改变时，自动设置对应的 deviceType
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productType') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        deviceType: PRODUCT_TYPE_MAP[value] || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      console.log(formData);

      const token = getToken();
      const response = await axiosInstance.post('/devices', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        onSuccess();
      } else {
        setError(response.data.errorMsg || 'Failed to add device');
      }
    } catch (error) {
      setError(error.response?.data?.errorMsg || 'Failed to add device');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 将 PRODUCT_TYPE_MAP 转换为选项数组
  const productTypeOptions = Object.entries(PRODUCT_TYPE_MAP).map(([code, name]) => ({
    code,
    name: `${code} (${name})`
  })).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Add New Device"
      onSubmit={handleSubmit}
      submitText="Add Device"
      isSubmitting={isSubmitting}
      error={error}
      submitButtonType="create"
    >
      <Form>
        <FormGroup>
          <Label for="did">Device ID (Auto-generated)</Label>
          <Input
            type="text"
            name="did"
            id="did"
            value={formData.did}
            disabled
            placeholder="Auto-generated Device ID"
          />
        </FormGroup>
        <FormGroup>
          <Label for="name">Device Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter device name"
          />
        </FormGroup>
        <FormGroup>
          <Label for="appearanceShortname">Appearance Shortname</Label>
          <Input
            type="text"
            name="appearanceShortname"
            id="appearanceShortname"
            value={formData.appearanceShortname}
            onChange={handleInputChange}
            placeholder="Enter appearance shortname"
          />
        </FormGroup>
        <FormGroup>
          <Label for="productType">Product Type</Label>
          <Input
            type="select"
            name="productType"
            id="productType"
            value={formData.productType}
            onChange={handleInputChange}
          >
            <option value="">Select a product type</option>
            {productTypeOptions.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="deviceType">Device Type</Label>
          <Input
            type="select"
            name="deviceType"
            id="deviceType"
            value={formData.deviceType}
            onChange={handleInputChange}
          >
            <option value="">Select a device type</option>
            {deviceTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="dhmKey">DHM Key (Auto-generated)</Label>
          <Input
            type="text"
            name="dhmKey"
            id="dhmKey"
            value={formData.dhmKey}
            disabled
            placeholder="Auto-generated DHM key"
          />
        </FormGroup>
        <FormGroup>
          <Label for="uuid">UUID (Auto-generated)</Label>
          <Input
            type="text"
            name="uuid"
            id="uuid"
            value={formData.uuid}
            disabled
            placeholder="Auto-generated UUID"
          />
        </FormGroup>
        <FormGroup>
          <Label for="deviceHash">Device Hash (Auto-generated)</Label>
          <Input
            type="text"
            name="deviceHash"
            id="deviceHash"
            value={formData.deviceHash}
            disabled
            placeholder="Auto-generated device hash"
          />
        </FormGroup>
        {/* <FormGroup>
          <Label for="iconLocal">Icon Local</Label>
          <Input
            type="text"
            name="iconLocal"
            id="iconLocal"
            value={formData.iconLocal}
            onChange={handleInputChange}
            placeholder="Enter icon local"
          />
        </FormGroup> */}
        <FormGroup>
          <Label for="passphrase">Passphrase</Label>
          <Input
            type="password"
            name="passphrase"
            id="passphrase"
            value={formData.passphrase}
            onChange={handleInputChange}
            placeholder="Enter passphrase"
          />
        </FormGroup>
      </Form>
    </CustomModal>
  );
};

export default AddDeviceModal;