import React from 'react';
import BasicTable from '../BasicTable';
import dryContactIcon from '../../../../../../assets/icons/DeviceType/DRY_CONTACT.png';

const DRY_CONTACTType = ({ devices }) => {
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
      id: 'dryType',
      label: 'Type',
      format: (value) => {
        switch (value) {
          case 0: return 'Normal Open';
          case 1: return 'Normal Close';
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
    }
  ];

  return (
    <BasicTable
      title="Dry Contact"
      icon={dryContactIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="30%"  // 由于有4列，给名称列分配适中空间
    />
  );
};

export default DRY_CONTACTType; 