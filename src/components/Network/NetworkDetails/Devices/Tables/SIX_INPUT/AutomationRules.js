import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
  Paper
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
        <Box sx={{ p: 1 }}>
          {automation.map((rule, index) => (
            <Box
              key={index}
              onClick={() => onOpenDialog(rule)}
              sx={{ 
                p: 1.5,
                borderBottom: index < automation.length - 1 ? '1px solid #e0e0e0' : 'none',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {rule.name || `Case ${rule.caseIdx}`}
                </Typography>
                <Chip 
                  label={rule.state ? "Active" : "Inactive"} 
                  size="small" 
                  color={rule.state ? "success" : "default"}
                  sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.6rem' } }}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
                {rule.triggerList?.length || 0} trigger(s), {rule.actionList?.length || 0} action(s)
              </Typography>
              
              {rule.periodEnable === 1 && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Schedule: {`${String(rule.startHour).padStart(2, '0')}:${String(rule.startMinute).padStart(2, '0')} - ${String(rule.stopHour).padStart(2, '0')}:${String(rule.stopMinute).padStart(2, '0')}`}
                </Typography>
              )}

              {/* 添加触发器和动作的简要信息 */}
              {rule.triggerList && rule.triggerList.length > 0 && (
                <Box sx={{ mt: 1, pt: 0.5, borderTop: '1px dashed #e0e0e0' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c3e50', fontSize: '0.75rem' }}>
                    Triggers:
                  </Typography>
                  {rule.triggerList.slice(0, 2).map((trigger, idx) => (
                    <Typography key={idx} variant="caption" component="div" color="text.secondary" sx={{ mt: 0.3 }}>
                      • {trigger.elementName || `Trigger ${trigger.conditionNum}`} ({TRIGGER_ACTIVE_TYPES[trigger.activeType]})
                    </Typography>
                  ))}
                  {rule.triggerList.length > 2 && (
                    <Typography variant="caption" color="text.secondary">
                      ...and {rule.triggerList.length - 2} more
                    </Typography>
                  )}
                </Box>
              )}

              {rule.actionList && rule.actionList.length > 0 && (
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c3e50', fontSize: '0.75rem' }}>
                    Actions:
                  </Typography>
                  {rule.actionList.slice(0, 2).map((action, idx) => (
                    <Typography key={idx} variant="caption" component="div" color="text.secondary" sx={{ mt: 0.3 }}>
                      • {action.elementName || `Action ${action.conditionNum}`} ({action.duration} {action.durationType === 0 ? 'sec' : 'min'})
                    </Typography>
                  ))}
                  {rule.actionList.length > 2 && (
                    <Typography variant="caption" color="text.secondary">
                      ...and {rule.actionList.length - 2} more
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// 修改触发器显示组件
const TriggerItem = ({ trigger }) => (
  <Typography variant="body2" sx={{ mb: 1 }}>
    {`${trigger.conditionNum}: ${trigger.elementName || 'Trigger'} (${TRIGGER_ACTIVE_TYPES[trigger.activeType] || 'Unknown'})`}
  </Typography>
);

// 修改动作显示组件
const ActionItem = ({ action }) => (
  <Typography variant="body2" sx={{ mb: 1 }}>
    {`${action.conditionNum}: ${action.elementName || 'Action'}`}
    <Typography variant="caption" component="div" color="text.secondary">
      {`Duration: ${action.duration} ${action.durationType === 0 ? 'seconds' : 'minutes'}`}
    </Typography>
  </Typography>
);

// 自动化对话框组件 
export const AutomationDialog = ({ open, onClose, automation, deviceMap, groupMap }) => {
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
        
        {/* Triggers Section */}
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
                <TriggerItem key={idx} trigger={trigger} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No triggers defined
              </Typography>
            )}
          </Box>
        </Box>
        
        {/* Actions Section */}
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
                <ActionItem key={idx} action={action} />
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
const AutomationRules = ({ device, deviceMap, groupMap }) => {
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
      />
    </Box>
  );
};

export default AutomationRules; 