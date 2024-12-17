// src/components/Network/NetworkDetails/Devices/Tables/THERMOSTAT/THERMOSTAT.js
import React from 'react';
import BasicTable from '../BasicTable';
import thermostatIcon from '../../../../../../assets/icons/DeviceType/THERMOSTAT.png';

const THERMOSTATType = ({ devices }) => {
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
      id: 'mode',
      label: 'Mode',
      format: (value) => {
        switch (value) {
          case 0: return 'Auto';
          case 1: return 'Cool';
          case 2: return 'Heat';
          case 3: return 'Fan';
          default: return '-';
        }
      }
    },
    {
      id: 'setTemperature',
      label: 'Set Temp',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}°C`;
      }
    },
    {
      id: 'currentTemperature',
      label: 'Current Temp',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}°C`;
      }
    },
    {
      id: 'fanSpeed',
      label: 'Fan Speed',
      format: (value) => {
        switch (value) {
          case 0: return 'Auto';
          case 1: return 'Slow';
          case 2: return 'Medium';
          case 3: return 'Fast';
          default: return '-';
        }
      }
    }
  ];

  return (
    <BasicTable
      title="Thermostat"
      icon={thermostatIcon}
      devices={devices}
      columns={columns}
    />
  );
};

export default THERMOSTATType;