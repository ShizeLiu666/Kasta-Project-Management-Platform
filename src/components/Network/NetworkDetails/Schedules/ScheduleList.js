import React from 'react';
import { Box, Typography } from '@mui/material';
import { 
  useNetworkSchedules, 
  useScheduleItemsBatch,
  useDevicesMap,
  // useGroupsMap,  // 暂时不需要
  // useScenesMap   // 暂时不需要
} from '../useNetworkQueries';
import ScheduleCard from './ScheduleCard';

// 导入所有图标
import deviceIcon from '../../../../assets/icons/NetworkOverview/Device.png';
import groupIcon from '../../../../assets/icons/NetworkOverview/Group.png';
import sceneIcon from '../../../../assets/icons/NetworkOverview/Scene.png';

// 修改星期格式化函数
const formatWeekdays = (weekdays) => {
  if (!weekdays) return '-';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekdays
    .split('')
    .map((enabled, index) => enabled === '1' ? days[index] : null)
    .filter(day => day !== null)
    .join(', ');
};

// 获取状态颜色
const getStatusColor = (enabled) => {
  return enabled === 1 ? '#4caf50' : '#95a5a6';
};

// 修改：获取 Schedule 绑定类型的图标和名称（基于 schedule.entityType）
const getScheduleBindingTypeInfo = (entityType) => {
  switch (entityType) {
    case 0: // Group 绑定
      return {
        icon: groupIcon,
        label: 'Group Binding',
        description: 'This schedule is bound to groups'
      };
    case 1: // Device 绑定
      return {
        icon: deviceIcon,
        label: 'Device Binding',
        description: 'This schedule is bound to devices'
      };
    case 2: // Scene 绑定
      return {
        icon: sceneIcon,
        label: 'Scene Binding',
        description: 'This schedule is bound to scenes'
      };
    default:
      return {
        icon: deviceIcon,
        label: 'Unknown Binding',
        description: 'Unknown binding type'
      };
  }
};

// 获取设备类型图标（用于 items 中的设备）
const getDeviceTypeInfo = () => {
  return {
    icon: deviceIcon,
    label: 'Device'
  };
};

const ScheduleList = ({ networkId }) => {
  // 获取基本的 schedules 列表
  const { 
    data: schedules = [], 
    isLoading: isLoadingSchedules, 
    error: schedulesError 
  } = useNetworkSchedules(networkId);

  // 获取所有 scheduleIds
  const scheduleIds = schedules.map(schedule => schedule.scheduleId);

  // 批量获取所有 schedule items
  const { 
    data: itemsMap = {}, 
    isLoading: isLoadingItems 
  } = useScheduleItemsBatch(networkId, scheduleIds);

  // 获取映射
  const devicesMap = useDevicesMap(networkId);
  // const groupsMap = useGroupsMap(networkId);  // 暂时不需要
  // const scenesMap = useScenesMap(networkId);  // 暂时不需要

  // 获取设备名称的函数
  const getDeviceName = (deviceId) => {
    return devicesMap[deviceId]?.name || 'Unknown Device';
  };

  // 检查所有查询是否完成
  const isLoading = isLoadingSchedules || isLoadingItems;
  const error = schedulesError;

  // 合并 schedules 和它们的详细信息
  const enrichedSchedules = React.useMemo(() => {
    return schedules.map(schedule => {
      const items = itemsMap[schedule.scheduleId] || [];
      
      return {
        ...schedule,
        items,
        bindingTypeInfo: getScheduleBindingTypeInfo(schedule.entityType),
        deviceCount: items.length
      };
    });
  }, [schedules, itemsMap]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading schedules...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 3 }}>
        <Typography>{error.message || 'Failed to load schedules'}</Typography>
      </Box>
    );
  }

  if (!enrichedSchedules.length) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        color: '#666',
        backgroundColor: '#fafbfc',
        borderRadius: '12px',
        border: '1px dashed #dee2e6'
      }}>
        <Typography variant="body1" color="text.secondary">
          No schedules found in this network
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      {enrichedSchedules.map((schedule) => (
        <ScheduleCard
          key={schedule.scheduleId}
          schedule={schedule}
          getDeviceName={getDeviceName}
          getDeviceTypeInfo={getDeviceTypeInfo}
          formatWeekdays={formatWeekdays}
          getStatusColor={getStatusColor}
        />
      ))}
    </Box>
  );
};

export default ScheduleList;