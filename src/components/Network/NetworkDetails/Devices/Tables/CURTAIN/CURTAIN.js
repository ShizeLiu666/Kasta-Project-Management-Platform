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
      id: 'curtainAction',
      label: 'Action',
      format: (value) => {
        switch (value) {
          case 0: return 'Stop';
          case 1: return 'Open';
          case 2: return 'Close';
          default: return '-';
        }
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
        return `${value}min`;
      }
    },
    {
      id: 'isDirection',
      label: 'Direction',
      format: (value) => {
        if (value === 1) return 'Forward';
        if (value === 0) return 'Reverse';
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
      nameColumnWidth="25%"  // 由于有5列，给名称列分配较少空间
    />
  );
};

export default CURTAINType; 