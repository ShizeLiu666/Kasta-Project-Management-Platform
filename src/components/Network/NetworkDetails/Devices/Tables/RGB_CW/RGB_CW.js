// src/components/Network/NetworkDetails/Devices/Tables/RGB_CW/RGB_CW.js
import React from 'react';
import BasicTable from '../BasicTable';
// import rgbcwIcon from '../../../../../../assets/icons/DeviceType/RGB_CW.png';

const RGB_CWType = ({ devices }) => {
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
      id: 'level', 
      label: 'Brightness',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${Math.round((value / 255) * 100)}%`;
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
        switch (value) {
          case -1: return 'None';
          case 0: return 'Slow';
          case 1: return 'Medium';
          case 2: return 'Fast';
          default: return '-';
        }
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