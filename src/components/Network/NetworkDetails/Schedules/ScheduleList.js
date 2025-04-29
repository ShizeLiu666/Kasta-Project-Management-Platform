import React from 'react';
import { Box, Typography } from '@mui/material';
import { 
  useNetworkSchedules, 
  useScheduleItemsBatch,
  useDevicesMap,
  useGroupsMap,
  useScenesMap 
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

// 添加获取目标类型图标和名称的函数
const getTargetTypeInfo = (entityType) => {
  switch (entityType) {
    case 0:
      return {
        icon: deviceIcon,
        label: 'Device'
      };
    case 1:
      return {
        icon: groupIcon,
        label: 'Group'
      };
    case 2:
      return {
        icon: sceneIcon,
        label: 'Scene'
      };
    default:
      return {
        icon: deviceIcon,
        label: 'Unknown'
      };
  }
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
  const groupsMap = useGroupsMap(networkId);
  const scenesMap = useScenesMap(networkId);

  // 获取目标名称的函数
  const getTargetName = (item) => {
    if (item.deviceId) {
      return devicesMap[item.deviceId]?.name || 'Unknown Device';
    }
    if (item.groupId) {
      return groupsMap[item.groupId]?.name || 'Unknown Group';
    }
    if (item.sceneId) {
      return scenesMap[item.sceneId]?.name || 'Unknown Scene';
    }
    return 'Unknown Target';
  };

  // 检查所有查询是否完成
  const isLoading = isLoadingSchedules || isLoadingItems;
  const error = schedulesError;

  // 合并 schedules 和它们的详细信息
  const enrichedSchedules = React.useMemo(() => {
    return schedules.map(schedule => ({
      ...schedule,
      items: itemsMap[schedule.scheduleId] || []
    }));
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
          getTargetName={getTargetName}
          getTargetTypeInfo={getTargetTypeInfo}
          formatWeekdays={formatWeekdays}
          getStatusColor={getStatusColor}
        />
      ))}
    </Box>
  );
};

export default ScheduleList;