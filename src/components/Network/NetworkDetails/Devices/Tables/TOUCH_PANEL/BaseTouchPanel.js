import React from 'react';
import BasicTable from '../BasicTable';
import { Chip, Tooltip } from '@mui/material';

const BaseTouchPanel = ({ 
  devices, 
  title, 
  icon,
  buttonCount = 1,  // 按键数量
  hasBacklight = true,  // 是否支持背光
  extraColumns = []  // 额外的列配置
}) => {
  const baseColumns = [
    {
      id: 'orientation',
      label: 'Orientation',
      format: (attrs) => attrs?.isHorizontal ? 'Horizontal' : 'Vertical'
    },
    {
      id: 'backlight',
      label: 'Backlight',
      format: (attrs) => {
        if (!hasBacklight) return 'N/A';
        const enabled = attrs?.backLightEnabled;
        const color = attrs?.blColorId || 0;
        return enabled ? `On (Color: ${color})` : 'Off';
      }
    },
    {
      id: 'activeButton',
      label: 'Active Button',
      format: (attrs) => {
        const idx = attrs?.activeButtonIdx || 0;
        return idx > buttonCount ? '-' : `Button ${idx}`;
      }
    },
    {
      id: 'bindings',
      label: 'Bindings',
      format: (attrs) => {
        const bindings = attrs?.remoteBind || [];
        return (
          <Tooltip 
            title={
              bindings.length ? 
                bindings.map(b => `
                  Hole: ${b.hole}
                  Channel: ${b.bind_channel}
                  Timer: ${b.has_timer ? `${b.hour}:${b.min}` : 'No'}
                  State: ${b.state}
                  Enabled: ${b.enable ? 'Yes' : 'No'}
                `).join('\n')
                : 'No bindings'
            }
          >
            <Chip 
              label={`${bindings.length} binding(s)`}
              color={bindings.length ? 'primary' : 'default'}
              size="small"
            />
          </Tooltip>
        );
      }
    },
    ...extraColumns
  ];

  return (
    <BasicTable
      title={title}
      icon={icon}
      devices={devices}
      columns={baseColumns}
      nameColumnWidth="25%"
    />
  );
};

export default BaseTouchPanel; 