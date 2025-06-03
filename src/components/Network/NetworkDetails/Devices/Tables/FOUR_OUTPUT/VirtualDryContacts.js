import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  Grid
} from '@mui/material';
import ContactDialog from './ContactDialog';

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
  // const scrollContainerRef = useRef(null);
  
  // 准备一个包含4个输出通道的数组
  const outputChannels = [0, 1, 2, 3].map(hole => {
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
      p: 0.5,
      overflow: 'hidden'
    }}>
      {/* 使用网格布局显示4个输出通道 */}
      <Grid container spacing={0} sx={{ height: '100%' }}>
        {outputChannels.map(({ hole, contact }) => (
          <Grid item xs={12} key={hole} sx={{ mb: 0.4, '&:last-child': { mb: 0 } }}>
            <Paper
              elevation={0}
              sx={{ 
                p: 0.75,
                height: '64px',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                cursor: contact ? 'pointer' : 'default',
                bgcolor: contact ? '#f8f9fa' : '#f5f5f5',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                '&:hover': contact ? { bgcolor: '#f1f3f4' } : {}
              }}
              onClick={() => contact && onOpenDialog(contact)}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.1 }}>
                  Output {hole + 1}
                </Typography>
                {contact && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.72rem', 
                      color: '#4b5563', 
                      fontWeight: 400,
                      lineHeight: 1.1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      mt: 0.2
                    }}
                  >
                    {contact.virtualName || 'Unnamed Contact'}
                  </Typography>
                )}
                {contact && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.625rem', lineHeight: 1 }}>
                    {PULSE_MODE_MAP[contact.pulseMode] || 'Unknown Mode'}
                  </Typography>
                )}
              </Box>
              
              {contact ? (
                <Chip 
                  label={contact.onOff ? "ON" : "OFF"} 
                  size="small" 
                  color={contact.onOff ? "success" : "error"}
                  sx={{ 
                    height: 16, 
                    minWidth: 32,
                    '& .MuiChip-label': { px: 0.4, fontSize: '0.58rem' } 
                  }}
                />
              ) : (
                <Typography variant="caption" sx={{ fontSize: '0.625rem', color: 'text.secondary', fontStyle: 'italic' }}>
                  None
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// 干接点管理器组件
const VirtualDryContacts = ({ device, networkId }) => {
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
        networkId={networkId}
      />
    </Box>
  );
};

export default VirtualDryContacts; 