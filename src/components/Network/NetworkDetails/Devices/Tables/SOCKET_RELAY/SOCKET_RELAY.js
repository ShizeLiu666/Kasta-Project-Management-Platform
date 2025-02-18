// src/components/Network/NetworkDetails/Devices/Tables/SOCKET_RELAY/SOCKET_RELAY.js
import React, { useState } from 'react';
import { 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box
} from '@mui/material';
import BasicTable from '../BasicTable';
import socketRelayIcon from '../../../../../../assets/icons/DeviceType/SOCKET_RELAY.png';

// 异常日志对话框组件
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
                Error Type: {
                  error.errorType === 0 ? 'Low Energy' :
                  error.errorType === 1 ? 'Threshold Warning' :
                  error.errorType === 0x50 ? 'Config Error' :
                  error.errorType === 0x51 ? 'Alert Enabled' :
                  error.errorType === 0x52 ? 'Alert Disabled' : '-'
                }
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
      format: (value) => {
        if (value === 1) return 'On';
        if (value === 0) return 'Off';
        return '-';
      }
    },
    {
      id: 'delay',
      label: 'Delay',
      format: (value) => {
        if (value === undefined || value === null) return '-';
        return `${value}min`;
      }
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
        return (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleErrorClick(errors)}
            disabled={!errors.length}
            color={errors.length ? "warning" : "inherit"}
            sx={{
              minWidth: '120px'
            }}
          >
            {errors.length ? `${errors.length} Error${errors.length > 1 ? 's' : ''}` : 'No Errors'}
          </Button>
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