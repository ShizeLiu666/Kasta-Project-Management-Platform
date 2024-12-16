// src/components/Network/NetworkDetails/Devices/Tables/RGB_CW/RGB_CW.js
import React from 'react';
import BasicTable from '../BasicTable';
// import rgbcwIcon from '../../../../../../assets/icons/DeviceType/RGB_CW.png';

const RGB_CWType = ({ devices }) => {
  const columns = [
    { 
      id: 'level', 
      label: 'Brightness',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}%`;
      }
    },
    { 
      id: 'colorTemperature', 
      label: 'Color Temp',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}K`;
      }
    },
    { 
      id: 'red', 
      label: 'Red',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return value;
      }
    },
    { 
      id: 'green', 
      label: 'Green',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return value;
      }
    },
    { 
      id: 'blue', 
      label: 'Blue',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return value;
      }
    },
    { 
      id: 'blinkSpeed', 
      label: 'Blink Speed',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return value;
      }
    }
  ];

  return (
    <BasicTable
      title="RGB CW"
    //   icon={rgbcwIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="25%"  // 其他6列平均分配75%
    />
  );
};

export default RGB_CWType;