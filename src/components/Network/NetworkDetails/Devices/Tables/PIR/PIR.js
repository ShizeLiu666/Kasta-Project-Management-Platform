import React from 'react';
import BasicTable from '../BasicTable';
import pirIcon from '../../../../../../assets/icons/DeviceType/PIR.png';

const PIRType = ({ devices }) => {
  const columns = [
    {
      id: 'isConfig',
      label: 'Configuration',
      format: (value) => {
        return value ? 'Configured' : 'Not Configured';
      }
    },
    {
      id: 'remoteBind',
      label: 'Remote Bind',
      format: (value) => {
        if (!value || !Array.isArray(value)) return 'No bindings';
        return `${value.length} binding${value.length > 1 ? 's' : ''}`;
      }
    }
  ];

  return (
    <BasicTable
      title="PIR Sensors"
      icon={pirIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="40%"
    />
  );
};

export default PIRType; 