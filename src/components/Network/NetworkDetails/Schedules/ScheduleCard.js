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
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import CircleIcon from '@mui/icons-material/Circle';

const ScheduleCard = ({ 
  schedule, 
  getDeviceName,
  getDeviceTypeInfo,
  formatWeekdays, 
  // getStatusColor 
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showAllDevices, setShowAllDevices] = useState(false);
  
  const { items = [], bindingTypeInfo, deviceCount } = schedule;
  const MAX_VISIBLE_DEVICES = 5;
  
  // 计算是否显示展开按钮
  const shouldShowExpandButton = items.length > MAX_VISIBLE_DEVICES;
  // 计算要显示的设备数量
  const visibleDevices = showAllDevices ? items : items.slice(0, MAX_VISIBLE_DEVICES);

  return (
    <Paper 
      elevation={0}
      variant="outlined" 
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        borderColor: 'rgba(224, 224, 224, 0.7)',
        mb: 2
      }}
    >
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {schedule.name || 'Unnamed Schedule'}
            <Tooltip title={`Schedule ID: ${schedule.scheduleId || ''} | SID: ${schedule.sid || schedule.scheduleId || ''}`}>
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: '#95a5a6',
                  ml: 1,
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
                {`- ${schedule.scheduleId} | ${schedule.sid || schedule.scheduleId}`}
              </Typography>
            </Tooltip>
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 显示绑定类型 */}
          <Tooltip title={bindingTypeInfo.description}>
            <Chip
              icon={
                <img 
                  src={bindingTypeInfo.icon}
                  alt={bindingTypeInfo.label}
                  style={{ 
                    width: 16, 
                    height: 16,
                    objectFit: 'contain'
                  }}
                />
              }
              label={bindingTypeInfo.label}
              size="small"
              sx={{
                bgcolor: 'rgba(44, 90, 160, 0.1)',
                color: '#2c5aa0',
                fontWeight: 500,
                '& .MuiChip-icon': {
                  marginLeft: '4px',
                  marginRight: '-4px'
                }
              }}
            />
          </Tooltip>
          
          {/* 显示设备数量 */}
          <Chip
            label={`${deviceCount} ${deviceCount === 1 ? 'Device' : 'Devices'}`}
            size="small"
            sx={{
              bgcolor: 'rgba(251, 205, 11, 0.1)',
              color: '#fbcd0b',
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

      <Collapse in={expanded}>
        <TableContainer component={Box}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Target Devices</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date Range</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Execution Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {/* 目标设备列 */}
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {visibleDevices.map((item, index) => (
                      <Box 
                        key={`${item.deviceId}-${index}`}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          py: 0.25
                        }}
                      >
                        <img 
                          src={getDeviceTypeInfo().icon}
                          alt="Device"
                          style={{ 
                            width: 18, 
                            height: 18, 
                            marginRight: 8,
                            objectFit: 'contain'
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {getDeviceName(item.deviceId)}
                        </Typography>
                        <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>
                          ({item.deviceType})
                        </Typography>
                      </Box>
                    ))}
                    
                    {/* 展开/收起按钮 */}
                    {shouldShowExpandButton && (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          cursor: 'pointer',
                          mt: 0.5,
                          py: 0.25,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                        onClick={() => setShowAllDevices(!showAllDevices)}
                      >
                        <IconButton size="small" sx={{ p: 0, mr: 1 }}>
                          {showAllDevices ? 
                            <ExpandLessIcon fontSize="small" /> : 
                            <ExpandMoreIcon fontSize="small" />
                          }
                        </IconButton>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {showAllDevices ? 
                            'Show Less' : 
                            `Show ${items.length - MAX_VISIBLE_DEVICES} More Devices`
                          }
                        </Typography>
                      </Box>
                    )}

                    {/* 无设备时的显示 */}
                    {items.length === 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img 
                          src={getDeviceTypeInfo().icon}
                          alt="Device"
                          style={{ 
                            width: 18, 
                            height: 18, 
                            marginRight: 8,
                            objectFit: 'contain',
                            opacity: 0.5
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                          No target devices
                        </Typography>
                      </Box>
                    )}
                  </Box>
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
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );
};

export default ScheduleCard; 