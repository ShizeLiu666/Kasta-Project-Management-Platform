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
        switch (Number(value)) {
          case 0: return 'Close';
          case 1: return 'Low';
          case 2: return 'Medium';
          case 3: return 'High';
          default: return '-';
        }
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
    },
    {
      id: 'delay',
      label: 'Delay',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value} min`;
      }
    }
  ];

  return (
    <BasicTable
      title="Fan"
      icon={fanIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="25%"  // 由于有5列，给名称列分配较少空间
    />
  );
};

export default FanType;