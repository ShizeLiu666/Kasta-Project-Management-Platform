import React from 'react';
import BasicTable from '../BasicTable';
import t3SwitchIcon from '../../../../../../assets/icons/DeviceType/T3_SWITCH.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

// 解析设备类型，获取按键数量
const parseDeviceType = (deviceType) => {
  // 默认为3键
  let buttonCount = 3;
  
  // 从设备类型中提取按键数量
  if (deviceType.startsWith('KT') && deviceType.includes('RSB_SWITCH')) {
    const match = deviceType.match(/KT(\d)RSB_SWITCH/);
    if (match && match[1]) {
      buttonCount = parseInt(match[1]);
    }
  }
  
  return { buttonCount };
};

// 获取对应按键数量的图标
const getSwitchIcon = (buttonCount) => {
  try {
    return require(`../../../../../../assets/icons/DeviceType/T3_SWITCH_${buttonCount}.png`);
  } catch (error) {
    console.warn(`Icon not found for ${buttonCount}-button switch, using default`);
    return t3SwitchIcon;
  }
};

const T3_SWITCHType = ({ devices }) => {
  // 按设备类型分组
  const devicesByType = {};
  
  devices.forEach(device => {
    if (!devicesByType[device.deviceType]) {
      devicesByType[device.deviceType] = [];
    }
    devicesByType[device.deviceType].push(device);
  });
  
  // 渲染每种类型的设备表格
  return (
    <>
      {Object.entries(devicesByType).map(([deviceType, typeDevices]) => {
        // 获取按键数量
        const { buttonCount } = parseDeviceType(deviceType);
        
        // 获取对应图标
        const switchIcon = getSwitchIcon(buttonCount);
        
        // 根据按键数量动态生成列
        const columns = [];
        
        // 只显示设备实际拥有的按键数量
        for (let i = 1; i <= buttonCount; i++) {
          const powerKey = i === 1 ? 'powerFirst' : i === 2 ? 'powerSecond' : 'powerThird';
          const delayKey = i === 1 ? 'delayFirst' : i === 2 ? 'delaySecond' : 'delayThird';
          
          columns.push({
            id: powerKey,
            label: `Power ${i}`,
            format: (value) => DEVICE_CONFIGS.T3_SWITCH.helpers.getPowerStateText(value)
          });
          
          columns.push({
            id: delayKey,
            label: `Delay ${i}`,
            format: (value) => DEVICE_CONFIGS.T3_SWITCH.helpers.getDelayMinutes(value)
          });
        }
        
        return (
          <div key={deviceType} style={{ marginBottom: '20px' }}>
            <BasicTable
              title={`${buttonCount}-Button T3 Switch`}
              icon={switchIcon}
              devices={typeDevices}
              columns={columns}
              nameColumnWidth="20%"
            />
          </div>
        );
      })}
    </>
  );
};

export default T3_SWITCHType; 