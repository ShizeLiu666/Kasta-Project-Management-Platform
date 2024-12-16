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
        const modes = {
          0: 'Auto',
          1: 'Cool',
          2: 'Heat',
          3: 'Fan'
        };
        return modes[value] || '-';
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
        const speeds = {
          0: 'Auto',
          1: 'Low',
          2: 'Medium',
          3: 'High'
        };
        return speeds[value] || '-';
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