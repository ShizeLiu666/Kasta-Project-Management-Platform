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
  Typography,
  Box
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

const TOUCH_PANEL = ({ groupedDevices }) => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBindings, setSelectedBindings] = useState([]);

  const { horizontal: horizontalDevices, vertical: verticalDevices } = groupedDevices;

  if (!horizontalDevices?.length && !verticalDevices?.length) return null;

  // 按按键数量进一步分组
  const groupByButtonCount = (devices) => {
    return devices.reduce((acc, device) => {
      const { buttonCount } = parseDeviceType(device.deviceType);
      if (!acc[buttonCount]) {
        acc[buttonCount] = [];
      }
      acc[buttonCount].push(device);
      return acc;
    }, {});
  };

  const horizontalGrouped = groupByButtonCount(horizontalDevices || []);
  const verticalGrouped = groupByButtonCount(verticalDevices || []);

  const handleButtonClick = (bindings, buttonIndex) => {
    setSelectedButton(buttonIndex);
    setSelectedBindings(bindings);
    setDialogOpen(true);
  };

  // 生成特定按键数量的列
  const generateColumns = (buttonCount) => {
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

    return [
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
  };

  // 获取图标路径
  const getIconPath = (count, orientation) => {
    try {
      return require(`../../../../../../assets/icons/DeviceType/TOUCH_PANEL_${count}_${orientation}.png`);
    } catch (error) {
      console.warn(`Failed to load icon: TOUCH_PANEL_${count}_${orientation}.png`);
      return null;
    }
  };

  return (
    <>
      {/* 渲染水平面板 */}
      {Object.entries(horizontalGrouped).map(([buttonCount, devices], index) => (
        <Box key={`h-${buttonCount}`} sx={{ mb: index < Object.keys(horizontalGrouped).length - 1 ? 3 : 0 }}>
          <BasicTable
            title={`${buttonCount}-Button Touch Panel (Horizontal)`}
            icon={getIconPath(buttonCount, 'h')}
            devices={devices}
            columns={generateColumns(parseInt(buttonCount))}
            nameColumnWidth="20%"
          />
        </Box>
      ))}
      
      {/* 如果同时存在水平和垂直面板，添加额外间距 */}
      {Object.keys(horizontalGrouped).length > 0 && Object.keys(verticalGrouped).length > 0 && (
        <Box sx={{ mb: 3 }} />
      )}
      
      {/* 渲染垂直面板 */}
      {Object.entries(verticalGrouped).map(([buttonCount, devices], index) => (
        <Box key={`v-${buttonCount}`} sx={{ mb: index < Object.keys(verticalGrouped).length - 1 ? 3 : 0 }}>
          <BasicTable
            title={`${buttonCount}-Button Touch Panel (Vertical)`}
            icon={getIconPath(buttonCount, 'v')}
            devices={devices}
            columns={generateColumns(parseInt(buttonCount))}
            nameColumnWidth="20%"
          />
        </Box>
      ))}
      
      <ButtonBindingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        bindings={selectedBindings}
        buttonIndex={selectedButton}
      />
    </>
  );
};

export default TOUCH_PANEL; 