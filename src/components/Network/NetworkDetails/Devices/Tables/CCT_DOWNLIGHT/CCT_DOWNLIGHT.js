// src/components/Network/NetworkDetails/Devices/Tables/CCT_DOWNLIGHT/CCT_DOWNLIGHT.js
import React from 'react';
import { Chip } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import BasicTable from '../BasicTable';
import cctDownlightIcon from '../../../../../../assets/icons/DeviceType/CCT_DOWNLIGHT.png';

const CCT_DOWNLIGHTType = ({ devices }) => {
  // 获取电源状态的颜色
  const getPowerColor = (value) => {
    if (value === 1) return '#4caf50'; // 绿色表示开启
    if (value === 0) return '#f44336'; // 红色表示关闭
    return '#9e9e9e'; // 灰色表示未知
  };

  const columns = [
    {
      id: 'power',
      label: 'Power',
      format: (value) => {
        const isOn = value === 1;
        const label = isOn ? 'ON' : 'OFF';
        const color = getPowerColor(value);
        
        return (
          <Chip 
            icon={<PowerSettingsNewIcon />}
            label={label}
            size="small"
            sx={{ 
              backgroundColor: `${color}20`, // 使用透明度
              color: color,
              fontWeight: 500,
              '& .MuiChip-icon': { color: color }
            }}
          />
        );
      }
    },
    {
      id: 'level',
      label: 'Brightness',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        const percentage = Math.round((value / 255) * 100);
        
        return (
          <Chip 
            icon={<BrightnessLowIcon />}
            label={`${percentage}%`}
            size="small"
            sx={{ 
              backgroundColor: 'rgba(251, 205, 11, 0.1)', // 半透明的主题色背景
              color: '#fbcd0b', // 主题色
              fontWeight: 500,
              '& .MuiChip-icon': { color: '#fbcd0b' } // 图标也使用主题色
            }}
          />
        );
      }
    },
    {
      id: 'colorTemperature',
      label: 'Color Temp',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        
        return (
          <Chip 
            icon={<ThermostatIcon />}
            label={`${value}K`}
            size="small"
            sx={{ 
              backgroundColor: '#fff8e1', 
              color: '#ff9800',
              fontWeight: 500,
              '& .MuiChip-icon': { color: '#ff9800' }
            }}
          />
        );
      }
    },
    {
      id: 'delay',
      label: 'Delay',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        
        return (
          <Chip 
            icon={<AccessTimeIcon />}
            label={`${value} min`}
            size="small"
            sx={{ 
              backgroundColor: '#edf2f7', 
              fontWeight: 500,
              '& .MuiChip-icon': { color: '#718096' }
            }}
          />
        );
      }
    }
  ];

  return (
    <BasicTable
      title="CCT Downlight"
      icon={cctDownlightIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="30%"  // 其他3列平均分配70%
      enhancedDisplay={false} // 关闭自动增强显示，使用我们自定义的format函数
    />
  );
};

export default CCT_DOWNLIGHTType;