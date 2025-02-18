import React, { useState } from 'react';
import { Button } from '@mui/material';
import BasicTable from '../BasicTable';
import ContactDialog from './ContactDialog';
import AutomationDialog from '../Common/AutomationDialog';
import fourOutputIcon from '../../../../../../assets/icons/DeviceType/FOUR_OUTPUT.png';

const FOUR_OUTPUT = ({ devices }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [automationDialogOpen, setAutomationDialogOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState(null);

  // 处理接点点击事件
  const handleContactClick = (contact) => {
    if (contact) {
      setSelectedContact(contact);
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

  const CHANNEL_COUNT = 4;

  // 主表格列配置
  const columns = [
    {
      id: 'configuration',
      label: 'Configuration',
      format: (attrs) => attrs?.isConfig ? 'Configured' : 'Not Configured'
    },
    // 4个输出通道状态
    ...Array.from({ length: CHANNEL_COUNT }, (_, index) => ({
      id: `output${index + 1}`,
      label: `Output ${index + 1}`,
      format: (attrs) => {
        const contact = attrs?.virtualDryContacts?.find(c => c.hole === index + 1);
        return (
          <Button
            variant={contact ? "contained" : "outlined"}
            size="small"
            onClick={() => handleContactClick(contact)}
            disabled={!contact}
            color={contact ? "primary" : "inherit"}
            sx={{
              minWidth: '120px',
              '&.MuiButton-contained': {
                backgroundColor: contact?.onOff ? '#4caf50' : '#f44336'
              }
            }}
          >
            {contact?.virtualName || 'No Contact'}
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
        title="4-Channel Output Device"
        icon={fourOutputIcon}
        devices={devices}
        columns={columns}
        nameColumnWidth="15%"
      />

      {/* 虚拟干接点配置对话框 */}
      <ContactDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        contact={selectedContact}
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

export default FOUR_OUTPUT; 