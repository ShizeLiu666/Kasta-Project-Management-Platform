// src/components/Network/NetworkDetails/Devices/Tables/CCT_DOWNLIGHT/CCT_DOWNLIGHT.js
import React from 'react';
import BasicTable from '../BasicTable';
import cctDownlightIcon from '../../../../../../assets/icons/DeviceType/CCT_DOWNLIGHT.png';

const CCT_DOWNLIGHTType = ({ devices }) => {
  const columns = [
    {
      id: 'power',
      label: 'Power',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    {
      id: 'level',
      label: 'level',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${Math.round((value / 255) * 100)}%`;
      }
    },
    {
      id: 'colorTemperature',
      label: 'Color Temp',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return value.toString();
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
      title="CCT Downlight"
      icon={cctDownlightIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="30%"  // 其他3列平均分配70%
    />
  );
};

export default CCT_DOWNLIGHTType;