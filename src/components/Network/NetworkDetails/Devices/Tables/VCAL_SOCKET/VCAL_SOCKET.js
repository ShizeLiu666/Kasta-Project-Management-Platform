import React from 'react';
import BasicTable from '../BasicTable';
import vcalSocketIcon from '../../../../../../assets/icons/DeviceType/VCAL_SOCKET.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

const VCAL_SOCKETType = ({ devices }) => {
  const columns = [
    {
      id: 'power',
      label: 'Power',
      format: (value) => DEVICE_CONFIGS.VCAL_SOCKET.helpers.getPowerStateText(value)
    },
    {
      id: 'lockStatus',
      label: 'Lock Status',
      format: (value) => DEVICE_CONFIGS.VCAL_SOCKET.helpers.getLockStatusText(value)
    },
    {
      id: 'backLight',
      label: 'Back Light',
      format: (value) => DEVICE_CONFIGS.VCAL_SOCKET.helpers.getBackLightText(value)
    },
    {
      id: 'delay',
      label: 'Delay',
      format: (value) => DEVICE_CONFIGS.VCAL_SOCKET.helpers.getDelayMinutes(value)
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