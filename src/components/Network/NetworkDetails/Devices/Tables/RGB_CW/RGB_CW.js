// src/components/Network/NetworkDetails/Devices/Tables/RGB_CW/RGB_CW.js
import React from 'react';
import { Box, Chip, useMediaQuery, useTheme, Tooltip, Typography } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SpeedIcon from '@mui/icons-material/Speed';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaletteIcon from '@mui/icons-material/Palette';
import BasicTable from '../BasicTable';
import rgbcwIcon from '../../../../../../assets/icons/DeviceType/RGB_CW.png';

const RGB_CWType = ({ devices }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isTinyScreen = useMediaQuery('(max-width:350px)');

  // 根据屏幕尺寸判断某列是否显示
  const shouldShowColumn = (columnId) => {
    if (isTinyScreen) {
      // 在极小屏幕上只显示最重要的列
      return ['power', 'level', 'colorTemperature', 'rgb'].includes(columnId);
    }
    
    if (isMobileScreen) {
      // 在移动设备上隐藏delay列
      return columnId !== 'delay';
    }
    
    return true; // 默认显示所有列
  };

  const getChipBaseStyles = (color) => ({
    backgroundColor: `${color}20`,
    color: color,
    fontWeight: 500,
    '& .MuiChip-icon': { color: color },
    height: '28px',
    minWidth: isTinyScreen ? '60px' : isSmallScreen ? '70px' : '80px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '& .MuiChip-label': {
      padding: isTinyScreen ? '0 2px' : isSmallScreen ? '0 4px' : '0 8px',
      fontSize: isTinyScreen ? '0.7rem' : '0.8125rem'
    }
  });

  const getRgbChipStyles = (color) => ({
    backgroundColor: `${color}20`,
    color: color,
    fontWeight: 500,
    minWidth: isTinyScreen ? '28px' : '32px',
    height: '24px',
    '& .MuiChip-label': {
      padding: '0 4px',
      fontSize: isTinyScreen ? '0.65rem' : '0.75rem'
    }
  });

  // 渲染RGB值的通用方法
  const renderRgbValues = (red, green, blue) => {
    // 极小屏幕上展示为一个带有颜色预览的芯片
    if (isTinyScreen) {
      const rgbColor = `rgb(${red || 0}, ${green || 0}, ${blue || 0})`;
      return (
        <Tooltip title={`R:${red} G:${green} B:${blue}`} arrow>
          <Chip
            icon={<PaletteIcon />}
            size="small"
            sx={{
              ...getChipBaseStyles('#5c6bc0'),
              '&::after': {
                content: '""',
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: rgbColor,
                marginLeft: '4px',
                marginRight: '2px',
                border: '1px solid rgba(0,0,0,0.1)'
              }
            }}
            label="RGB"
          />
        </Tooltip>
      );
    }

    // 普通或小屏幕上显示三个值芯片
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isSmallScreen ? 0.5 : 1,
          flexWrap: 'nowrap',
          justifyContent: 'flex-start',
          '& > *': {
            flexShrink: 0
          }
        }}
      >
        <Chip 
          label={red}
          size="small"
          sx={getRgbChipStyles('#f44336')}
        />
        <Chip 
          label={green}
          size="small"
          sx={getRgbChipStyles('#4caf50')}
        />
        <Chip 
          label={blue}
          size="small"
          sx={getRgbChipStyles('#2196f3')}
        />
      </Box>
    );
  };

  // 过滤并生成列配置
  const allColumns = [
    {
      id: 'power',
      label: 'Power',
      width: isMobileScreen ? '20%' : '12%',
      format: (value) => {
        const isOn = value === 1;
        const color = value === undefined ? '#9e9e9e' : (isOn ? '#4caf50' : '#f44336');
        return (
          <Chip 
            icon={isTinyScreen ? null : <PowerSettingsNewIcon />}
            label={value === undefined ? '-' : (isOn ? 'ON' : 'OFF')}
            size="small"
            sx={getChipBaseStyles(color)}
          />
        );
      }
    },
    {
      id: 'level',
      label: 'Level',
      width: isMobileScreen ? '20%' : '12%',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        const percentage = Math.round((value / 255) * 100);
        return (
          <Chip 
            icon={isTinyScreen ? null : <BrightnessLowIcon />}
            label={`${percentage}%`}
            size="small"
            sx={getChipBaseStyles('#fbcd0b')}
          />
        );
      }
    },
    { 
      id: 'colorTemperature', 
      label: isTinyScreen ? 'CCT' : isMobileScreen ? 'Temp' : 'Color Temp',
      width: isMobileScreen ? '20%' : '12%',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return (
          <Chip 
            icon={isTinyScreen ? null : <ThermostatIcon />}
            label={`${value}K`}
            size="small"
            sx={getChipBaseStyles('#ff9800')}
          />
        );
      }
    },
    {
      id: 'isRgb',
      label: 'Mode',
      width: '14%', 
      format: (value) => {
        const isRgb = value === 1;
        // 根据屏幕大小调整显示内容
        let label = value === undefined ? '-' : (isRgb ? 'RGB' : (isSmallScreen ? 'CCT' : 'Color Temperature'));
        
        return (
          <Chip 
            icon={isTinyScreen ? null : <SettingsIcon />}
            label={label}
            size="small"
            sx={getChipBaseStyles('#1976d1')}
          />
        );
      }
    },
    { 
      id: 'rgb', 
      label: 'RGB',
      width: isMobileScreen ? '40%' : '20%', 
      format: (_, device) => {
        const red = device.specificAttributes?.red;
        const green = device.specificAttributes?.green;
        const blue = device.specificAttributes?.blue;
        
        if (red === undefined || green === undefined || blue === undefined) {
          return '-';
        }
        
        return renderRgbValues(red, green, blue);
      }
    },
    { 
      id: 'blinkSpeed', 
      label: isTinyScreen ? 'Blink' : isMobileScreen ? 'Blink' : 'Blink Speed',
      width: '14%', 
      format: (value) => {
        let label;
        switch (Number(value)) {
          case -1: label = 'None'; break;
          case 0: label = 'Slow'; break;
          case 1: label = 'Med'; break; // 缩短Medium为Med以节省空间
          case 2: label = 'Fast'; break;
          default: label = '-';
        }
        return (
          <Chip 
            icon={isTinyScreen ? null : <SpeedIcon />}
            label={label}
            size="small"
            sx={getChipBaseStyles('#9c27b0')}
          />
        );
      }
    },
    { 
      id: 'delay', 
      label: 'Delay',
      width: '14%', 
      format: (value) => {
        if (value === undefined || value === null) {
          return (
            <Chip 
              icon={isTinyScreen ? null : <AccessTimeIcon />}
              label="-"
              size="small"
              sx={getChipBaseStyles('#718096')}
            />
          );
        }
        return (
          <Chip 
            icon={isTinyScreen ? null : <AccessTimeIcon />}
            label={`${value} min`}
            size="small"
            sx={getChipBaseStyles('#718096')}
          />
        );
      }
    }
  ];

  // 过滤列，只保留应该显示的列
  const columns = allColumns.filter(column => shouldShowColumn(column.id));

  // 添加滚动提示信息
  const tableFooter = isMobileScreen ? (
    <Box 
      sx={{ 
        textAlign: 'center', 
        py: 1, 
        borderTop: '1px solid rgba(224, 224, 224, 0.4)',
        color: 'text.secondary',
        fontSize: '0.75rem'
      }}
    >
      <Typography variant="caption">
        {isTinyScreen ? 'Scroll horizontally to see more' : 'Swipe left/right to see all columns'}
      </Typography>
    </Box>
  ) : null;

  return (
    <BasicTable
      title="RGB CW"
      icon={rgbcwIcon}
      devices={devices}
      columns={columns}
      formatWithDevice={true}
      nameColumnWidth={isMobileScreen ? "30%" : "20%"}
      enhancedDisplay={false}
      footer={tableFooter}
    />
  );
};

export default RGB_CWType;