import React from 'react';
import BasicTable from '../BasicTable';
import t3DimmerIcon from '../../../../../../assets/icons/DeviceType/T3_DIMMER.png';

const T3_DIMMERType = ({ devices }) => {
  const columns = [
    {
      id: 'powerFirst',
      label: 'Power 1',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    {
      id: 'powerSecond',
      label: 'Power 2',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    {
      id: 'powerThird',
      label: 'Power 3',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    {
      id: 'levelFirst',
      label: 'Level 1',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${Math.round((value / 255) * 100)}%`;
      }
    },
    {
      id: 'levelSecond',
      label: 'Level 2',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${Math.round((value / 255) * 100)}%`;
      }
    },
    {
      id: 'levelThird',
      label: 'Level 3',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${Math.round((value / 255) * 100)}%`;
      }
    },
    {
      id: 'delayFirst',
      label: 'Delay 1',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}min`;
      }
    },
    {
      id: 'delaySecond',
      label: 'Delay 2',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}min`;
      }
    },
    {
      id: 'delayThird',
      label: 'Delay 3',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}min`;
      }
    }
  ];

  return (
    <BasicTable
      title="T3 Dimmer"
      icon={t3DimmerIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="15%"  // 由于列非常多，进一步减少名称列宽度
    />
  );
};

export default T3_DIMMERType; 