import React from 'react';
import BasicTable from '../BasicTable';
import dimmerIcon from '../../../../../../assets/icons/DeviceType/DIMMER.png';

const DimmerType = ({ devices }) => {
  // 只需定义额外的列配置，name列会由BasicTable处理
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
    />
  );
};

export default DimmerType;
