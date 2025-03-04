// src/components/Network/NetworkDetails/Devices/Tables/SOCKET_RELAY/SOCKET_RELAY.js
import React, { useState } from 'react';
import { 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import BasicTable from '../BasicTable';
import socketRelayIcon from '../../../../../../assets/icons/DeviceType/SOCKET_RELAY.png';
import { DEVICE_CONFIGS } from '../../DeviceConfigs';

// Error log dialog component
const ErrorLogDialog = ({ open, onClose, errors }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Wattage Abnormal Logs
      </DialogTitle>
      <DialogContent>
        {errors && errors.length > 0 ? (
          errors.map((error, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Channel {error.channel}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Error Type: {DEVICE_CONFIGS.SOCKET_RELAY.helpers.getErrorTypeText(error.errorType)}
                <Tooltip title={DEVICE_CONFIGS.SOCKET_RELAY.helpers.getErrorDescription(error.errorType)} arrow>
                  <Box component="span" sx={{ 
                    ml: 1, 
                    cursor: 'help',
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: 'info.main',
                    '&:hover': { textDecoration: 'underline' }
                  }}>
                    ({error.errorType})
                  </Box>
                </Tooltip>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Value: {error.value || '-'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Last Modified: {new Date(error.modifyDate).toLocaleString()}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography color="textSecondary" align="center">
            No error logs found
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

const SOCKET_RELAYType = ({ devices }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedErrors, setSelectedErrors] = useState([]);

  const handleErrorClick = (errors) => {
    if (errors?.length) {
      setSelectedErrors(errors);
      setDialogOpen(true);
    }
  };

  const columns = [
    {
      id: 'power',
      label: 'Power',
      format: (value) => DEVICE_CONFIGS.SOCKET_RELAY.helpers.getPowerStateText(value)
    },
    {
      id: 'delay',
      label: 'Delay',
      format: (value) => DEVICE_CONFIGS.SOCKET_RELAY.helpers.getDelayMinutes(value)
    },
    {
      id: 'pValue',
      label: 'Power Value',
      format: (value) => value ?? '-'
    },
    {
      id: 'socketErrors',
      label: 'Error Logs',
      format: (attrs) => {
        const errors = attrs?.socketErrors || [];
        const hasErrors = errors.length > 0;
        const errorCount = errors.length;
        const latestError = hasErrors ? errors[errors.length - 1] : null;
        
        if (!hasErrors) {
          return 'No Errors';
        }

        return (
          <Box 
            onClick={() => handleErrorClick(errors)} 
            sx={{ 
              cursor: 'pointer',
              color: 'warning.main',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <Tooltip 
              title={`Latest: ${DEVICE_CONFIGS.SOCKET_RELAY.helpers.getErrorTypeText(latestError.errorType)} (${latestError.errorType})`} 
              arrow
            >
              <Typography component="span">
                {`${errorCount} Error${errorCount > 1 ? 's' : ''}`}
              </Typography>
            </Tooltip>
          </Box>
        );
      }
    }
  ];

  return (
    <>
      <BasicTable
        title="Socket Relay"
        icon={socketRelayIcon}
        devices={devices}
        columns={columns}
        nameColumnWidth="20%"
      />

      <ErrorLogDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        errors={selectedErrors}
      />
    </>
  );
};

export default SOCKET_RELAYType;