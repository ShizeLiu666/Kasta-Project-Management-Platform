import React from 'react';
import { Box, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

function RefreshButton({ onClick, tooltip = "Reset and refresh data" }) {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40px',
        width: '40px',
        transition: 'all 0.2s ease',
        '&:hover': {
          border: '1px solid #fbcd0b',
          background: '#fbcd0b',
          '& .MuiSvgIcon-root': {
            color: '#fff'
          }
        }
      }}
    >
      <IconButton
        onClick={onClick}
        size="small"
        sx={{
          padding: '8px',
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }}
        title={tooltip}
      >
        <RefreshIcon sx={{ transition: 'color 0.2s ease' }} />
      </IconButton>
    </Box>
  );
}

export default RefreshButton; 