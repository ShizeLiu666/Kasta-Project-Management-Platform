import React, { useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import CustomModal from '../../../CustomComponents/CustomModal';
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth/auth';
import { PRODUCT_TYPE_MAP } from '../PRODUCT_TYPE_MAP';

// TOUCH_PANEL 设备类型映射
const TOUCH_PANEL_DEVICE_TYPES = {
  // 标准面板
  "1BWS": "1 button panel",
  "2BWS": "2 button panel",
  "3BWS": "3 button panel",
  "4BWS": "4 button panel",
  "6BWS": "6 button panel",
  
  // T3 版本
  "KT1RSB": "1 button panel (T3 Version)",
  "KT2RSB": "2 button panel (T3 Version)",
  "KT3RSB": "3 button panel (T3 Version)",
  "KT4RSB": "4 button panel (T3 Version)",
  "KT6RSB": "6 button panel (T3 Version)",
  
  // D8 版本
  "KD1RSB": "1 button panel (D8 Version)",
  "KD2RSB": "2 button panel (D8 Version)",
  "KD3RSB": "3 button panel (D8 Version)",
  "KD4RSB": "4 button panel (D8 Version)",
  "KD6RSB": "6 button panel (D8 Version)",
  
  // T3 开关版本
  "KT1RSB_SWITCH": "1 panel switch (T3 Version)",
  "KT2RSB_SWITCH": "2 panel switch (T3 Version)",
  "KT3RSB_SWITCH": "3 panel switch (T3 Version)",
  
  // T3 调光版本
  "KT1RSB_DIMMER": "1 panel switch (T3 Version)",
  "KT2RSB_DIMMER": "2 panel switch (T3 Version)",
  "KT3RSB_DIMMER": "3 panel switch (T3 Version)",
  
  // Edgy 版本
  "EDGY1RB": "1 button panel (Edgy Version)",
  "EDGY2RB": "2 button panel (Edgy Version)",
  "EDGY3RB": "3 button panel (Edgy Version)",
  "EDGY4RB": "4 button panel (Edgy Version)",
  "EDGY5RB": "5 button panel (Edgy Version)",
  "EDGY6RB": "6 button panel (Edgy Version)",
  
  // Integral 版本
  "INTEGRAL1RB": "1 button panel (Push-button, with backlight option)",
  "INTEGRAL2RB": "2 button panel (Push-button, with backlight option)",
  "INTEGRAL3RB": "3 button panel (Push-button, with backlight option)",
  "INTEGRAL4RB": "4 button panel (Push-button, with backlight option)",
  "INTEGRAL5RB": "5 button panel (Push-button, with backlight option)",
  "INTEGRAL6RB": "6 button panel (Push-button, with backlight option)",
  
  // Hesperus 版本
  "HESPERUS1CSB": "1 button panel (Push-button, no backlight option)",
  "HESPERUS2CSB": "2 button panel (Push-button, no backlight option)",
  "HESPERUS3CSB": "3 button panel (Push-button, no backlight option)",
  "HESPERUS4CSB": "4 button panel (Push-button, no backlight option)",
  "HESPERUS6CSB": "6 button panel (Push-button, no backlight option)",
  
  // 特殊面板
  "CW_PANEL": "cct panel (T3 Version)",
  "RGB_PANEL": "rgb panel (T3 Version)",
  "RGBCW_PANEL": "rgbCw panel (T3 Version)",
  
  // P 版本
  "KD1RS": "1 button panel (P Version)",
  "KD2RS": "2 button panel (P Version)",
  "KD3RS": "3 button panel (P Version)",
  "KD4RS": "4 button panel (P Version)",
  "KD6RS": "6 button panel (P Version)",
  
  // P 版本开关
  "KD1TS_SWITCH": "1 panel switch (P Version)",
  "KD2TS_SWITCH": "2 panel switch (P Version)",
  "KD3TS_SWITCH": "3 panel switch (P Version)",
  
  // P 版本调光器
  "KD1TS_DIMMER": "1 panel switch (P Version)",
  "KD2TS_DIMMER": "2 panel switch (P Version)",
  "KD3TS_DIMMER": "3 panel switch (P Version)",
  
  // Co base 版本
  "HS1RSCB": "1 button panel (Push-button, Co base)",
  "HS2RSCB": "2 button panel (Push-button, Co base)",
  "HS3RSCB": "3 button panel (Push-button, Co base)",
  "HS4RSCB": "4 button panel (Push-button, Co base)",
  "HS5RSCB": "5 button panel (Push-button, Co base)",
  "HS6RSCB": "6 button panel (Push-button, Co base)"
};

// RB02 设备类型映射
const RB02_DEVICE_TYPES = {
  "RB02_REMOTE": "Standard Remote",
  "ACRB02_REMOTE": "AC Remote"
};

// 添加 SIX_INPUT_FOUR_OUTPUT 设备类型映射
const SIX_INPUT_FOUR_OUTPUT_DEVICE_TYPES = {
  "6RSIBH": "6-Channel Input Device",
  "4DCOB": "4-Channel Output Device"
};

// T3_SWITCH 设备类型映射
const T3_SWITCH_DEVICE_TYPES = {
  "KT1RSB_SWITCH": "1 panel switch (T3 Version)",
  "KT2RSB_SWITCH": "2 panel switch (T3 Version)",
  "KT3RSB_SWITCH": "3 panel switch (T3 Version)"
};

// T3_DIMMER 设备类型映射
const T3_DIMMER_DEVICE_TYPES = {
  "KT1RSB_DIMMER": "1 panel dimmer (T3 Version)",
  "KT2RSB_DIMMER": "2 panel dimmer (T3 Version)",
  "KT3RSB_DIMMER": "3 panel dimmer (T3 Version)"
};

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
  // const deviceTypeOptions = Object.values(PRODUCT_TYPE_MAP).sort((a, b) => a.localeCompare(b));

  // 修改 getDeviceTypeOptions 函数
  const getDeviceTypeOptions = (productType) => {
    switch (productType) {
      case 'skr8wl4o': // TOUCH_PANEL
        return Object.entries(TOUCH_PANEL_DEVICE_TYPES).map(([code, name]) => ({
          code,
          name: `${code} - ${name}`
        })).sort((a, b) => a.name.localeCompare(b.name));
      
      case 'ng8eledm': // RB02
        return Object.entries(RB02_DEVICE_TYPES).map(([code, name]) => ({
          code,
          name: `${code} - ${name}`
        })).sort((a, b) => a.name.localeCompare(b.name));
      
      case '5ozdgdrd': // SIX_INPUT_FOUR_OUTPUT
        return Object.entries(SIX_INPUT_FOUR_OUTPUT_DEVICE_TYPES).map(([code, name]) => ({
          code,
          name: `${code} - ${name}`
        })).sort((a, b) => a.name.localeCompare(b.name));
      
      case 'acqhrjul': // T3_SWITCH
        return Object.entries(T3_SWITCH_DEVICE_TYPES).map(([code, name]) => ({
          code,
          name: `${code} - ${name}`
        })).sort((a, b) => a.name.localeCompare(b.name));
      
      case 'fybufemo': // T3_DIMMER
        return Object.entries(T3_DIMMER_DEVICE_TYPES).map(([code, name]) => ({
          code,
          name: `${code} - ${name}`
        })).sort((a, b) => a.name.localeCompare(b.name));

      default:
        return []; // 其他产品类型不显示设备类型选项
    }
  };

  // 修改 handleInputChange 函数
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productType') {
      // 检查是否是需要设备类型选择的产品类型
      const needsDeviceType = ['skr8wl4o', 'ng8eledm', '5ozdgdrd', 'acqhrjul', 'fybufemo'].includes(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        deviceType: needsDeviceType ? '' : value
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
            disabled={!['skr8wl4o', 'ng8eledm', '5ozdgdrd', 'acqhrjul', 'fybufemo'].includes(formData.productType)}
          >
            <option value="">Select a device type</option>
            {formData.productType && getDeviceTypeOptions(formData.productType).map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
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