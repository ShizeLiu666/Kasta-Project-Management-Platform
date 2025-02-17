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

const BindingDialog = ({ open, onClose, bindings }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Remote Bindings
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
            No bindings for this remote
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

const RB02 = ({ devices }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBindings, setSelectedBindings] = useState([]);

  if (!devices || devices.length === 0) return null;

  const handleBindingClick = (bindings) => {
    setSelectedBindings(bindings);
    setDialogOpen(true);
  };

  const columns = [
    {
      id: 'checkTime',
      label: 'Check Time',
      format: (attrs) => attrs?.checkTime || 'N/A'
    },
    {
      id: 'bindings',
      label: 'Bindings',
      format: (attrs) => {
        const bindings = attrs?.remoteBind || [];
        return (
          <Button
            variant={bindings.length ? "contained" : "outlined"}
            size="small"
            color={bindings.length ? "primary" : "inherit"}
            onClick={() => handleBindingClick(bindings)}
            disabled={!bindings.length}
          >
            {bindings.length ? `${bindings.length} Binding(s)` : 'No Binding'}
          </Button>
        );
      }
    }
  ];

  return (
    <>
      <BasicTable
        title="Battery Powered Remote Switch"
        icon={require('../../../../../../assets/icons/DeviceType/RB02.png')}
        devices={devices}
        columns={columns}
        nameColumnWidth="25%"
      />
      
      <BindingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        bindings={selectedBindings}
      />
    </>
  );
};

export default RB02; 