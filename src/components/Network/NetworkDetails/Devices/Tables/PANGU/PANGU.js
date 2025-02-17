import React from 'react';
import BasicTable from '../BasicTable';
import panguIcon from '../../../../../../assets/icons/DeviceType/PANGU.png';

const PANGUType = ({ devices }) => {
  const columns = [
    {
      id: 'connectState',
      label: 'Connection',
      format: (value) => {
        switch (value) {
          case 0: return 'Disconnected';
          case 1: return 'Connected';
          case 2: return 'Connecting';
          default: return '-';
        }
      }
    },
    {
      id: 'subDevices',
      label: 'Sub Devices',
      format: (value) => {
        if (!value || !Array.isArray(value)) return 'No devices';
        return `${value.length} device${value.length > 1 ? 's' : ''}`;
      }
    }
  ];

  return (
    <BasicTable
      title="PanGu"
      icon={panguIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="40%"  // 由于只有2列，给名称列分配较多空间
    />
  );
};

export default PANGUType; 