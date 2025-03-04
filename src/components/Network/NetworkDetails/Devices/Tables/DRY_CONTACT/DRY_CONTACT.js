import React from 'react';
import BasicTable from '../BasicTable';
import dryContactIcon from '../../../../../../assets/icons/DeviceType/DRY_CONTACT.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

const DRY_CONTACTType = ({ devices }) => {
  const columns = [
    {
      id: 'power',
      label: 'Power',
      format: (value) => DEVICE_CONFIGS.DRY_CONTACT.helpers.getPowerStateText(value)
    },
    {
      id: 'dryType',
      label: 'Type',
      format: (value) => DEVICE_CONFIGS.DRY_CONTACT.helpers.getDryTypeText(value)
    },
    {
      id: 'isConfig',
      label: 'Configured',
      format: (value) => DEVICE_CONFIGS.DRY_CONTACT.helpers.getConfigStatusText(value)
    },
    {
      id: 'delay',
      label: 'Delay',
      format: (value) => DEVICE_CONFIGS.DRY_CONTACT.helpers.getDelayMinutes(value)
    }
  ];

  return (
    <BasicTable
      title="Dry Contact"
      icon={dryContactIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="30%"  // 由于有4列，给名称列分配适中空间
    />
  );
};

export default DRY_CONTACTType; 