// src/components/Network/NetworkDetails/Devices/Tables/CCT_DOWNLIGHT/CCT_DOWNLIGHT.js
import React from 'react';
import BasicTable from '../BasicTable';
import cctDownlightIcon from '../../../../../../assets/icons/DeviceType/CCT_DOWNLIGHT.png';

const CCT_DOWNLIGHTType = ({ devices }) => {
  const columns = [
    {
      id: 'level',
      label: 'Level',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}%`;
      }
    },
    {
      id: 'colorTemperature',
      label: 'Color Temp',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}K`;
      }
    }
  ];

  return (
    <BasicTable
      title="CCT Downlight"
      icon={cctDownlightIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="40%"  // 其他2列平均分配60%
    />
  );
};

export default CCT_DOWNLIGHTType;