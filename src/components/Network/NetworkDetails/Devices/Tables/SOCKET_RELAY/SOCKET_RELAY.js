// src/components/Network/NetworkDetails/Devices/Tables/SOCKET_RELAY/SOCKET_RELAY.js
import React from 'react';
import BasicTable from '../BasicTable';
import socketRelayIcon from '../../../../../../assets/icons/DeviceType/SOCKET_RELAY.png';

const SOCKET_RELAYType = ({ devices }) => {
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
        return `${value}s`;
      }
    },
    {
      id: 'socketErrors',
      label: 'Errors',
      format: (value) => {
        if (!value) return 'None';
        return value;
      }
    }
  ];

  return (
    <BasicTable
      title="Socket Relay"
      icon={socketRelayIcon}
      devices={devices}
      columns={columns}
    />
  );
};

export default SOCKET_RELAYType;