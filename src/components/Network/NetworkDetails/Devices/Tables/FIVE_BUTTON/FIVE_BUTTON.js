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

const ButtonBindingDialog = ({ open, onClose, bindings, buttonIndex }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Button {buttonIndex} Bindings
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
            No bindings for this button
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

const FIVE_BUTTON = ({ devices }) => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBindings, setSelectedBindings] = useState([]);

  if (!devices || devices.length === 0) return null;

  const handleButtonClick = (bindings, buttonIndex) => {
    setSelectedButton(buttonIndex);
    setSelectedBindings(bindings);
    setDialogOpen(true);
  };

  // 生成5个按键的列
  const buttonColumns = Array.from({ length: 5 }, (_, index) => ({
    id: `button${index + 1}`,
    label: `Button ${index + 1}`,
    format: (attrs) => {
      const bindings = attrs?.remoteBind?.filter(b => b.hole === index + 1) || [];
      
      return (
        <Button
          variant="outlined"
          size="small"
          color={bindings.length ? "primary" : "inherit"}
          onClick={() => handleButtonClick(bindings, index + 1)}
          disabled={!bindings.length}
        >
          {bindings.length ? `${bindings.length} Binding(s)` : 'No Binding'}
        </Button>
      );
    }
  }));

  const columns = [
    {
      id: 'checkTime',
      label: 'Check Time',
      format: (attrs) => attrs?.checkTime || 'N/A'
    },
    ...buttonColumns
  ];

  return (
    <>
      <BasicTable
        title="5-Button Remote"
        icon={require('../../../../../../assets/icons/DeviceType/FIVE_BUTTON.png')}
        devices={devices}
        columns={columns}
        nameColumnWidth="20%"
      />
      
      <ButtonBindingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        bindings={selectedBindings}
        buttonIndex={selectedButton}
      />
    </>
  );
};

export default FIVE_BUTTON; 