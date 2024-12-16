// src/components/Network/NetworkDetails/Devices/Tables/FAN/FAN.js
import React from 'react';
import BasicTable from '../BasicTable';
import fanIcon from '../../../../../../assets/icons/DeviceType/FAN.png';

const FanType = ({ devices }) => {
  const columns = [
    {
      id: 'isHaveFanLight',
      label: 'Has Light',
      format: (value) => {
        if (value === 1) return 'Yes';
        if (value === 0) return 'No';
        return '-';
      }
    },
    {
      id: 'fanLightState',
      label: 'Light Status',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    {
      id: 'fanState',
      label: 'Fan Status',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    {
      id: 'isConfigFanLight',
      label: 'Light Configured',
      format: (value) => {
        if (value === 1) return 'Yes';
        if (value === 0) return 'No';
        return '-';
      }
    }
  ];

  return (
    <BasicTable
      title="Fan"
      icon={fanIcon}
      devices={devices}
      columns={columns}
    />
  );
};

export default FanType;