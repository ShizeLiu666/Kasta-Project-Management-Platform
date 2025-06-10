import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Box,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNetworkDevices, useNetworkGroups, useNetworkScenes, useNetworkRooms } from '../../../useNetworkQueries';
import { PRODUCT_TYPE_MAP } from '../../../PRODUCT_TYPE_MAP';

// 添加设备图标和类型处理函数
const getDeviceTypeFromProductType = (productType, deviceType) => {
  console.log('🔍 Mapping productType:', { productType, deviceType });
  
  // 特殊处理：相同 productType 但不同 deviceType 的情况
  if (productType === '5ozdgdrd') {
    if (deviceType === 'INPUT6') {
      return 'SIX_INPUT';
    } else if (deviceType === 'OUTPUT4') {
      return 'FOUR_OUTPUT';
    }
  }
  
  // 首先检查全局PRODUCT_TYPE_MAP
  const mappedType = PRODUCT_TYPE_MAP[productType];
  if (mappedType) {
    console.log('✅ Found in PRODUCT_TYPE_MAP:', mappedType);
    return mappedType;
  }
  
  // 对于未映射的productType，如果deviceType存在，尝试使用deviceType
  if (deviceType) {
    console.log('⚠️ ProductType not found in map, using deviceType:', deviceType);
    return deviceType;
  }
  
  console.log('❌ No mapping found for productType:', productType);
  return null;
};

const getDeviceIcon = (productType, deviceType, deviceInfo = null) => {
  try {
    const deviceTypeStr = getDeviceTypeFromProductType(productType, deviceType);
    console.log('🔧 Icon resolution:', { productType, deviceType, deviceTypeStr, deviceInfo });
    
    if (!deviceTypeStr) {
      console.log('❌ No deviceTypeStr, using fallback');
      return require(`../../../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
    }
    
    // 特殊处理TOUCH_PANEL类型
    if (deviceTypeStr === 'TOUCH_PANEL') {
      console.log('🎯 Processing TOUCH_PANEL icon...');
      
      // 从deviceType中提取按钮数量 (例如 HRSMB6 -> 6)
      let buttonCount = 1;
      if (deviceType && deviceType.match(/\d+/)) {
        buttonCount = parseInt(deviceType.match(/\d+/)[0]);
      } else if (deviceInfo?.specificAttributes?.remoteBind) {
        // 如果deviceType中没有数字，从remoteBind数组长度推断
        buttonCount = deviceInfo.specificAttributes.remoteBind.length;
      }
      
      // 确定方向 (默认水平)
      let orientation = 'h'; // horizontal
      if (deviceInfo?.specificAttributes?.isHorizontal === 1) {
        orientation = 'v'; // vertical
      }
      
      console.log('🔍 TOUCH_PANEL details:', { buttonCount, orientation });
      
      try {
        const touchPanelIcon = require(`../../../../../../assets/icons/DeviceType/TOUCH_PANEL_${buttonCount}_${orientation}.png`);
        console.log('✅ TOUCH_PANEL specific icon found:', touchPanelIcon);
        return touchPanelIcon;
      } catch (touchPanelError) {
        console.log('⚠️ TOUCH_PANEL specific icon not found, using UNKNOW_ICON fallback');
        return require(`../../../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
      }
    }
    
    // 尝试加载设备特定图标
    try {
      const specific_icon = require(`../../../../../../assets/icons/DeviceType/${deviceTypeStr}.png`);
      console.log('✅ Specific icon found:', specific_icon);
      return specific_icon;
    } catch (specific_error) {
      console.log('⚠️ Specific icon not found:', deviceTypeStr);
      
      // 最终回退到未知图标
      console.log('🔄 Using UNKNOW_ICON as final fallback');
      return require(`../../../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
    }
  } catch (error) {
    console.log('❌ All icon attempts failed, using UNKNOW_ICON');
    try {
      return require(`../../../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
    } catch (fallbackError) {
      console.log('❌ Even UNKNOW_ICON failed');
      return null;
    }
  }
};

// 脉冲模式映射
const PULSE_MODE_MAP = {
  0: 'Normally Open/Close',
  1: '1 Second Pulse',
  2: '6 Seconds Pulse',
  3: '9 Seconds Pulse',
  4: 'Reverse Mode'
};

// 绑定类型映射
const BIND_TYPE_MAP = {
  1: 'Device',
  2: 'Group', 
  3: 'Room',
  4: 'Scene'
};

const ContactDialog = ({ open, onClose, contact, networkId }) => {
  // 获取所有网络数据
  const { data: allDevices = [] } = useNetworkDevices(networkId);
  const { data: allGroups = [] } = useNetworkGroups(networkId);
  const { data: allScenes = [] } = useNetworkScenes(networkId);
  const { data: allRooms = [] } = useNetworkRooms(networkId);
  
  if (!contact) return null;

  // 获取绑定目标的名称 - 参考TOUCH_PANEL.js的实现
  const getBindingName = (binding) => {
    if (!binding) return '';
    
    switch (binding.bindType) {
      case 1: // Device
        const device = allDevices.find(d => d.did === binding.bindId);
        return device ? device.name : null;
      case 2: // Group
        const group = allGroups.find(g => g.gid === binding.bindId);
        return group ? group.name : null;
      case 3: // Room
        const room = allRooms.find(r => r.rid === binding.bindId);
        return room ? room.name : null;
      case 4: // Scene
        const scene = allScenes.find(s => s.sid === binding.bindId);
        return scene ? scene.name : null;
      default:
        return null;
    }
  };

  // 获取绑定类型信息 - 参考TOUCH_PANEL.js的实现
  const getBindingTypeInfo = (binding) => {
    switch (binding.bindType) {
      case 1: // Device
        const boundDevice = allDevices.find(device => device.did === binding.bindId);
        return {
          icon: boundDevice ? getDeviceIcon(boundDevice.productType, boundDevice.deviceType, boundDevice) : null,
          typeName: boundDevice ? getDeviceTypeFromProductType(boundDevice.productType, boundDevice.deviceType) : 'DEVICE'
        };
      case 2: // Group
        return {
          icon: require('../../../../../../assets/icons/NetworkOverview/Group.png'),
          typeName: 'GROUP'
        };
      case 3: // Room
        return {
          icon: require('../../../../../../assets/icons/NetworkOverview/Room.png'),
          typeName: 'ROOM'
        };
      case 4: // Scene
        return {
          icon: require('../../../../../../assets/icons/NetworkOverview/Scene.png'),
          typeName: 'SCENE'
        };
      default:
        return {
          icon: null,
          typeName: 'UNKNOWN'
        };
    }
  };

  // 处理绑定信息
  const getBindingInfo = (remoteBind) => {
    if (!remoteBind || !Array.isArray(remoteBind) || remoteBind.length === 0) {
      return null;
    }
    
    return remoteBind.map((bind, index) => {
      const bindingName = getBindingName(bind);
      if (bindingName === null) {
        return null; // 跳过无效绑定
      }
      
      const bindingTypeInfo = getBindingTypeInfo(bind);
      
      return {
        key: `${bind.bindType}-${bind.bindId}-${index}`,
        type: BIND_TYPE_MAP[bind.bindType] || 'Unknown',
        name: bindingName,
        icon: bindingTypeInfo.icon,
        typeName: bindingTypeInfo.typeName,
        bindType: bind.bindType,
        bindId: bind.bindId,
        channel: bind.bindChannel || bind.hole
      };
    }).filter(Boolean); // 过滤掉null值
  };

  const bindingInfo = getBindingInfo(contact.remoteBind);

  // 获取远程设备信息
  const getRemoteDeviceInfo = (remoteId) => {
    if (!remoteId || remoteId === null || remoteId === undefined) return null;
    
    const deviceInfo = allDevices.find(device => String(device.did) === String(remoteId));
    
    if (deviceInfo) {
      console.log('🔍 Remote Device Info:', {
        remoteId,
        name: deviceInfo.name,
        productType: deviceInfo.productType,
        deviceType: deviceInfo.deviceType,
        did: deviceInfo.did
      });
      
      return {
        name: deviceInfo.name,
        type: deviceInfo.type,
        productType: deviceInfo.productType,
        deviceType: deviceInfo.deviceType
      };
    }
    console.log('❌ Remote Device Not Found:', remoteId);
    return null;
  };

  const remoteDeviceInfo = getRemoteDeviceInfo(contact.remoteId);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {contact.virtualName || `Output ${contact.hole + 1}`}
          </Typography>
          <Chip 
            label={contact.onOff ? "ON" : "OFF"} 
            color={contact.onOff ? "success" : "error"}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Output Position</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Output {contact.hole + 1}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {contact.onOff ? "ON" : "OFF"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Pulse Mode</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {PULSE_MODE_MAP[contact.pulseMode] || 'Unknown'}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Remote ID</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {contact.remoteId || 'None'}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Connection Details
          </Typography>
          
          <Box sx={{ 
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 2,
            bgcolor: '#f9f9f9'
          }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Name: {contact.virtualName || 'Unnamed'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  Mode: {PULSE_MODE_MAP[contact.pulseMode]}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Last Modified: {contact.modifyDate ? new Date(contact.modifyDate).toLocaleString() : 'Unknown'}
                </Typography>
              </Grid>
            </Grid>
            
            {/* 远程设备信息 - 移出Grid系统 */}
            {(contact.remoteId !== null && contact.remoteId !== undefined) && (
              <Box sx={{ mt: 1 }}>
                {remoteDeviceInfo ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img 
                      src={(() => {
                        let iconSrc;
                        if (remoteDeviceInfo.productType && remoteDeviceInfo.deviceType) {
                          const fullDeviceInfo = allDevices.find(d => String(d.did) === String(contact.remoteId));
                          iconSrc = getDeviceIcon(remoteDeviceInfo.productType, remoteDeviceInfo.deviceType, fullDeviceInfo);
                          console.log('🎯 Device Icon URL:', {
                            productType: remoteDeviceInfo.productType,
                            deviceType: remoteDeviceInfo.deviceType,
                            resolvedType: getDeviceTypeFromProductType(remoteDeviceInfo.productType, remoteDeviceInfo.deviceType),
                            iconSrc
                          });
                        } else {
                          iconSrc = require(`../../../../../../assets/icons/NetworkOverview/Device.png`);
                          console.log('🔄 Fallback to default Device.png');
                        }
                        return iconSrc;
                      })()}
                      alt="Device"
                      style={{ 
                        width: 16, 
                        height: 16,
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        console.log('❌ Icon Load Error, trying fallback...');
                        try {
                          e.target.src = require(`../../../../../../assets/icons/NetworkOverview/Device.png`);
                          console.log('✅ Fallback to Device.png successful');
                        } catch (error) {
                          console.log('❌ Device.png also failed, using UNKNOW_ICON');
                          e.target.src = require(`../../../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
                        }
                      }}
                    />
                    <Typography variant="body2">
                      Connected to Remote Device: {remoteDeviceInfo.name} (ID {contact.remoteId})
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2">
                    Connected to Remote Device: ID {contact.remoteId}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* 绑定信息部分 */}
        {bindingInfo && bindingInfo.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Bindings ({bindingInfo.length})
              </Typography>
              
              <Box sx={{ 
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                p: 2,
                bgcolor: '#f9f9f9'
              }}>
                {bindingInfo.map((binding, index) => (
                  <Box key={binding.key} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: index < bindingInfo.length - 1 ? 1 : 0 
                  }}>
                    {binding.icon && (
                      <img 
                        src={binding.icon}
                        alt={binding.type}
                        style={{ 
                          width: 16, 
                          height: 16, 
                          marginRight: 8,
                          objectFit: 'contain'
                        }}
                        onError={(e) => {
                          e.target.src = '/NetworkOverview/Device.png';
                        }}
                      />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {binding.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {binding.type} • Channel {binding.channel || '-'}
                      </Typography>
                    </Box>
                    <Chip 
                      label={binding.type}
                      size="small"
                      sx={{ 
                        height: 20,
                        bgcolor: '#fbcd0b',
                        color: '#000',
                        '& .MuiChip-label': { px: 0.5, fontSize: '0.6rem' } 
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;