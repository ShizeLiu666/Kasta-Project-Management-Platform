import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CircleIcon from '@mui/icons-material/Circle';
import { useNetworkTimers, useNetworkDevices, useNetworkGroups, useNetworkScenes } from '../useNetworkQueries';

// 导入自定义图标
import deviceIcon from '../../../../assets/icons/NetworkOverview/Device.png';
import groupIcon from '../../../../assets/icons/NetworkOverview/Group.png';
import sceneIcon from '../../../../assets/icons/NetworkOverview/Scene.png';

// 辅助函数
const formatTime = (hour, min, second) => {
  const h = Number(hour || 0);
  const m = Number(min || 0);
  const s = Number(second || 0);
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatAction = (action) => {
  switch (action) {
    case 0: return 'OFF';
    case 1: return 'ON';
    default: return '-';
  }
};

const getActionColor = (action) => {
  switch (action) {
    case 0: return '#f44336'; // 红色表示关闭
    case 1: return '#4caf50'; // 绿色表示开启
    default: return '#9e9e9e'; // 灰色表示未知
  }
};

const getStatusColor = (enabled) => {
  return enabled ? '#4caf50' : '#95a5a6';
};

const TimerList = ({ networkId }) => {
  const [expanded, setExpanded] = useState(true);
  
  const { 
    data: timers = [], 
    isLoading, 
    error,
  } = useNetworkTimers(networkId);
  
  const { data: devices = [] } = useNetworkDevices(networkId);
  const { data: groups = [] } = useNetworkGroups(networkId);
  const { data: scenes = [] } = useNetworkScenes(networkId);
  
  // 创建设备和组的映射
  const deviceMap = React.useMemo(() => {
    return devices.reduce((acc, device) => {
      acc[device.deviceId] = device.name;
      return acc;
    }, {});
  }, [devices]);
  
  const groupMap = React.useMemo(() => {
    return groups.reduce((acc, group) => {
      acc[group.groupId] = group.name;
      return acc;
    }, {});
  }, [groups]);
  
  const sceneMap = React.useMemo(() => {
    return scenes.reduce((acc, scene) => {
      acc[scene.sceneId] = scene.name;
      return acc;
    }, {});
  }, [scenes]);
  
  // 获取目标图标
  const getTargetIcon = (entityType) => {
    switch (entityType) {
      case 0: return deviceIcon;
      case 1: return groupIcon;
      case 2: return sceneIcon;
      default: return deviceIcon;
    }
  };

  // 获取目标类型名称
  const getTargetTypeName = (entityType) => {
    switch (entityType) {
      case 0: return "Device";
      case 1: return "Group";
      case 2: return "Scene";
      default: return "Unknown";
    }
  };

  // 根据entityType和ID获取目标名称
  const getTargetName = (timer) => {
    switch (timer.entityType) {
      case 0: // Device
        return deviceMap[timer.deviceId] || `Device ${timer.deviceId}`;
      case 1: // Group
        return groupMap[timer.groupId] || `Group ${timer.groupId}`;
      case 2: // Scene
        return sceneMap[timer.sceneId] || `Scene ${timer.sceneId}`;
      default:
        return '-';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading timers...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 3 }}>
        <Typography>{error.message || 'Failed to load timers'}</Typography>
      </Box>
    );
  }

  if (!timers.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          color: '#666',
          backgroundColor: '#fafbfc',
          borderRadius: '12px',
          border: '1px dashed #dee2e6'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No timers found in this network
        </Typography>
      </Box>
    );
  }

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
        {/* 标题区域 - 一致的可点击标题栏 */}
        <Box 
          onClick={() => setExpanded(!expanded)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
            borderBottom: expanded ? '1px solid #dee2e6' : 'none',
            cursor: 'pointer',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
              }}
            >
              Timers
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`${timers.length} ${timers.length === 1 ? 'Timer' : 'Timers'}`}
              size="small"
        sx={{
                bgcolor: 'rgba(251, 205, 11, 0.1)',
                color: '#fbcd0b',
                fontWeight: 500,
                mr: 1
              }}
            />
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* 可折叠的表格内容 */}
        <Collapse in={expanded}>
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Timer Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Target</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timers.map((timer) => {
                  const targetName = getTargetName(timer);
                  const actionColor = getActionColor(timer.action);
                  const statusColor = getStatusColor(timer.enabled);
                  
                  return (
                    <TableRow
                      key={timer.timerId}
                      sx={{
                        '&:hover': { backgroundColor: '#f8f9fa' }
                      }}
                    >
                      {/* 名称列 */}
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {timer.name || 'Unnamed Timer'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#95a5a6', display: 'block' }}>
                          ID: {timer.timerId || 'N/A'}
                        </Typography>
                      </TableCell>
                      
                      {/* 时间列 */}
                      <TableCell>
                        <Chip 
                          icon={<AccessTimeIcon />}
                          label={formatTime(timer.hour, timer.min, timer.second)}
                          size="small"
                          sx={{ 
                            backgroundColor: '#edf2f7', 
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: '#718096' }
                          }}
                        />
                      </TableCell>
                      
                      {/* 目标列 - 现在在 Action 列之前 */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img 
                            src={getTargetIcon(timer.entityType)}
                            alt={getTargetTypeName(timer.entityType)}
                            style={{ 
                              width: 20, 
                              height: 20, 
                              marginRight: 8,
                              objectFit: 'contain'
                            }}
                          />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {targetName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#95a5a6', display: 'block' }}>
                              {timer.channel !== undefined && timer.channel !== null && timer.channel !== -1 && (
                                `Channel ${timer.channel}`
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      {/* 动作列 - 现在在 Target 列之后 */}
                      <TableCell>
                        <Chip 
                          icon={<PowerSettingsNewIcon />}
                          label={formatAction(timer.action)}
                          size="small"
                          sx={{ 
                            backgroundColor: `${actionColor}20`,
                            color: actionColor,
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: actionColor }
                          }}
                        />
                      </TableCell>
                      
                      {/* 状态列 */}
                      <TableCell>
                        <Chip 
                          icon={<CircleIcon sx={{ fontSize: '0.8rem' }} />}
                          label={timer.enabled ? 'Enabled' : 'Disabled'}
                          size="small"
                          sx={{ 
                            backgroundColor: `${statusColor}20`,
                            color: statusColor,
                            fontWeight: 500,
                            '& .MuiChip-icon': { 
                              color: statusColor,
                              marginLeft: '4px',
                              marginRight: '-4px'
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default TimerList;