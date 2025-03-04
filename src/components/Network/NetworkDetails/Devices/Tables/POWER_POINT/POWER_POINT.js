// src/components/Network/NetworkDetails/Devices/Tables/PPT/PPT.js
import React from 'react';
import BasicTable from '../BasicTable';
import pptIcon from '../../../../../../assets/icons/DeviceType/POWER_POINT.png';

const POWER_POINTType = ({ devices }) => {
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
      id: 'leftName',
      label: 'Left Name',
      format: (value) => value || '-'
    },
    {
      id: 'leftPower',
      label: 'Left Power',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    {
      id: 'rightName',
      label: 'Right Name',
      format: (value) => value || '-'
    },
    {
      id: 'rightPower',
      label: 'Right Power',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    {
      id: 'leftLock',
      label: 'Left Lock',
      format: (value) => {
        if (value === 1) return 'Locked';
        if (value === 0) return 'Unlocked';
        return '-';
      }
    },
    {
      id: 'rightLock',
      label: 'Right Lock',
      format: (value) => {
        if (value === 1) return 'Locked';
        if (value === 0) return 'Unlocked';
        return '-';
      }
    },
    {
      id: 'leftDelay',
      label: 'Left Delay',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}min`;
      }
    },
    {
      id: 'rightDelay',
      label: 'Right Delay',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}min`;
      }
    },
    {
      id: 'leftBackLight',
      label: 'Left LED',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    {
      id: 'rightBackLight',
      label: 'Right LED',
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    }
  ];

  return (
    <BasicTable
      title="Power Point"
      icon={pptIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="20%" // 由于列较多，给name列分配较少空间
    />
  );
};

export default POWER_POINTType;