import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// 添加触发器类型映射
const TRIGGER_ACTIVE_TYPES = {
  0: 'Signal',
  1: 'Device',
  2: 'Group',
  3: 'Room',
  4: 'Scene',
  5: 'Kasta Device Error',
  6: 'Load Error',
  7: 'Energy Limit Exceeded',
  8: 'Virtual Dry Contact'
};

// 添加动作类型映射
const ACTION_POWER_TYPES = {
  0: 'Off',
  1: 'On',
  2: 'Off to On',
  3: 'On to Off',
  4: 'Reverse'
};

// 自动化卡片组件
export const AutomationCard = ({ device, onOpenDialog }) => {
  const automation = device.specificAttributes?.automts || [];
  const scrollContainerRef = useRef(null);
  
  // 如果没有自动化规则，显示简单的提示消息
  if (!automation.length) {
    return (
      <Box sx={{ 
        padding: '16px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ opacity: 0.7, fontStyle: 'italic' }}
        >
          No Automation Rules
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box 
        ref={scrollContainerRef}
        sx={{ 
          overflowY: 'auto',
          overflowX: 'hidden',
          flex: 1,
          height: '100%',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#a0a0a0',
            },
          }
        }}
      >
        <Box sx={{ p: 0.5 }}>
          {automation.map((rule, index) => (
            <Box
              key={index}
              onClick={() => onOpenDialog(rule)}
              sx={{ 
                p: 0.75,
                height: '64px', // 与 VirtualDryContacts 的高度保持一致
                mb: 0.4, // 与 VirtualDryContacts 的间距保持一致
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                cursor: 'pointer',
                bgcolor: '#f8f9fa',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                '&:hover': { bgcolor: '#f1f3f4' },
                '&:last-child': { mb: 0 }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.1 }}>
                  {rule.name || `Case ${rule.caseIdx}`}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: '0.72rem', 
                    lineHeight: 1.1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mt: 0.2
                  }}
                >
                  {rule.triggerList?.length || 0} trigger(s), {rule.actionList?.length || 0} action(s)
                </Typography>
              </Box>
              
              <Chip 
                label={rule.state ? "Active" : "Inactive"} 
                size="small" 
                color={rule.state ? "success" : "default"}
                sx={{ 
                  height: 16, 
                  minWidth: 32,
                  '& .MuiChip-label': { px: 0.4, fontSize: '0.58rem' } 
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// 修改触发器显示组件，添加设备名称显示
const TriggerItem = ({ trigger, deviceMap, groupMap, roomMap }) => {
  // 获取设备/组名称
  const getTargetName = () => {
    if (trigger.activeType === 1 || trigger.activeType === 0) { // Device or Signal
      return deviceMap[String(trigger.dstAddress)] || `Unknown Device (${trigger.dstAddress})`;
    } else if (trigger.activeType === 2) { // Group
      return groupMap[trigger.dstAddress] || `Unknown Group (${trigger.dstAddress})`;
    } else if (trigger.activeType === 3) { // Room
      return roomMap[trigger.dstAddress] || `Unknown Room (${trigger.dstAddress})`;
    } else if (trigger.activeType === 8) { // Virtual Dry Contact
      return `Virtual Contact (${trigger.dstAddress})`;
    } else {
      return `${trigger.dstAddress || 'Unknown'}`;
    }
  };

  return (
    <Typography variant="body2" sx={{ mb: 1 }}>
      {`${trigger.conditionNum}: ${trigger.elementName || 'Trigger'} (${TRIGGER_ACTIVE_TYPES[trigger.activeType] || 'Unknown'})`}
      <Typography variant="caption" component="div" color="text.secondary">
        {`Target: ${getTargetName()}, Channel: ${trigger.bindChannel || '-'}`}
      </Typography>
    </Typography>
  );
};

// 修改动作显示组件，添加设备名称显示
const ActionItem = ({ action, deviceMap, groupMap, roomMap }) => {
  // 获取设备/组名称
  const getTargetName = () => {
    if (action.actionPowerType !== undefined) { // 确保有实际绑定目标
      return deviceMap[String(action.dstAddress)] || 
             groupMap[action.dstAddress] || 
             roomMap[action.dstAddress] ||
             `Unknown (${action.dstAddress})`;
    }
    return 'Not specified';
  };

  return (
    <Typography variant="body2" sx={{ mb: 1 }}>
      {`${action.conditionNum}: ${action.elementName || 'Action'}`}
      <Typography variant="caption" component="div" color="text.secondary">
        {`Target: ${getTargetName()}, Channel: ${action.bindChannel || '-'}`}
      </Typography>
      <Typography variant="caption" component="div" color="text.secondary">
        {`Action: ${ACTION_POWER_TYPES[action.actionPowerType] || 'Unknown'}, Duration: ${action.duration} ${action.durationType === 0 ? 'seconds' : 'minutes'}`}
      </Typography>
    </Typography>
  );
};

// 自动化对话框组件 - 传递 deviceMap 和 groupMap 给子组件
export const AutomationDialog = ({ open, onClose, automation, deviceMap, groupMap, roomMap }) => {
  if (!automation) return null;

  // 格式化星期显示
  const formatWeekdays = (weekdays) => {
    if (!weekdays) return 'None';
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return weekdays.split('').map((enabled, idx) => 
      enabled === '1' ? days[idx] : null
    ).filter(Boolean).join(', ');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
        py: 1.5
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {automation.name || `Case ${automation.caseIdx}`}
          </Typography>
          <Chip 
            label={automation.state ? "Active" : "Inactive"} 
            color={automation.state ? "success" : "default"}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2, mb: 2, mt: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Logic</Typography>
            <Typography variant="body2">
              {automation.logicOr === 1 ? 'OR' : 'AND'}
            </Typography>
          </Box>
          {automation.periodEnable === 1 && (
            <>
              <Box>
                <Typography variant="caption" color="text.secondary">Time Schedule</Typography>
                <Typography variant="body2">
                  {`${String(automation.startHour).padStart(2, '0')}:${String(automation.startMinute).padStart(2, '0')} - ${String(automation.stopHour).padStart(2, '0')}:${String(automation.stopMinute).padStart(2, '0')}`}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Active Days</Typography>
                <Typography variant="body2">
                  {formatWeekdays(automation.weekdays)}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />
        
        {/* Triggers Section - 传递 deviceMap 和 groupMap */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Triggers ({automation.triggerList?.length || 0})
          </Typography>
          
          <Box sx={{ 
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 2
          }}>
            {automation.triggerList?.length > 0 ? (
              automation.triggerList.map((trigger, idx) => (
                <TriggerItem 
                  key={idx} 
                  trigger={trigger} 
                  deviceMap={deviceMap} 
                  groupMap={groupMap} 
                  roomMap={roomMap}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No triggers defined
              </Typography>
            )}
          </Box>
        </Box>
        
        {/* Actions Section - 传递 deviceMap 和 groupMap */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Actions ({automation.actionList?.length || 0})
          </Typography>
          
          <Box sx={{ 
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 2
          }}>
            {automation.actionList?.length > 0 ? (
              automation.actionList.map((action, idx) => (
                <ActionItem 
                  key={idx} 
                  action={action} 
                  deviceMap={deviceMap} 
                  groupMap={groupMap} 
                  roomMap={roomMap}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No actions defined
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// 自动化规则管理器组件
const AutomationRules = ({ device, deviceMap, groupMap, sceneMap, roomMap }) => {
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [automationDialogOpen, setAutomationDialogOpen] = useState(false);

  const handleOpenAutomationDialog = (automation) => {
    setSelectedAutomation(automation);
    setAutomationDialogOpen(true);
  };

  const handleCloseAutomationDialog = () => {
    setAutomationDialogOpen(false);
    setSelectedAutomation(null);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AutomationCard 
        device={device} 
        onOpenDialog={handleOpenAutomationDialog}
      />
      <AutomationDialog
        open={automationDialogOpen}
        onClose={handleCloseAutomationDialog}
        automation={selectedAutomation}
        deviceMap={deviceMap}
        groupMap={groupMap}
        roomMap={roomMap}
      />
    </Box>
  );
};

export default AutomationRules; 