import React from 'react';
import BasicTable from '../BasicTable';
import vcalSocketIcon from '../../../../../../assets/icons/DeviceType/VCAL_SOCKET.png';

const VCAL_SOCKETType = ({ devices }) => {
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
      id: 'lockStatus',
      label: 'Lock Status',
      format: (value) => {
        if (value === 1) return 'Locked';
        if (value === 0) return 'Unlocked';
        return '-';
      }
    },
    {
      id: 'backLight',
      label: 'Back Light',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
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
      title="VCAL Socket"
      icon={vcalSocketIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="30%"
    />
  );
};

export default VCAL_SOCKETType; 