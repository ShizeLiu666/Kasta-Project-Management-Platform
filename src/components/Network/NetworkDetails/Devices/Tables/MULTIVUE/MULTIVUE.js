import React from 'react';
import BasicTable from '../BasicTable';
import multivueIcon from '../../../../../../assets/icons/DeviceType/MULTIVUE.png';

const MULTIVUEType = ({ devices }) => {
  // 将参数分组
  const columns = [
    // 显示设置组
    {
      id: 'display',
      label: 'Display',
      format: (attrs) => {
        if (!attrs) return '-';
        const brightness = attrs.scBrightness || 0;
        const sleepTimer = attrs.sleepTimer || 'Off';
        return `${brightness}% / ${sleepTimer}`;
      }
    },
    // 格式设置组
    {
      id: 'formats',
      label: 'Formats',
      format: (attrs) => {
        if (!attrs) return '-';
        const date = attrs.dateFormat || '-';
        const time = attrs.timeFormat || '-';
        return `${date} / ${time}`;
      }
    },
    // 按钮设置组
    {
      id: 'buttons',
      label: 'Button Settings',
      format: (attrs) => {
        if (!attrs) return '-';
        const brightness = attrs.btnBrightness || 0;
        const beep = attrs.btnBeep ? 'On' : 'Off';
        return `${brightness}% / Beep: ${beep}`;
      }
    },
    // 系统设置组
    {
      id: 'system',
      label: 'System',
      format: (attrs) => {
        if (!attrs) return '-';
        const language = attrs.language || '-';
        const gesture = attrs.gestureSensitivity || 'Normal';
        return `${language} / ${gesture}`;
      }
    }
  ];

  // 创建详细信息的工具提示内容
  const getTooltipContent = (device) => {
    const attrs = device?.specificAttributes || {};
    return {
      display: `Screen Brightness: ${attrs.scBrightness}%
                Sleep Timer: ${attrs.sleepTimer}
                Screen Close Timer: ${attrs.scCloseTimer}`,
      formats: `Date Format: ${attrs.dateFormat}
                Day Format: ${attrs.dayFormat}
                Time Format: ${attrs.timeFormat}
                Temperature Format: ${attrs.tempFormat}`,
      buttons: `Button Color: RGB(${attrs.btnRed},${attrs.btnGreen},${attrs.btnBlue})
                Button Brightness: ${attrs.btnBrightness}%
                Button Beep: ${attrs.btnBeep ? 'On' : 'Off'}`,
      system: `Language: ${attrs.language}
               Wake Up Motion: ${attrs.wakeUpMotion ? 'On' : 'Off'}
               Gesture Sensitivity: ${attrs.gestureSensitivity}
               Font Version: ${attrs.fontVersion}
               Icon Version: ${attrs.iconVersion}`
    };
  };

  return (
    <BasicTable
      title="MultiVue Displays"
      icon={multivueIcon}
      devices={devices}
      columns={columns}
      nameColumnWidth="25%"
      tooltipContent={getTooltipContent}
    />
  );
};

export default MULTIVUEType; 