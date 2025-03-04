import React from 'react';
import BasicTable from '../BasicTable';
import daylightSensorIcon from '../../../../../../assets/icons/DeviceType/DAYLIGHT_SENSOR.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

const DAYLIGHT_SENSORType = ({ devices }) => {
  const columns = [
    {
      id: 'power',
      label: 'Power',
      format: (value) => DEVICE_CONFIGS.DAYLIGHT_SENSOR.helpers.getPowerStateText(value)
    },
    {
      id: 'sensorBindID',
      label: 'Sensor Bind ID',
      format: (value) => DEVICE_CONFIGS.DAYLIGHT_SENSOR.helpers.getSensorBindIDText(value)
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