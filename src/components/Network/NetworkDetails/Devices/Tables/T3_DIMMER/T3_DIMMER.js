import React from 'react';
import BasicTable from '../BasicTable';
import t3DimmerIcon from '../../../../../../assets/icons/DeviceType/T3_DIMMER.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

const T3_DIMMERType = ({ devices }) => {
  const columns = [
    {
      id: 'powerFirst',
      label: 'Power 1',
      format: (value) => DEVICE_CONFIGS.T3_DIMMER.helpers.getPowerStateText(value)
    },
    {
      id: 'powerSecond',
      label: 'Power 2',
      format: (value) => DEVICE_CONFIGS.T3_DIMMER.helpers.getPowerStateText(value)
    },
    {
      id: 'powerThird',
      label: 'Power 3',
      format: (value) => DEVICE_CONFIGS.T3_DIMMER.helpers.getPowerStateText(value)
    },
    {
      id: 'levelFirst',
      label: 'Level 1',
      format: (value) => DEVICE_CONFIGS.T3_DIMMER.helpers.getLevelPercentage(value)
    },
    {
      id: 'levelSecond',
      label: 'Level 2',
      format: (value) => DEVICE_CONFIGS.T3_DIMMER.helpers.getLevelPercentage(value)
    },
    {
      id: 'levelThird',
      label: 'Level 3',
      format: (value) => DEVICE_CONFIGS.T3_DIMMER.helpers.getLevelPercentage(value)
    },
    {
      id: 'delayFirst',
      label: 'Delay 1',
      format: (value) => DEVICE_CONFIGS.T3_DIMMER.helpers.getDelayMinutes(value)
    },
    {
      id: 'delaySecond',
      label: 'Delay 2',
      format: (value) => DEVICE_CONFIGS.T3_DIMMER.helpers.getDelayMinutes(value)
    },
    {
      id: 'delayThird',
      label: 'Delay 3',
      format: (value) => DEVICE_CONFIGS.T3_DIMMER.helpers.getDelayMinutes(value)
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