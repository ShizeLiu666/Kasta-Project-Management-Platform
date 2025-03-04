// src/components/Network/NetworkDetails/Devices/Tables/THERMOSTAT/THERMOSTAT.js
import React from 'react';
import BasicTable from '../BasicTable';
import thermostatIcon from '../../../../../../assets/icons/DeviceType/THERMOSTAT.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

const THERMOSTATType = ({ devices }) => {
  const columns = [
    {
      id: 'power',
      label: 'Power',
      format: (value) => DEVICE_CONFIGS.THERMOSTAT.helpers.getPowerStateText(value)
    },
    {
      id: 'mode',
      label: 'Mode',
      format: (value) => DEVICE_CONFIGS.THERMOSTAT.helpers.getModeText(value)
    },
    {
      id: 'setTemperature',
      label: 'Set Temp',
      format: (value) => DEVICE_CONFIGS.THERMOSTAT.helpers.getTemperatureText(value)
    },
    {
      id: 'currentTemperature',
      label: 'Current Temp',
      format: (value) => DEVICE_CONFIGS.THERMOSTAT.helpers.getTemperatureText(value)
    },
    {
      id: 'fanSpeed',
      label: 'Fan Speed',
      format: (value) => DEVICE_CONFIGS.THERMOSTAT.helpers.getFanSpeedText(value)
    },
    {
      id: 'delay',
      label: 'Delay',
      format: (value) => DEVICE_CONFIGS.THERMOSTAT.helpers.getDelayMinutes(value)
    }
  ];

  return (
    <BasicTable
      title="Thermostat"
      icon={thermostatIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="20%"
    />
  );
};

export default THERMOSTATType;