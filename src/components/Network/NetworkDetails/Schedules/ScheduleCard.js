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
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import CircleIcon from '@mui/icons-material/Circle';

const ScheduleCard = ({ 
  schedule, 
  getTargetName, 
  getTargetTypeInfo, 
  formatWeekdays, 
  // getStatusColor 
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showAllTargets, setShowAllTargets] = useState(false);
  const items = schedule.items || [];
  const MAX_VISIBLE_TARGETS = 3;

  // 计算是否显示展开按钮
  const shouldShowExpandButton = items.length > MAX_VISIBLE_TARGETS;
  // 计算要显示的目标数量
  const visibleTargets = showAllTargets ? items : items.slice(0, MAX_VISIBLE_TARGETS);

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
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            label={`${items.length} ${items.length === 1 ? 'Target' : 'Targets'}`}
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
                <TableCell sx={{ fontWeight: 'bold' }}>Target</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date Range</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Execution Time</TableCell>
                {/* <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {/* 目标类型列 */}
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {visibleTargets.map((item, index) => (
                      <Box 
                        key={`${item.deviceId || item.groupId || item.sceneId}-${index}`}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center'
                        }}
                      >
                        <img 
                          src={getTargetTypeInfo(item.entityType).icon}
                          alt={getTargetTypeInfo(item.entityType).label}
                          style={{ 
                            width: 20, 
                            height: 20, 
                            marginRight: 8,
                            objectFit: 'contain'
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {getTargetName(item)}
                        </Typography>
                      </Box>
                    ))}
                    {items.length === 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img 
                          src={getTargetTypeInfo(schedule.entityType).icon}
                          alt={getTargetTypeInfo(schedule.entityType).label}
                          style={{ 
                            width: 20, 
                            height: 20, 
                            marginRight: 8,
                            objectFit: 'contain'
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                          No targets
                        </Typography>
                      </Box>
                    )}
                    {shouldShowExpandButton && (
                      <Button
                        size="small"
                        onClick={() => setShowAllTargets(!showAllTargets)}
                        disableRipple
                        sx={{
                          mt: 0.5,
                          color: '#666',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        {showAllTargets ? 'Show Less' : `+${items.length - MAX_VISIBLE_TARGETS} More`}
                      </Button>
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

                {/* 状态列 */}
                {/* <TableCell>
                  <Chip 
                    icon={<CircleIcon sx={{ fontSize: '0.8rem' }} />}
                    label={schedule.enabled === 1 ? 'Enabled' : 'Disabled'}
                    size="small"
                    sx={{ 
                      backgroundColor: `${getStatusColor(schedule.enabled)}20`,
                      color: getStatusColor(schedule.enabled),
                      fontWeight: 500,
                      '& .MuiChip-icon': { 
                        color: getStatusColor(schedule.enabled),
                        marginLeft: '4px',
                        marginRight: '-4px'
                      }
                    }}
                  />
                </TableCell> */}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );
};

export default ScheduleCard; 