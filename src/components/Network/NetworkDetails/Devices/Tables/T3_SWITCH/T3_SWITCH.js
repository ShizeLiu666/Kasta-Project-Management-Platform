import React from 'react';
import BasicTable from '../BasicTable';
import t3SwitchIcon from '../../../../../../assets/icons/DeviceType/T3_SWITCH.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

const T3_SWITCHType = ({ devices }) => {
  const columns = [
    {
      id: 'powerFirst',
      label: 'Power 1',
      format: (value) => DEVICE_CONFIGS.T3_SWITCH.helpers.getPowerStateText(value)
    },
    {
      id: 'powerSecond',
      label: 'Power 2',
      format: (value) => DEVICE_CONFIGS.T3_SWITCH.helpers.getPowerStateText(value)
    },
    {
      id: 'powerThird',
      label: 'Power 3',
      format: (value) => DEVICE_CONFIGS.T3_SWITCH.helpers.getPowerStateText(value)
    },
    {
      id: 'delayFirst',
      label: 'Delay 1',
      format: (value) => DEVICE_CONFIGS.T3_SWITCH.helpers.getDelayMinutes(value)
    },
    {
      id: 'delaySecond',
      label: 'Delay 2',
      format: (value) => DEVICE_CONFIGS.T3_SWITCH.helpers.getDelayMinutes(value)
    },
    {
      id: 'delayThird',
      label: 'Delay 3',
      format: (value) => DEVICE_CONFIGS.T3_SWITCH.helpers.getDelayMinutes(value)
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