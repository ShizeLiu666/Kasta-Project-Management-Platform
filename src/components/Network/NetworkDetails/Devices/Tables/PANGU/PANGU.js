import React, { useState } from 'react';
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
  Typography,
  Box
} from '@mui/material';
import BasicTable from '../BasicTable';
import panguIcon from '../../../../../../assets/icons/DeviceType/PANGU.png';

// 子设备对话框组件
const SubDevicesDialog = ({ open, onClose, subDevices }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Gateway Sub Devices
      </DialogTitle>
      <DialogContent>
        {subDevices && subDevices.length > 0 ? (
          <List>
            {subDevices.map((device, index) => (
              <React.Fragment key={device.id}>
                <ListItem>
                  <ListItemText
                    primary={`Device ID: ${device.deviceId}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Send Device ID: {device.sendDeviceId}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Send DID: {device.sendDid}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Last Modified: {new Date(device.modifyDate).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < subDevices.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary" align="center">
            No sub devices found
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

const PANGUType = ({ devices }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubDevices, setSelectedSubDevices] = useState([]);

  const handleSubDevicesClick = (subDevices) => {
    if (subDevices?.length) {
      setSelectedSubDevices(subDevices);
      setDialogOpen(true);
    }
  };

  const columns = [
    {
      id: 'connectState',
      label: 'Connection',
      format: (value) => {
        switch (value) {
          case 0: return 'Disconnected';
          case 1: return 'Connected';
          case 2: return 'Connecting';
          default: return '-';
        }
      }
    },
    {
      id: 'subDevices',
      label: 'Sub Devices',
      format: (attrs) => {
        const subDevices = attrs?.subDevices || [];
        return (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleSubDevicesClick(subDevices)}
            disabled={!subDevices.length}
            color={subDevices.length ? "primary" : "inherit"}
            sx={{
              minWidth: '120px'
            }}
          >
            {subDevices.length ? `${subDevices.length} Device${subDevices.length > 1 ? 's' : ''}` : 'No Devices'}
          </Button>
        );
      }
    }
  ];

  return (
    <>
      <BasicTable
        title="PanGu Gateway"
        icon={panguIcon}
        devices={devices}
        columns={columns}
        nameColumnWidth="40%"
      />

      <SubDevicesDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        subDevices={selectedSubDevices}
      />
    </>
  );
};

export default PANGUType; 