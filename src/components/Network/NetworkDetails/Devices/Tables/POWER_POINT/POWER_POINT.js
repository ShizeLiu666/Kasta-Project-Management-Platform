// src/components/Network/NetworkDetails/Devices/Tables/POWER_POINT/POWER_POINT.js
import React from 'react';
import BasicTable from '../BasicTable';
import pptIcon from '../../../../../../assets/icons/DeviceType/POWER_POINT.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

const POWER_POINTType = ({ devices }) => {
  // 使用更紧凑的列布局
  const columns = [
    {
      id: 'power',
      label: 'Main Power',
      format: (value) => DEVICE_CONFIGS.POWER_POINT.helpers.getPowerStateText(value)
    },
    {
      id: 'leftSocket',
      label: 'Left',
      format: (_, device) => (
        <div style={{ fontSize: '0.9em' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{device.leftName || '-'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div>Power: {DEVICE_CONFIGS.POWER_POINT.helpers.getPowerStateText(device.leftPower)}</div>
            <div>Lock: {DEVICE_CONFIGS.POWER_POINT.helpers.getLockStateText(device.leftLock)}</div>
            <div>Delay: {DEVICE_CONFIGS.POWER_POINT.helpers.getDelayMinutes(device.leftDelay)}</div>
            <div>LED: {DEVICE_CONFIGS.POWER_POINT.helpers.getBackLightLevel(device.leftBackLight)}</div>
          </div>
        </div>
      )
    },
    {
      id: 'rightSocket',
      label: 'Right',
      format: (_, device) => (
        <div style={{ fontSize: '0.9em' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{device.rightName || '-'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div>Power: {DEVICE_CONFIGS.POWER_POINT.helpers.getPowerStateText(device.rightPower)}</div>
            <div>Lock: {DEVICE_CONFIGS.POWER_POINT.helpers.getLockStateText(device.rightLock)}</div>
            <div>Delay: {DEVICE_CONFIGS.POWER_POINT.helpers.getDelayMinutes(device.rightDelay)}</div>
            <div>LED: {DEVICE_CONFIGS.POWER_POINT.helpers.getBackLightLevel(device.rightBackLight)}</div>
          </div>
        </div>
      )
    }
  ];

  return (
    <BasicTable
      title="Power Point"
      icon={pptIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="20%"
    />
  );
};

export default POWER_POINTType;