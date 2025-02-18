import React, { useState } from 'react';
import BasicTable from '../BasicTable';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography 
} from '@mui/material';
import fiveInputIcon from '../../../../../../assets/icons/DeviceType/FIVE_INPUT.png';

const ChannelBindingDialog = ({ open, onClose, bindings, channelIndex }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Channel {channelIndex} Bindings
      </DialogTitle>
      <DialogContent>
        {bindings.length > 0 ? (
          <List>
            {bindings.map((binding, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`Binding ${index + 1}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" display="block">
                          Channel: {binding.bind_channel ? 'Right' : 'Left'}
                        </Typography>
                        {binding.has_timer && (
                          <Typography component="span" variant="body2" display="block">
                            Timer: {binding.hour}:{binding.min.toString().padStart(2, '0')}
                          </Typography>
                        )}
                        <Typography component="span" variant="body2" display="block">
                          State: {binding.state ? 'ON' : 'OFF'}
                        </Typography>
                        <Typography component="span" variant="body2" display="block">
                          Status: {binding.enable ? 'Enabled' : 'Disabled'}
                        </Typography>
                        <Typography component="span" variant="body2" display="block">
                          Created: {new Date(binding.create_date).toLocaleString()}
                        </Typography>
                        <Typography component="span" variant="body2" display="block">
                          Modified: {new Date(binding.modify_date).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < bindings.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary">
            No bindings for this channel
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const FIVE_INPUT = ({ devices }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBindings, setSelectedBindings] = useState([]);

  if (!devices || devices.length === 0) return null;

  const CHANNEL_COUNT = 5; // 固定5个输入通道
  
  const handleChannelClick = (bindings, channelIndex) => {
    setSelectedChannel(channelIndex);
    setSelectedBindings(bindings);
    setDialogOpen(true);
  };

  // 生成输入通道列
  const channelColumns = Array.from({ length: CHANNEL_COUNT }, (_, index) => ({
    id: `channel${index + 1}`,
    label: `Channel ${index + 1}`,
    format: (attrs) => {
      const bindings = attrs?.remoteBind?.filter(b => b.hole === index + 1) || [];
      
      return (
        <Button
          variant="outlined"
          size="small"
          color={bindings.length ? "primary" : "inherit"}
          onClick={() => handleChannelClick(bindings, index + 1)}
          disabled={!bindings.length}
          sx={{
            '&.MuiButton-outlined': {
              borderColor: '#fbcd0b',
              color: '#fbcd0b'
            },
            '&.MuiButton-contained': {
              backgroundColor: '#fbcd0b',
              color: 'black',
              '&:hover': {
                backgroundColor: '#e3b800'
              }
            },
            '&.Mui-disabled': {
              borderColor: 'rgba(0, 0, 0, 0.12)',
              color: 'rgba(0, 0, 0, 0.26)'
            }
          }}
        >
          {bindings.length ? `${bindings.length} Binding(s)` : 'No Binding'}
        </Button>
      );
    }
  }));

  const columns = [
    {
      id: 'configuration',
      label: 'Configuration',
      format: (attrs) => attrs?.isConfig ? 'Configured' : 'Not Configured'
    },
    ...channelColumns
  ];

  return (
    <>
      <BasicTable
        title="5-Channel Input Device"
        icon={fiveInputIcon}
        devices={devices}
        columns={columns}
        nameColumnWidth="20%"
      />
      
      <ChannelBindingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        bindings={selectedBindings}
        channelIndex={selectedChannel}
      />
    </>
  );
};

export default FIVE_INPUT; 