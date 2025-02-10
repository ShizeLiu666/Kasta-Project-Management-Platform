import React from 'react';
import BasicTable from '../BasicTable';
import t3SwitchIcon from '../../../../../../assets/icons/DeviceType/T3_SWITCH.png';

const T3_SWITCHType = ({ devices }) => {
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
      title="T3 Switch"
      icon={t3SwitchIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="20%"  // 由于列较多，减少名称列宽度
    />
  );
};

export default T3_SWITCHType; 