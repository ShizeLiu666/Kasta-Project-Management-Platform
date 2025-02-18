import React, { useState } from 'react';
import { Button } from '@mui/material';
import BasicTable from '../BasicTable';
import SignalDialog from './SignalDialog';
import AutomationDialog from '../Common/AutomationDialog';
import sixInputIcon from '../../../../../../assets/icons/DeviceType/SIX_INPUT.png';

const SIX_INPUT = ({ devices }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [automationDialogOpen, setAutomationDialogOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState(null);

  // 处理信号点击事件
  const handleSignalClick = (signal) => {
    if (signal) {
      setSelectedSignal(signal);
      setDialogOpen(true);
    }
  };

  // 处理自动化点击事件
  const handleAutomationClick = (automts) => {
    if (automts?.length) {
      setSelectedAutomation(automts);
      setAutomationDialogOpen(true);
    }
  };

  const CHANNEL_COUNT = 6;

  // 主表格列配置
  const columns = [
    {
      id: 'configuration',
      label: 'Configuration',
      format: (attrs) => attrs?.isConfig ? 'Configured' : 'Not Configured'
    },
    // 6个输入通道状态
    ...Array.from({ length: CHANNEL_COUNT }, (_, index) => ({
      id: `channel${index + 1}`,
      label: `Channel ${index + 1}`,
      format: (attrs) => {
        const signal = attrs?.signals?.find(s => s.hole === index + 1);
        return (
          <Button
            variant={signal?.isConfig ? "contained" : "outlined"}
            size="small"
            onClick={() => handleSignalClick(signal)}
            disabled={!signal}
            color={signal ? "primary" : "inherit"}
            sx={{
              minWidth: '120px'
            }}
          >
            {signal?.name || 'No Signal'}
          </Button>
        );
      }
    })),
    // 自动化配置按钮
    {
      id: 'automation',
      label: 'Automation',
      format: (attrs) => {
        const automationCount = attrs?.automts?.length || 0;
        return (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleAutomationClick(attrs?.automts)}
            disabled={!automationCount}
            color={automationCount ? "warning" : "inherit"}
            sx={{
              minWidth: '120px'
            }}
          >
            {automationCount ? `${automationCount} Rules` : 'No Rules'}
          </Button>
        );
      }
    }
  ];

  return (
    <>
      <BasicTable
        title="6-Channel Input Device"
        icon={sixInputIcon}
        devices={devices}
        columns={columns}
        nameColumnWidth="15%"
      />
      
      {/* 信号配置对话框 */}
      <SignalDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        signal={selectedSignal}
      />

      {/* 自动化规则对话框 */}
      <AutomationDialog
        open={automationDialogOpen}
        onClose={() => setAutomationDialogOpen(false)}
        automations={selectedAutomation}
      />
    </>
  );
};

export default SIX_INPUT; 