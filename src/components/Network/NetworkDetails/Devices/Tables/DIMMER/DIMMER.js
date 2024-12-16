// src/components/Network/NetworkDetails/Devices/Tables/DIMMER/DIMMER.js
import React from 'react';
import BasicTable from '../BasicTable';
import dimmerIcon from '../../../../../../assets/icons/DeviceType/DIMMER.png';

const DimmerType = ({ devices }) => {
  const columns = [
    {
      id: 'level',
      label: 'Dimming Level',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}%`;
      }
    }
  ];

  return (
    <BasicTable
      title="Dimmer"
      icon={dimmerIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="50%"  // 只有一列额外数据，所以name列可以占50%
    />
  );
};

export default DimmerType;