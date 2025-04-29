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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CircleIcon from '@mui/icons-material/Circle';
import { useNetworkSchedules } from '../useNetworkQueries';

// 导入自定义图标
import deviceIcon from '../../../../assets/icons/NetworkOverview/Device.png';
import groupIcon from '../../../../assets/icons/NetworkOverview/Group.png';

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

const ScheduleList = ({ networkId }) => {
  const [expanded, setExpanded] = useState(true);
  
  const { 
    data: schedules = [], 
    isLoading, 
    error 
  } = useNetworkSchedules(networkId);

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

  if (!schedules.length) {
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
          No schedules found in this network
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
        {/* 标题区域 */}
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
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Schedules
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`${schedules.length} ${schedules.length === 1 ? 'Schedule' : 'Schedules'}`}
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Target Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date Range</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Execution Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                {schedules.map((schedule) => {
                  const statusColor = getStatusColor(schedule.enabled);
                  
                  return (
                    <TableRow
                      key={schedule.scheduleId}
                      sx={{
                        '&:hover': { backgroundColor: '#f8f9fa' }
                      }}
                    >
                      {/* 名称列 - 简化显示 */}
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {schedule.name || 'Unnamed Schedule'}
                        </Typography>
                      </TableCell>

                      {/* 目标类型列 */}
                      <TableCell>
                        <Chip 
                          icon={
                            <img 
                              src={schedule.scheduleType === 0 ? deviceIcon : groupIcon}
                              alt={schedule.scheduleType === 0 ? "Device" : "Group"}
                              style={{ 
                                width: 20, 
                                height: 20,
                                objectFit: 'contain'
                              }}
                            />
                          }
                          label={schedule.scheduleType === 0 ? 'Device' : 'Group'}
                          size="small"
                          sx={{ 
                            backgroundColor: '#edf2f7',
                            color: '#718096',
                            fontWeight: 500,
                            '& .MuiChip-icon': { 
                              color: '#718096',
                              marginLeft: '4px'
                            }
                          }}
                        />
                      </TableCell>

                      {/* 日期范围列 */}
                      <TableCell>
                        <Chip 
                          icon={<CalendarMonthIcon />}
                          label={schedule.startYear && schedule.endYear ? 
                            `${schedule.startYear} → ${schedule.endYear}` : 
                            'No date range'
                          }
                          size="small"
                          sx={{ 
                            backgroundColor: '#edf2f7',
                            color: '#718096',
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: '#718096' }
                          }}
                        />
                      </TableCell>

                      {/* 执行时间列 */}
                      <TableCell>
                        <Chip 
                          icon={<AccessTimeIcon />}
                          label={`${schedule.executionTime || '--:--:--'} · ${formatWeekdays(schedule.weekdays)}`}
                          size="small"
                          sx={{ 
                            backgroundColor: '#edf2f7',
                            color: '#718096',
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: '#718096' }
                          }}
                        />
                      </TableCell>

                      {/* 状态列 */}
                      <TableCell>
                        <Chip 
                          icon={<CircleIcon sx={{ fontSize: '0.8rem' }} />}
                          label={schedule.enabled === 1 ? 'Enabled' : 'Disabled'}
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

export default ScheduleList;