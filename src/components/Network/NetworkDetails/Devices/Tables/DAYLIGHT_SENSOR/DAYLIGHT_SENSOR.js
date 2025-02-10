import React from 'react';
import BasicTable from '../BasicTable';
import daylightSensorIcon from '../../../../../../assets/icons/DeviceType/DAYLIGHT_SENSOR.png';

const DAYLIGHT_SENSORType = ({ devices }) => {
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
      id: 'sensorBindID',
      label: 'Sensor Bind ID',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return value;
      }
    }
  ];

  return (
    <BasicTable
      title="Daylight Sensor"
      icon={daylightSensorIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="40%"  // 由于只有2列，给名称列分配较多空间
    />
  );
};

export default DAYLIGHT_SENSORType; 