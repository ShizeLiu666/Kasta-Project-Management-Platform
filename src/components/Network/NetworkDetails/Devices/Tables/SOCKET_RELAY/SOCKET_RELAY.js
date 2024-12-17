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
        return `${value}min`;
      }
    },
    {
      id: 'errorType',
      label: 'Error Type',
      format: (value) => {
        switch (value) {
          case 0: return 'Low Energy';
          case 1: return 'Threshold Warning';
          case 0x50: return 'Config Error';
          case 0x51: return 'Alert Enabled';
          case 0x52: return 'Alert Disabled';
          default: return '-';
        }
      }
    },
    {
      id: 'value',
      label: 'Error Value',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return value;
      }
    },
    {
      id: 'channel',
      label: 'Channel',
      format: (value) => {
        if (value === undefined || value === null) return '-';
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