import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Collapse,
  IconButton,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import multivueIcon from '../../../../../../assets/icons/DeviceType/MULTIVUE.png';
import { useNetworkDevices, useNetworkGroups, useNetworkScenes, useNetworkRooms } from '../../../../NetworkDetails/useNetworkQueries';
import PageBindingsView from './PageBindingsView';

const MULTIVUE = ({ devices }) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(devices[0]?.deviceId);
  
  // 获取网络ID以查询设备、组、场景和房间数据
  const networkId = devices[0]?.networkId;
  
  // 使用custom hooks获取设备、组、场景和房间数据
  const { data: allDevices = [] } = useNetworkDevices(networkId);
  const { data: allGroups = [] } = useNetworkGroups(networkId);
  const { data: allScenes = [] } = useNetworkScenes(networkId);
  const { data: allRooms = [] } = useNetworkRooms(networkId);

  // 创建设备、组、场景和房间名称映射
  const deviceMap = React.useMemo(() => {
    return allDevices.reduce((acc, device) => {
      if (device && device.did && device.name) {
        acc[device.did] = device.name;
      }
      return acc;
    }, {});
  }, [allDevices]);

  const groupMap = React.useMemo(() => {
    return allGroups.reduce((acc, group) => {
      if (group && group.groupId && group.name) {
        acc[group.groupId] = group.name;
      }
      if (group && group.gid && group.name) {
        acc[group.gid] = group.name;
      }
      return acc;
    }, {});
  }, [allGroups]);

  const sceneMap = React.useMemo(() => {
    return allScenes.reduce((acc, scene) => {
      if (scene && scene.sceneId && scene.name) {
        acc[scene.sceneId] = scene.name;
      }
      if (scene && scene.sid && scene.name) {
        acc[scene.sid] = scene.name;
      }
      return acc;
    }, {});
  }, [allScenes]);

  const roomMap = React.useMemo(() => {
    return allRooms.reduce((acc, room) => {
      if (room && room.roomId && room.name) {
        acc[room.roomId] = room.name;
      }
      if (room && room.rid && room.name) {
        acc[room.rid] = room.name;
      }
      return acc;
    }, {});
  }, [allRooms]);

  const handleDeviceChange = (deviceId) => {
    setSelectedDevice(deviceId);
  };

  const currentDevice = devices.find(d => d.deviceId === selectedDevice);
  
  // 获取当前设备的页面数量
  const pageCount = currentDevice?.specificAttributes?.pageNames?.length || 0;
  const MAX_PAGES = 5;

  return (
    <Box sx={{ mb: 4 }}>
      <Paper 
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          borderColor: 'rgba(224, 224, 224, 0.7)'
        }}
      >
        {/* 标题区域 */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
            borderBottom: expanded ? '1px solid #dee2e6' : 'none',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={multivueIcon}
              alt="MultiVue"
              style={{ width: 30, height: 30, marginRight: 12 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#fbcd0b',
              }}
            >
              MultiVue Pages & Bindings
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${pageCount} ${pageCount === 1 ? 'Page' : 'Pages'}`}
              size="small"
              sx={{
                bgcolor: 'rgba(251, 205, 11, 0.1)',
                color: '#fbcd0b',
                fontWeight: 500,
              }}
            />
            <Chip
              label={`${devices.length} ${devices.length === 1 ? 'device' : 'devices'}`}
              size="small"
              sx={{
                bgcolor: 'rgba(100, 100, 100, 0.1)',
                color: '#505050',
                fontWeight: 500,
              }}
            />
            <IconButton 
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* 可折叠的内容区域 */}
        <Collapse in={expanded}>
          <Box sx={{ p: 2 }}>
            {/* 设备选择器 */}
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {devices.map((device) => (
                <Chip
                  key={device.deviceId}
                  label={device.name}
                  onClick={() => handleDeviceChange(device.deviceId)}
                  variant={selectedDevice === device.deviceId ? "filled" : "outlined"}
                  sx={{
                    '&.MuiChip-filled': {
                      backgroundColor: '#505050',
                      color: '#FFF',
                      '&:hover': {
                        backgroundColor: '#606060'
                      }
                    },
                    '&.MuiChip-outlined': {
                      borderColor: '#505050',
                      color: '#505050',
                      '&:hover': {
                        backgroundColor: 'rgba(96, 96, 96, 0.1)'
                      }
                    }
                  }}
                />
              ))}
            </Box>

            {/* 当前设备详细信息 */}
            {currentDevice && (
              <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {currentDevice.name}
                  <Tooltip title={`Device ID: ${currentDevice.deviceId || ''} | DID: ${currentDevice.did || ''}`}>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: '#95a5a6',
                        ml: 0.5,
                        fontWeight: 400,
                        cursor: 'pointer',
                        textDecoration: 'underline dotted',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 120,
                        verticalAlign: 'middle',
                        display: 'inline-block'
                      }}
                    >
                      {`- ${currentDevice.deviceId.substring(0, 8)}... | ${currentDevice.did}`}
                    </Typography>
                  </Tooltip>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentDevice.appearanceShortname}
                </Typography>
              </Box>
            )}

            {/* 页面绑定视图 */}
            {currentDevice && (
              <PageBindingsView 
                device={currentDevice}
                deviceMap={deviceMap}
                groupMap={groupMap}
                sceneMap={sceneMap}
                roomMap={roomMap}
                allDevices={allDevices}
                allGroups={allGroups}
                allScenes={allScenes}
                allRooms={allRooms}
                maxPages={MAX_PAGES}
              />
            )}
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default MULTIVUE; 