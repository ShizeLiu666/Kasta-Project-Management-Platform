import React from 'react';
import BasicTable from '../BasicTable';
import curtainIcon from '../../../../../../assets/icons/DeviceType/CURTAIN.png';

const CURTAINType = ({ devices }) => {
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
      id: 'isConfig',
      label: 'Configured',
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
    },
    {
      id: 'isDirection',
      label: 'Direction',
      format: (value) => {
        if (value === 0) return 'Forward';
        if (value === 1) return 'Reverse';
        return '-';
      }
    }
  ];

  return (
    <BasicTable
      title="Curtain"
      icon={curtainIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="30%"  // 由于现在只有4列，调整名称列宽度
    />
  );
};

export default CURTAINType; 