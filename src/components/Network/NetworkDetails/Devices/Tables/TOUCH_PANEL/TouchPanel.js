import React, { useState } from 'react';
import BasicTable from '../BasicTable';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography 
} from '@mui/material';

// 解析设备类型信息
const parseDeviceType = (deviceType) => {
  // 特殊面板处理
  if (deviceType === 'CW_PANEL') return { buttonCount: 2, type: 'CCT Panel', hasBacklight: true };
  if (deviceType === 'RGB_PANEL') return { buttonCount: 3, type: 'RGB Panel', hasBacklight: true };
  if (deviceType === 'RGBCW_PANEL') return { buttonCount: 4, type: 'RGBCW Panel', hasBacklight: true };

  // 提取按键数量和类型
  let buttonCount = 0;
  let type = '';
  let hasBacklight = true;

  // 标准面板 (BWS)
  if (deviceType.includes('BWS')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'Standard Panel';
  }
  // T3 版本 (KT*RSB)
  else if (deviceType.startsWith('KT') && deviceType.includes('RSB')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    if (deviceType.includes('_SWITCH')) {
      type = 'T3 Switch Panel';
    } else if (deviceType.includes('_DIMMER')) {
      type = 'T3 Dimmer Panel';
    } else {
      type = 'T3 Panel';
    }
  }
  // D8 版本 (KD*RSB)
  else if (deviceType.startsWith('KD') && deviceType.includes('RSB')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'D8 Panel';
  }
  // Edgy 版本 (EDGY*RB)
  else if (deviceType.startsWith('EDGY')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'Edgy Panel';
  }
  // Integral 版本 (INTEGRAL*RB)
  else if (deviceType.startsWith('INTEGRAL')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'Integral Panel';
  }
  // Hesperus 版本 (HESPERUS*CSB)
  else if (deviceType.startsWith('HESPERUS')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'Hesperus Panel';
    hasBacklight = false;
  }
  // P 版本 (KD*RS)
  else if (deviceType.startsWith('KD') && deviceType.endsWith('RS')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'P Panel';
  }
  // P 版本开关和调光器 (KD*TS_*)
  else if (deviceType.startsWith('KD') && deviceType.includes('TS_')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    if (deviceType.includes('_SWITCH')) {
      type = 'P Switch Panel';
    } else if (deviceType.includes('_DIMMER')) {
      type = 'P Dimmer Panel';
    }
  }
  // Co base 版本 (HS*RSCB)
  else if (deviceType.startsWith('HS') && deviceType.includes('RSCB')) {
    buttonCount = parseInt(deviceType.match(/\d/)?.[0]) || 0;
    type = 'Co Base Panel';
  }

  return { buttonCount, type, hasBacklight };
};

// 动态导入图标
const getPanelIcon = (buttonCount) => {
  try {
    return require(`../../../../../../assets/icons/DeviceType/TOUCH_PANEL_${buttonCount}.png`);
  } catch (error) {
    console.warn(`Icon not found for ${buttonCount}-button panel, using default`);
    // 如果找不到对应的图标，可以返回一个默认图标
    return require('../../../../../../assets/icons/DeviceType/TOUCH_PANEL_1.png');
  }
};

const ButtonBindingDialog = ({ open, onClose, bindings, buttonIndex }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Button {buttonIndex} Bindings
      </DialogTitle>
      <DialogContent>
        {bindings.length > 0 ? (
          <List>
            {bindings.map((binding, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`Binding ${index + 1}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" display="block">
                          Channel: {binding.bind_channel ? 'Right' : 'Left'}
                        </Typography>
                        {binding.has_timer && (
                          <Typography component="span" variant="body2" display="block">
                            Timer: {binding.hour}:{binding.min.toString().padStart(2, '0')}
                          </Typography>
                        )}
                        <Typography component="span" variant="body2" display="block">
                          State: {binding.state ? 'ON' : 'OFF'}
                        </Typography>
                        <Typography component="span" variant="body2" display="block">
                          Status: {binding.enable ? 'Enabled' : 'Disabled'}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < bindings.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary">
            No bindings for this button
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TouchPanel = ({ devices }) => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBindings, setSelectedBindings] = useState([]);

  if (!devices || devices.length === 0) return null;
  
  const { buttonCount } = parseDeviceType(devices[0].deviceType);
  
  // 获取对应按键数量的图标
  const panelIcon = getPanelIcon(buttonCount);

  const handleButtonClick = (bindings, buttonIndex) => {
    setSelectedButton(buttonIndex);
    setSelectedBindings(bindings);
    setDialogOpen(true);
  };

  // 根据按键数量生成按键状态列
  const buttonColumns = Array.from({ length: buttonCount }, (_, index) => ({
    id: `button${index + 1}`,
    label: `Button ${index + 1}`,
    format: (attrs) => {
      const bindings = attrs?.remoteBind?.filter(b => b.hole === index + 1) || [];
      const isActive = attrs?.activeButtonIdx === index + 1;
      
      return (
        <Button
          variant={isActive ? "contained" : "outlined"}
          size="small"
          color={bindings.length ? "primary" : "inherit"}
          onClick={() => handleButtonClick(bindings, index + 1)}
          disabled={!bindings.length}
        >
          {bindings.length ? `${bindings.length} Binding(s)` : 'No Binding'}
        </Button>
      );
    }
  }));

  const columns = [
    {
      id: 'orientation',
      label: 'Orientation',
      format: (attrs) => attrs?.isHorizontal ? 'Horizontal' : 'Vertical'
    },
    {
      id: 'backlight',
      label: 'Backlight',
      format: (attrs) => {
        if (!attrs?.hasBacklight) return 'N/A';
        const enabled = attrs?.backLightEnabled;
        const color = attrs?.blColorId || 0;
        return enabled ? `On (Color: ${color})` : 'Off';
      }
    },
    ...buttonColumns
  ];

  return (
    <>
      <BasicTable
        title={`${buttonCount}-Button Touch Panel`}
        icon={panelIcon}
        devices={devices}
        columns={columns}
        nameColumnWidth="20%"
      />
      
      <ButtonBindingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        bindings={selectedBindings}
        buttonIndex={selectedButton}
      />
    </>
  );
};

export default TouchPanel; 