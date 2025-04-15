import React, { useState } from 'react';
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
  
  if (!automation.length) {
    return (
      <Box sx={{ 
        padding: '12px',
        borderRadius: 1.5,
        bgcolor: '#f8f9fa',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        height: '260px',
        width: '100%',
        display: 'flex',
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
      padding: '12px',
      borderRadius: 1.5,
      bgcolor: '#f8f9fa',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      height: '260px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography
        variant="subtitle2"
        sx={{
          color: '#2c3e50',
          fontWeight: 600,
          borderBottom: '1px solid #edf2f7',
          pb: 1,
          mb: 1
        }}
      >
        Automation Rules ({automation.length})
      </Typography>
      
      <Box sx={{ 
        overflowY: 'auto', 
        flex: 1,
        pr: 1
      }}>
        {automation.map((rule, index) => (
          <Box
            key={index}
            onClick={() => onOpenDialog(rule)}
            sx={{ 
              p: 1,
              mb: 1,
              border: '1px solid #e2e8f0',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { 
                bgcolor: '#f1f5f9'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                {rule.name || `Case ${rule.caseIdx}`}
                <Chip 
                  label={rule.state ? "Active" : "Inactive"} 
                  size="small" 
                  color={rule.state ? "success" : "default"}
                  sx={{ height: 20, ml: 1, '& .MuiChip-label': { px: 1, fontSize: '0.6rem' } }}
                />
              </Typography>
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              {rule.triggerList?.length || 0} trigger(s), {rule.actionList?.length || 0} action(s)
            </Typography>
            
            {rule.periodEnable === 1 && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {`${String(rule.startHour).padStart(2, '0')}:${String(rule.startMinute).padStart(2, '0')} - ${String(rule.stopHour).padStart(2, '0')}:${String(rule.stopMinute).padStart(2, '0')}`}
              </Typography>
            )}
          </Box>
        ))}
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
        borderBottom: '1px solid #e0e0e0'
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
    <>
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
    </>
  );
};

export default AutomationRules; 