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
  Paper,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// 脉冲模式映射
const PULSE_MODE_MAP = {
  0: 'Normally Open/Close',
  1: '1 Second Pulse',
  2: '6 Seconds Pulse',
  3: '9 Seconds Pulse',
  4: 'Reverse Mode'
};

// 干接点卡片组件
export const ContactCard = ({ device, onOpenDialog }) => {
  const contacts = device.specificAttributes?.virtualDryContacts || [];
  const scrollContainerRef = useRef(null);
  
  // 准备一个包含4个输出通道的数组
  const outputChannels = [1, 2, 3, 4].map(hole => {
    const contact = contacts.find(c => Number(c.hole) === hole);
    return {
      hole,
      contact
    };
  });
  
  // 如果没有干接点，显示简单的提示消息
  if (!contacts.length) {
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
          No Virtual Dry Contacts
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
      p: 1
    }}>
      {/* 使用网格布局显示4个输出通道 */}
      <Grid container spacing={1} sx={{ height: '100%' }}>
        {outputChannels.map(({ hole, contact }) => (
          <Grid item xs={12} key={hole}>
            <Paper
              elevation={0}
              sx={{ 
                p: 1.5,
                height: '68px',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                cursor: contact ? 'pointer' : 'default',
                bgcolor: contact ? '#f8f9fa' : '#f5f5f5',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onClick={() => contact && onOpenDialog(contact)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Output {hole}
                </Typography>
                {contact && (
                  <Chip 
                    label={contact.onOff ? "ON" : "OFF"} 
                    size="small" 
                    color={contact.onOff ? "success" : "error"}
                    sx={{ height: 18, '& .MuiChip-label': { px: 1, fontSize: '0.6rem' } }}
                  />
                )}
              </Box>
              
              {contact ? (
                <>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: 500 }}>
                    {contact.virtualName || 'Unnamed Contact'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {PULSE_MODE_MAP[contact.pulseMode] || 'Unknown Mode'}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontStyle: 'italic' }}>
                  No contact configured
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// 干接点详情对话框
export const ContactDialog = ({ open, onClose, contact }) => {
  if (!contact) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
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
            {contact.virtualName || `Output ${contact.hole}`}
          </Typography>
          <Chip 
            label={contact.onOff ? "ON" : "OFF"} 
            color={contact.onOff ? "success" : "error"}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Output Position</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Output {contact.hole}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {contact.onOff ? "ON" : "OFF"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Pulse Mode</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {PULSE_MODE_MAP[contact.pulseMode] || 'Unknown'}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Remote ID</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {contact.remoteId || 'None'}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Connection Details
          </Typography>
          
          <Box sx={{ 
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 2,
            bgcolor: '#f9f9f9'
          }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Name: {contact.virtualName || 'Unnamed'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  Mode: {PULSE_MODE_MAP[contact.pulseMode]}
                </Typography>
              </Grid>
              {contact.remoteId && (
                <Grid item xs={12}>
                  <Typography variant="body2">
                    Connected to Remote Device: ID {contact.remoteId}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Last Modified: {contact.modifyDate ? new Date(contact.modifyDate).toLocaleString() : 'Unknown'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// 干接点管理器组件
const VirtualDryContacts = ({ device }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const handleOpenContactDialog = (contact) => {
    setSelectedContact(contact);
    setContactDialogOpen(true);
  };

  const handleCloseContactDialog = () => {
    setContactDialogOpen(false);
    setSelectedContact(null);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ContactCard 
        device={device} 
        onOpenDialog={handleOpenContactDialog}
      />
      <ContactDialog
        open={contactDialogOpen}
        onClose={handleCloseContactDialog}
        contact={selectedContact}
      />
    </Box>
  );
};

export default VirtualDryContacts; 