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
import { useEntityMaps } from '../../../useNetworkQueries';

// 添加设备图标和类型处理函数
const getDeviceTypeFromProductType = (productType) => {
  const PRODUCT_TYPE_MAP = {
    'ONE_INPUT': 'ONE_INPUT',
    'TWO_INPUT': 'TWO_INPUT', 
    'THREE_INPUT': 'THREE_INPUT',
    'FOUR_INPUT': 'FOUR_INPUT',
    'FIVE_INPUT': 'FIVE_INPUT',
    'SIX_INPUT': 'SIX_INPUT',
    'ONE_OUTPUT': 'ONE_OUTPUT',
    'TWO_OUTPUT': 'TWO_OUTPUT',
    'THREE_OUTPUT': 'THREE_OUTPUT',
    'FOUR_OUTPUT': 'FOUR_OUTPUT',
    'FIVE_OUTPUT': 'FIVE_OUTPUT',
    'SIX_OUTPUT': 'SIX_OUTPUT',
    // 添加其他产品类型映射
  };
  
  const entry = Object.entries(PRODUCT_TYPE_MAP).find(([key, value]) => key === productType);
  return entry ? entry[1] : null;
};

const getDeviceIcon = (productType) => {
  try {
    const deviceType = getDeviceTypeFromProductType(productType);
    if (!deviceType) return null;
    return require(`../../../../../../assets/icons/DeviceType/${deviceType}.png`);
  } catch (error) {
    return require(`../../../../../../assets/icons/DeviceType/UNKNOW_ICON.png`);
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

// 获取绑定信息的辅助函数
const getBindingInfo = (remoteBind, entityMaps) => {
  if (!remoteBind || !Array.isArray(remoteBind) || remoteBind.length === 0) {
    return null;
  }

  const { devicesMap, groupsMap, roomsMap, scenesMap } = entityMaps;
  
  return remoteBind.map((bind, index) => {
    let name = 'Unknown';
    let icon = 'Device.png'; // 默认图标
    
    switch (bind.bindType) {
      case 1: // Device
        name = devicesMap[bind.deviceId]?.name || `Device ${bind.deviceId}`;
        icon = 'Device.png';
        break;
      case 2: // Group
        name = groupsMap[bind.deviceId]?.name || `Group ${bind.deviceId}`;
        icon = 'Group.png';
        break;
      case 3: // Room
        name = roomsMap[bind.deviceId]?.name || `Room ${bind.deviceId}`;
        icon = 'Room.png';
        break;
      case 4: // Scene
        name = scenesMap[bind.deviceId]?.name || `Scene ${bind.deviceId}`;
        icon = 'Scene.png';
        break;
      default:
        name = `Unknown Type ${bind.deviceId}`;
    }

    return {
      key: `${bind.bindType}-${bind.deviceId}-${index}`,
      type: BIND_TYPE_MAP[bind.bindType] || 'Unknown',
      name,
      icon,
      bindType: bind.bindType,
      deviceId: bind.deviceId,
      channel: bind.bindChannel
    };
  });
};

const ContactDialog = ({ open, onClose, contact, networkId }) => {
  const entityMaps = useEntityMaps(networkId);
  
  if (!contact) return null;

  const bindingInfo = getBindingInfo(contact.remoteBind, entityMaps);

  // 获取远程设备信息
  const getRemoteDeviceInfo = (remoteId) => {
    if (!remoteId || remoteId === null || remoteId === undefined) return null;
    
    const { devicesMap } = entityMaps;
    const deviceInfo = devicesMap[String(remoteId)];
    
    if (deviceInfo) {
      return {
        name: deviceInfo.name,
        type: deviceInfo.type,
        productType: deviceInfo.productType
      };
    }
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
                      src={remoteDeviceInfo.productType ? getDeviceIcon(remoteDeviceInfo.productType) : `/NetworkOverview/Device.png`}
                      alt="Device"
                      style={{ 
                        width: 16, 
                        height: 16,
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.src = '/NetworkOverview/Device.png';
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
                    <img 
                      src={`/NetworkOverview/${binding.icon}`}
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