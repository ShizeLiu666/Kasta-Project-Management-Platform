// src/components/Network/NetworkDetails/Devices/Tables/DIMMER/DIMMER.js
import React from 'react';
import BasicTable from '../BasicTable';
import dimmerIcon from '../../../../../../assets/icons/DeviceType/DIMMER.png';

const DimmerType = ({ devices }) => {
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
      title="Dimmer"
      icon={dimmerIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="30%"
    />
  );
};

export default DimmerType;