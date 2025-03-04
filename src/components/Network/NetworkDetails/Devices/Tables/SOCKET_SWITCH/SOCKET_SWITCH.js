import React from 'react';
import BasicTable from '../BasicTable';
import SOCKET_SWITCHIcon from '../../../../../../assets/icons/DeviceType/SOCKET_SWITCH.png';

const SWITCHType = ({ devices }) => {
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
      title="Socket Switch"
      icon={SOCKET_SWITCHIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="40%"  // 由于只有2列，给名称列分配较多空间
    />
  );
};

export default SWITCHType; 