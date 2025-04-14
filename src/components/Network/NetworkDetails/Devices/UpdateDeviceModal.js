import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import CustomModal from '../../../CustomComponents/CustomModal';
import axiosInstance from '../../../../config';
import { getToken } from '../../../auth/auth';
import { PRODUCT_TYPE_MAP } from '../PRODUCT_TYPE_MAP';
import { DEVICE_CONFIGS } from './DeviceConfigs';
import FORM_COMPONENTS from './DeviceFormComponents';

// 设备属性配置映射
const DEVICE_ATTRIBUTES_CONFIG = {
  TOUCH_PANEL: {
    brightness: { type: 'number', label: 'Brightness', min: 0, max: 100 },
    state: { type: 'select', label: 'State', options: ['ON', 'OFF'] }
  },
  SOCKET_RELAY: {
    power: { type: 'select', label: 'Power', options: [0, 1], optionLabels: ['Off', 'On'] },
    delay: { type: 'number', label: 'Delay', min: 0, max: 59, description: 'Delay time in minutes (0-59)' },
    pValue: { type: 'number', label: 'Power Value', readOnly: true, description: 'Current power consumption value' },
    socketErrors: { 
      type: 'array', 
      label: 'Error Logs', 
      readOnly: true,
      description: 'Socket error logs with channel information (0=Left, 1=Right)'
    }
  },
  FAN: {
    fanLightState: { type: 'select', label: 'Light Status', options: [0, 1], optionLabels: ['Off', 'On'] },
    fanState: { type: 'select', label: 'Fan Status', options: [0, 1, 2, 3], optionLabels: ['Close', 'Low', 'Medium', 'High'] },
    isHaveFanLight: { type: 'select', label: 'Has Light', options: [0, 1], optionLabels: ['No', 'Yes'] },
    isConfigFanLight: { type: 'select', label: 'Light Configured', options: [0, 1], optionLabels: ['No', 'Yes'] },
    delay: { type: 'number', label: 'Delay', min: 0, max: 59 }
  },
  RGB_CW: {
    power: { type: 'select', label: 'Power', options: [0, 1], optionLabels: ['Off', 'On'] },
    level: { type: 'number', label: 'Brightness', min: 0, max: 255 },
    colorTemperature: { type: 'number', label: 'Color Temp', min: 0, max: 65535 },
    red: { type: 'number', label: 'Red', min: 0, max: 255 },
    green: { type: 'number', label: 'Green', min: 0, max: 255 },
    blue: { type: 'number', label: 'Blue', min: 0, max: 255 },
    blinkSpeed: { type: 'select', label: 'Blink Speed', options: [-1, 0, 1, 2], optionLabels: ['None', 'Slow', 'Medium', 'Fast'] },
    delay: { type: 'number', label: 'Delay', min: 0, max: 59 },
    isRgb: { type: 'select', label: 'Mode', options: [0, 1], optionLabels: ['Color Temperature', 'RGB'] }
  },
  CCT_DOWNLIGHT: {
    power: { type: 'select', label: 'Power', options: [0, 1], optionLabels: ['Off', 'On'] },
    level: { type: 'number', label: 'level', min: 0, max: 255 },
    colorTemperature: { type: 'number', label: 'Color Temp', min: 0, max: 65535 },
    delay: { type: 'number', label: 'Delay', min: 0, max: 59 }
  },
  DIMMER: {
    power: { type: 'select', label: 'Power', options: [0, 1], optionLabels: ['Off', 'On'] },
    level: { type: 'number', label: 'level', min: 0, max: 255 },
    delay: { type: 'number', label: 'Delay', min: 0, max: 59 }
  },
  SOCKET_SWITCH: {
    power: { type: 'select', label: 'Power', options: [0, 1], optionLabels: ['Off', 'On'] },
    delay: { type: 'number', label: 'Delay', min: 0, max: 59 }
  },
  THERMOSTAT: {
    power: { type: 'select', label: 'Power', options: [0, 1], optionLabels: ['Off', 'On'] },
    mode: { type: 'select', label: 'Mode', options: [0, 1, 2, 3], optionLabels: ['Cool', 'Fan', 'Heat', 'Auto'] },
    setTemperature: { type: 'number', label: 'Set Temperature', min: 160, max: 320, description: 'Value will be multiplied by 0.1°C' },
    currentTemperature: { type: 'number', label: 'Current Temperature', readOnly: true, description: 'Value will be multiplied by 0.1°C' },
    fanSpeed: { type: 'select', label: 'Fan Speed', options: [0, 1, 2, 3], optionLabels: ['Auto', 'Slow', 'Medium', 'Fast'] },
    delay: { type: 'number', label: 'Delay', min: 0, max: 59 }
  },
  VCAL_SOCKET: {
    power: { type: 'select', label: 'Power', options: [0, 1], optionLabels: ['Off', 'On'] },
    lockStatus: { type: 'select', label: 'Lock Status', options: [0, 1], optionLabels: ['Lock', 'Unlock'] },
    backLight: { type: 'number', label: 'Back Light', min: 0, max: 30, description: 'Backlight level (0-5=Low, 6-15=Medium, 16-30=High)' },
    delay: { type: 'number', label: 'Delay', min: 0, max: 59 }
  },
  T3_SWITCH: {
    powerFirst: { type: 'select', label: 'Power 1', options: [0, 1], optionLabels: ['Off', 'On'] },
    powerSecond: { type: 'select', label: 'Power 2', options: [0, 1], optionLabels: ['Off', 'On'] },
    powerThird: { type: 'select', label: 'Power 3', options: [0, 1], optionLabels: ['Off', 'On'] },
    delayFirst: { type: 'number', label: 'Delay 1', min: 0, max: 59 },
    delaySecond: { type: 'number', label: 'Delay 2', min: 0, max: 59 },
    delayThird: { type: 'number', label: 'Delay 3', min: 0, max: 59 }
  },
  T3_DIMMER: {
    powerFirst: { type: 'select', label: 'Power 1', options: [0, 1], optionLabels: ['Off', 'On'] },
    powerSecond: { type: 'select', label: 'Power 2', options: [0, 1], optionLabels: ['Off', 'On'] },
    powerThird: { type: 'select', label: 'Power 3', options: [0, 1], optionLabels: ['Off', 'On'] },
    levelFirst: { type: 'number', label: 'Level 1', min: 0, max: 255, description: 'Brightness level (0-255)' },
    levelSecond: { type: 'number', label: 'Level 2', min: 0, max: 255, description: 'Brightness level (0-255)' },
    levelThird: { type: 'number', label: 'Level 3', min: 0, max: 255, description: 'Brightness level (0-255)' },
    delayFirst: { type: 'number', label: 'Delay 1', min: 0, max: 59 },
    delaySecond: { type: 'number', label: 'Delay 2', min: 0, max: 59 },
    delayThird: { type: 'number', label: 'Delay 3', min: 0, max: 59 }
  },
  CURTAIN: {
    power: { type: 'select', label: 'Power', options: [0, 1], optionLabels: ['Off', 'On'] },
    isConfig: { type: 'select', label: 'Is Config', options: [0, 1], optionLabels: ['No', 'Yes'] },
    delay: { type: 'number', label: 'Delay', min: 0, max: 59 },
    isDirection: { type: 'select', label: 'Direction', options: [0, 1], optionLabels: ['Forward', 'Reverse'] }
  },
  PIR: {
    sensitivity: { type: 'select', label: 'Sensitivity', options: ['LOW', 'MEDIUM', 'HIGH'] },
    detectionMode: { type: 'select', label: 'Detection Mode', options: ['ALWAYS', 'DAY', 'NIGHT'] }
  },
  RB02: {
    batteryLevel: { type: 'number', label: 'Battery Level', min: 0, max: 100, readOnly: true },
    buttonAction: { type: 'select', label: 'Button Action', options: ['PRESS', 'HOLD', 'RELEASE'] }
  },
  SIX_INPUT: {
    inputState: { type: 'select', label: 'Input State', options: ['ACTIVE', 'INACTIVE'] },
    inputChannel: { type: 'select', label: 'Input Channel', options: ['1', '2', '3', '4', '5', '6'] }
  },
  FOUR_OUTPUT: {
    outputState: { type: 'select', label: 'Output State', options: ['ON', 'OFF'] },
    outputChannel: { type: 'select', label: 'Output Channel', options: ['1', '2', '3', '4'] }
  },
  FIVE_BUTTON: {
    checkTime: { type: 'text', label: 'Check Time', placeholder: 'YYYY-MM-DD HH:MM:SS' },
    remoteBind: { 
      type: 'textarea', 
      label: 'Remote Bindings (JSON format)',
      placeholder: `[
  {
    "bindType": 0,
    "bindId": 0,
    "hour": 0,
    "min": 0,
    "state": 0,
    "enable": 1,
    "hasTimer": 0,
    "hole": 1,
    "bindChannel": 0
  }
]`,
      rows: 10,
      help: `字段说明:
- bindType: 绑定类型 (0)
- bindId: 绑定ID (设备ID)
- hour: 小时 (0-23)
- min: 分钟 (0-59)
- state: 状态 (0=关闭, 1=开启)
- enable: 启用状态 (0=禁用, 1=启用)
- hasTimer: 是否有定时器 (0=无, 1=有)
- hole: 按钮孔位 (1-5, 对应按钮1-5)
- bindChannel: 绑定通道 (0=左, 1=右)`
    }
  },
  DRY_CONTACT: {
    power: { type: 'select', label: 'Power', options: [0, 1], optionLabels: ['Off', 'On'] },
    dryType: { type: 'select', label: 'Type', options: [0, 1, 6, 9], optionLabels: ['Toggle', 'Momentary 1s', 'Momentary 6s', 'Momentary 9s'] },
    isConfig: { type: 'select', label: 'Configured', options: [0, 1], optionLabels: ['No', 'Yes'] },
    delay: { type: 'number', label: 'Delay', min: 0, max: 59 }
  },
  DAYLIGHT_SENSOR: {
    power: { type: 'select', label: 'Power', options: [0, 1], optionLabels: ['Off', 'On'] },
    sensorBindID: { type: 'number', label: 'Sensor Bind ID', description: 'ID of the device to bind with this sensor' }
  },
  PANGU: {
    connectState: { 
      type: 'number', 
      label: 'Connection State', 
      min: 0, 
      max: 15,
      description: 'Connection state bitmap: bit 0=WiFi, bit 1=Ethernet, bit 2=Internet, bit 3=Kasta Cloud'
    },
    isBearer: {
      type: 'select',
      label: 'Is Bearer',
      options: [0, 1],
      optionLabels: ['No', 'Yes'],
      description: 'Indicates if this device is a bearer'
    },
    subDevices: { 
      type: 'textarea', 
      label: 'Sub Devices (JSON format)', 
      placeholder: `[
  {
    "sendDeviceId": "67890",
    "sendDid": 54321,
    "isAuth": 1
  }
]`,
      rows: 10,
      help: `字段说明:
- sendDeviceId: 发送设备ID (字符串)
- sendDid: 发送DID (整数)
- isAuth: 是否已授权 (0=否, 1=是)`
    }
  },
  FIVE_INPUT: {
    isConfig: { 
      type: 'select', 
      label: 'Configuration Status', 
      options: [0, 1], 
      optionLabels: ['Not Configured', 'Configured']
    },
    remoteBind: { 
      type: 'textarea', 
      label: 'Remote Bindings (JSON format)',
      placeholder: `[
  {
    "inputType": 0,
    "bindType": 0,
    "bindId": 0,
    "hour": 0,
    "min": 0,
    "state": 0,
    "enable": 1,
    "hasTimer": 0,
    "hole": 1,
    "bindChannel": 0
  }
]`,
      rows: 10,
      help: `字段说明:
- inputType: 输入类型 (0=Toggle, 1=Momentary)
- bindType: 绑定类型 (0=设备, 1=组, 2=场景)
- bindId: 绑定ID (设备ID/组ID/场景ID)
- hour: 小时 (0-23)
- min: 分钟 (0-59)
- state: 状态 (0=关闭, 1=开启)
- enable: 启用状态 (0=禁用, 1=启用)
- hasTimer: 是否有定时器 (0=无, 1=有)
- hole: 输入孔位 (1-5, 对应输入1-5)
- bindChannel: 绑定通道 (0=左, 1=右)`
    }
  },
};

const UpdateDeviceModal = ({ isOpen, toggle, devices, onSuccess }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [requestPreview, setRequestPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // 当选择设备时更新表单数据
  useEffect(() => {
    if (selectedDevice) {
      // 获取设备类型
      let type = PRODUCT_TYPE_MAP[selectedDevice.productType];
      
      // 特殊处理 SIX_INPUT_FOUR_OUTPUT
      if (type === 'SIX_INPUT_FOUR_OUTPUT') {
        if (selectedDevice.deviceType === '6RSIBH') {
          type = 'SIX_INPUT';
        } else if (selectedDevice.deviceType === '4DCOB') {
          type = 'FOUR_OUTPUT';
        }
      }
      
      setDeviceType(type);
      
      // 初始化表单数据
      const initialFormData = {};
      
      // 特殊处理 T3_SWITCH 和 T3_DIMMER
      if (type === 'T3_SWITCH' || type === 'T3_DIMMER') {
        // 解析设备类型，获取按键数量
        let buttonCount = 3; // 默认为3键
        
        if (selectedDevice.deviceType.startsWith('KT') && 
            (selectedDevice.deviceType.includes('RSB_SWITCH') || selectedDevice.deviceType.includes('RSB_DIMMER'))) {
          const match = selectedDevice.deviceType.match(/KT(\d)RSB/);
          if (match && match[1]) {
            buttonCount = parseInt(match[1]);
          }
        }
        
        // 根据按键数量设置可用属性
        if (type === 'T3_SWITCH') {
          // 只添加设备实际拥有的按键数量对应的属性
          for (let i = 1; i <= buttonCount; i++) {
            const powerKey = i === 1 ? 'powerFirst' : i === 2 ? 'powerSecond' : 'powerThird';
            const delayKey = i === 1 ? 'delayFirst' : i === 2 ? 'delaySecond' : 'delayThird';
            
            initialFormData[powerKey] = '';
            initialFormData[delayKey] = '';
          }
        } else if (type === 'T3_DIMMER') {
          // 只添加设备实际拥有的按键数量对应的属性
          for (let i = 1; i <= buttonCount; i++) {
            const powerKey = i === 1 ? 'powerFirst' : i === 2 ? 'powerSecond' : 'powerThird';
            const levelKey = i === 1 ? 'levelFirst' : i === 2 ? 'levelSecond' : 'levelThird';
            const delayKey = i === 1 ? 'delayFirst' : i === 2 ? 'delaySecond' : 'delayThird';
            
            initialFormData[powerKey] = '';
            initialFormData[levelKey] = '';
            initialFormData[delayKey] = '';
          }
        }
      } else {
        // 检查是否有新的设备配置
        const deviceConfig = DEVICE_CONFIGS[type];
        if (deviceConfig && deviceConfig.fields) {
          // 使用新的配置格式
          deviceConfig.fields.forEach(field => {
            if (field.type === 'custom' && field.component === 'RemoteBindEditor') {
              // 为 RemoteBindEditor 组件预设一个空数组
              initialFormData[field.name] = '[]';
            } else {
              initialFormData[field.name] = '';
            }
          });
        } else if (DEVICE_ATTRIBUTES_CONFIG[type]) {
          // 使用旧的配置格式
          Object.keys(DEVICE_ATTRIBUTES_CONFIG[type]).forEach(key => {
            // 特殊处理 FIVE_BUTTON 的 remoteBind 属性，预填充模板
            if (type === 'FIVE_BUTTON' && key === 'remoteBind') {
              const template = [
                {
                  "bindType": 0,
                  "bindId": 0,
                  "hour": 0,
                  "min": 0,
                  "state": 0,
                  "enable": 1,
                  "hasTimer": 0,
                  "hole": 1,
                  "bindChannel": 0
                }
              ];
              initialFormData[key] = JSON.stringify(template, null, 2);
            } else {
              initialFormData[key] = '';
            }
          });
        } else {
          // 如果没有找到对应的配置，添加一个通用属性
          initialFormData.state = '';
        }
      }
      
      setFormData(initialFormData);
      setFormErrors({});
    }
  }, [selectedDevice]);

  // 处理设备选择
  const handleDeviceSelect = (e) => {
    const deviceId = e.target.value;
    const device = devices.find(d => d.deviceId.toString() === deviceId);
    setSelectedDevice(device);
  };

  // 处理表单字段变更
  const handleFieldChange = (name, value) => {
    console.log(`Changing field ${name} to:`, value);
    
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: value
      };
      
      // 更新请求预览
      updateRequestPreview(newFormData);
      
      return newFormData;
    });
  };

  // 更新请求预览
  const updateRequestPreview = (data) => {
    if (!selectedDevice) return;
    
    // 过滤掉空值并转换类型
    const attributes = {};
    
    // 检查是否有新的设备配置
    const deviceConfig = DEVICE_CONFIGS[deviceType];
    
    if (deviceConfig && deviceConfig.fields) {
      // 使用新的配置格式处理数据
      deviceConfig.fields.forEach(field => {
        const value = data[field.name];
        if (value !== undefined && value !== '') {
          if (field.type === 'custom' && field.component === 'RemoteBindEditor') {
            // 处理 RemoteBindEditor 组件的值
            try {
              attributes[field.name] = JSON.parse(value);
            } catch (e) {
              console.error(`Failed to parse ${field.name} value as JSON`, e);
            }
          } else if (field.type === 'number') {
            attributes[field.name] = Number(value);
          } else if (field.type === 'select' && !isNaN(Number(value))) {
            attributes[field.name] = Number(value);
          } else {
            attributes[field.name] = value;
          }
        }
      });
    } else {
      // 使用旧的配置格式处理数据
      Object.entries(data).forEach(([key, value]) => {
        if (value !== '') {
          // 检查当前设备类型的配置
          const config = DEVICE_ATTRIBUTES_CONFIG[deviceType];
          if (config && config[key]) {
            if (config[key].type === 'textarea' && key === 'remoteBind') {
              // 特殊处理 remoteBind 文本区域，尝试解析为JSON
              try {
                attributes[key] = JSON.parse(value);
              } catch (e) {
                console.error(`Failed to parse ${key} textarea value as JSON`, e);
              }
            } else if (config[key].type === 'number') {
              // 如果是数字类型，转换为数字
              attributes[key] = Number(value);
            } else if (config[key].type === 'select' && !isNaN(Number(value))) {
              // 如果是选择类型但值是数字形式的字符串，转换为数字
              attributes[key] = Number(value);
            } else {
              attributes[key] = value;
            }
          } else {
            attributes[key] = value;
          }
        }
      });
    }
    
    const requestBody = {
      deviceId: selectedDevice.deviceId,
      attributes: attributes
    };
    
    setRequestPreview(JSON.stringify(requestBody, null, 2));
  };

  // 渲染表单字段
  const renderFormFields = () => {
    if (!selectedDevice) return null;

    // 特殊处理 T3_SWITCH 和 T3_DIMMER
    if (deviceType === 'T3_SWITCH' || deviceType === 'T3_DIMMER') {
      // 解析设备类型，获取按键数量
      let buttonCount = 3; // 默认为3键
      
      if (selectedDevice.deviceType.startsWith('KT') && 
          (selectedDevice.deviceType.includes('RSB_SWITCH') || selectedDevice.deviceType.includes('RSB_DIMMER'))) {
        const match = selectedDevice.deviceType.match(/KT(\d)RSB/);
        if (match && match[1]) {
          buttonCount = parseInt(match[1]);
        }
      }
      
      // 获取配置
      const config = DEVICE_ATTRIBUTES_CONFIG[deviceType];
      const fields = [];
      
      // 根据按键数量生成表单字段
      if (deviceType === 'T3_SWITCH') {
        for (let i = 1; i <= buttonCount; i++) {
          const powerKey = i === 1 ? 'powerFirst' : i === 2 ? 'powerSecond' : 'powerThird';
          const delayKey = i === 1 ? 'delayFirst' : i === 2 ? 'delaySecond' : 'delayThird';
          
          fields.push(renderField({
            name: powerKey,
            type: config[powerKey].type,
            label: config[powerKey].label,
            options: config[powerKey].options,
            optionLabels: config[powerKey].optionLabels,
            description: config[powerKey].description
          }, formData[powerKey], (value) => handleFieldChange(powerKey, value), formErrors));
          
          fields.push(renderField({
            name: delayKey,
            type: config[delayKey].type,
            label: config[delayKey].label,
            min: config[delayKey].min,
            max: config[delayKey].max,
            description: config[delayKey].description
          }, formData[delayKey], (value) => handleFieldChange(delayKey, value), formErrors));
        }
      } else if (deviceType === 'T3_DIMMER') {
        for (let i = 1; i <= buttonCount; i++) {
          const powerKey = i === 1 ? 'powerFirst' : i === 2 ? 'powerSecond' : 'powerThird';
          const levelKey = i === 1 ? 'levelFirst' : i === 2 ? 'levelSecond' : 'levelThird';
          const delayKey = i === 1 ? 'delayFirst' : i === 2 ? 'delaySecond' : 'delayThird';
          
          fields.push(renderField({
            name: powerKey,
            type: config[powerKey].type,
            label: config[powerKey].label,
            options: config[powerKey].options,
            optionLabels: config[powerKey].optionLabels,
            description: config[powerKey].description
          }, formData[powerKey], (value) => handleFieldChange(powerKey, value), formErrors));
          
          fields.push(renderField({
            name: levelKey,
            type: config[levelKey].type,
            label: config[levelKey].label,
            min: config[levelKey].min,
            max: config[levelKey].max,
            description: config[levelKey].description
          }, formData[levelKey], (value) => handleFieldChange(levelKey, value), formErrors));
          
          fields.push(renderField({
            name: delayKey,
            type: config[delayKey].type,
            label: config[delayKey].label,
            min: config[delayKey].min,
            max: config[delayKey].max,
            description: config[delayKey].description
          }, formData[delayKey], (value) => handleFieldChange(delayKey, value), formErrors));
        }
      }
      
      return fields;
    }

    // 其他设备类型的处理保持不变
    // 检查是否有新的设备配置
    const deviceConfig = DEVICE_CONFIGS[deviceType];
    
    if (deviceConfig && deviceConfig.fields) {
      // 使用新的配置格式渲染表单
      return deviceConfig.fields.map(field => 
        renderField(field, formData[field.name], (value) => handleFieldChange(field.name, value), formErrors)
      );
    } else {
      // 使用旧的配置格式渲染表单
      const config = DEVICE_ATTRIBUTES_CONFIG[deviceType] || {
        state: { type: 'select', label: 'State', options: ['ON', 'OFF'] }
      };

      console.log("Current form data:", formData);
      console.log("Device type config:", config);

      return Object.entries(config).map(([key, fieldConfig]) => {
        // 转换旧格式为新格式
        const field = {
          name: key,
          type: fieldConfig.type,
          label: fieldConfig.label,
          options: fieldConfig.options,
          description: fieldConfig.description || fieldConfig.help,
          placeholder: fieldConfig.placeholder,
          min: fieldConfig.min,
          max: fieldConfig.max,
          rows: fieldConfig.rows
        };
        
        return renderField(field, formData[key], (value) => handleFieldChange(key, value), formErrors);
      });
    }
  };

  // 提交更新请求
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      setFormErrors({});

      // 过滤掉空值并转换类型
      const attributes = {};
      let hasValidationErrors = false;
      const newErrors = {};
      
      // 特殊处理 T3_SWITCH 和 T3_DIMMER
      if (deviceType === 'T3_SWITCH' || deviceType === 'T3_DIMMER') {
        // 只处理表单中存在的字段
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== '') {
            if (key.startsWith('power') || key.startsWith('delay')) {
              attributes[key] = Number(value);
            } else if (key.startsWith('level')) {
              attributes[key] = Number(value);
            } else {
              attributes[key] = value;
            }
          }
        });
      } else {
        // 其他设备类型的处理保持不变
        // 检查是否有新的设备配置
        const deviceConfig = DEVICE_CONFIGS[deviceType];
        
        if (deviceConfig && deviceConfig.fields) {
          // 使用新的配置格式处理数据
          deviceConfig.fields.forEach(field => {
            const value = formData[field.name];
            if (value !== undefined && value !== '') {
              if (field.type === 'custom' && field.component === 'RemoteBindEditor') {
                // 处理 RemoteBindEditor 组件的值
                try {
                  attributes[field.name] = JSON.parse(value);
                } catch (e) {
                  console.error(`Failed to parse ${field.name} value as JSON`, e);
                  newErrors[field.name] = `Invalid JSON format in ${field.label}`;
                  hasValidationErrors = true;
                }
              } else if (field.type === 'number') {
                attributes[field.name] = Number(value);
              } else if (field.type === 'select' && !isNaN(Number(value))) {
                attributes[field.name] = Number(value);
              } else {
                attributes[field.name] = value;
              }
            }
          });
        } else {
          // 使用旧的配置格式处理数据
          Object.entries(formData).forEach(([key, value]) => {
            if (value !== '') {
              // 检查当前设备类型的配置
              const config = DEVICE_ATTRIBUTES_CONFIG[deviceType];
              if (config && config[key]) {
                if (config[key].type === 'textarea' && key === 'remoteBind') {
                  // 特殊处理 remoteBind 文本区域，尝试解析为JSON
                  try {
                    attributes[key] = JSON.parse(value);
                  } catch (e) {
                    console.error(`Failed to parse ${key} textarea value as JSON`, e);
                    newErrors[key] = `Invalid JSON format in ${config[key].label}`;
                    hasValidationErrors = true;
                  }
                } else if (config[key].type === 'number') {
                  // 如果是数字类型，转换为数字
                  attributes[key] = Number(value);
                } else if (config[key].type === 'select' && !isNaN(Number(value))) {
                  // 如果是选择类型但值是数字形式的字符串，转换为数字
                  attributes[key] = Number(value);
                } else {
                  attributes[key] = value;
                }
              } else {
                attributes[key] = value;
              }
            }
          });
        }
      }
      
      if (hasValidationErrors) {
        setFormErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      // 如果没有属性要更新，显示错误
      if (Object.keys(attributes).length === 0) {
        setError('Please set at least one attribute to update');
        setIsSubmitting(false);
        return;
      }

      const requestBody = {
        deviceId: selectedDevice.deviceId,
        attributes: attributes
      };
      
      console.log('Update device request:', requestBody);

      const token = getToken();
      const response = await axiosInstance.post('/devices/update', requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        onSuccess();
        toggle();
      } else {
        setError(response.data.errorMsg || 'Failed to update device');
      }
    } catch (error) {
      setError(error.response?.data?.errorMsg || 'Failed to update device');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field, value, onChange, errors) => {
    const { type, label, description, placeholder, min, max, rows } = field;
    
    // 检查是否有自定义组件
    if (type === 'custom' && field.component && FORM_COMPONENTS[field.component]) {
      const CustomComponent = FORM_COMPONENTS[field.component];
      return (
        <FormGroup key={field.name}>
          <Label>{label}</Label>
          <CustomComponent 
            value={value || '[]'} 
            onChange={onChange} 
            config={field.config} 
          />
          {description && <small className="form-text text-muted">{description}</small>}
          {errors && errors[field.name] && <div className="text-danger">{errors[field.name]}</div>}
        </FormGroup>
      );
    }
    
    switch (type) {
      case 'textarea':
        return (
          <FormGroup key={field.name}>
            <Label for={field.name}>{label}</Label>
            <Input
              type="textarea"
              name={field.name}
              id={field.name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={rows || 5}
            />
            {description && <small className="form-text text-muted">{description}</small>}
            {errors && errors[field.name] && <div className="text-danger">{errors[field.name]}</div>}
          </FormGroup>
        );
      case 'select':
        return (
          <FormGroup key={field.name}>
            <Label for={field.name}>{label}</Label>
            <Input
              type="select"
              name={field.name}
              id={field.name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="">Select {label}</option>
              {Array.isArray(field.options) && field.options.map(opt => {
                // 处理选项格式
                if (typeof opt === 'object' && opt.value !== undefined) {
                  return <option key={opt.value} value={opt.value}>{opt.label}</option>;
                } else {
                  return <option key={opt} value={opt}>{opt}</option>;
                }
              })}
            </Input>
            {description && <small className="form-text text-muted">{description}</small>}
            {errors && errors[field.name] && <div className="text-danger">{errors[field.name]}</div>}
          </FormGroup>
        );
      case 'number':
        return (
          <FormGroup key={field.name}>
            <Label for={field.name}>{label}</Label>
            <Input
              type="number"
              name={field.name}
              id={field.name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              min={min}
              max={max}
              placeholder={placeholder}
            />
            {description && <small className="form-text text-muted">{description}</small>}
            {errors && errors[field.name] && <div className="text-danger">{errors[field.name]}</div>}
          </FormGroup>
        );
      default:
        return (
          <FormGroup key={field.name}>
            <Label for={field.name}>{label}</Label>
            <Input
              type={type || 'text'}
              name={field.name}
              id={field.name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
            />
            {description && <small className="form-text text-muted">{description}</small>}
            {errors && errors[field.name] && <div className="text-danger">{errors[field.name]}</div>}
          </FormGroup>
        );
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      title="Update Device Status"
      onSubmit={handleSubmit}
      submitText="Update Device"
      isSubmitting={isSubmitting}
      error={error}
    >
      <Form>
        <FormGroup>
          <Label for="deviceSelect">Select Device</Label>
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
            <p style={{ margin: '0', fontSize: '14px' }}><strong>Type:</strong> {deviceType || PRODUCT_TYPE_MAP[selectedDevice.productType] || selectedDevice.productType}</p>
          </div>
        )}
        
        {renderFormFields()}
        
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

export default UpdateDeviceModal;
