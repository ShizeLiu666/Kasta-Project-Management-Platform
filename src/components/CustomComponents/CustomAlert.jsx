import React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const CustomAlert = ({ isOpen, onClose, message, severity, autoHideDuration = 2000 }) => {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={autoHideDuration ? onClose : undefined}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        position: 'fixed !important',
        left: '50% !important',
        transform: 'translateX(-50%) !important',
        top: '24px !important',
        zIndex: '999 !important'
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: '100% !important',
          minWidth: '300px !important',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1) !important',
          '& .MuiAlert-message': {
            textAlign: 'center !important',
            flex: '1 !important'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
