import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography
} from '@mui/material';

// 参数值映射
const PARAMETER_DISPLAY = {
  backlight: {
    0: 'DISABLED',
    1: 'ENABLED'
  },
  backlight_color: {
    1: 'WHITE',
    2: 'GREEN',
    3: 'BLUE'
  },
  backlight_timeout: {
    0: '30S',
    1: '1MIN',
    2: '2MIN',
    3: '3MIN',
    4: '5MIN',
    5: '10MIN',
    6: 'NEVER'
  },
  beep: {
    0: 'DISABLED',
    1: 'ENABLED'
  },
  night_light: {
    0: 'DISABLED',
    10: 'LOW',
    15: 'MEDIUM',
    20: 'HIGH'
  }
};

const getDisplayValue = (key, value) => {
  if (PARAMETER_DISPLAY[key] && PARAMETER_DISPLAY[key][value] !== undefined) {
    return PARAMETER_DISPLAY[key][value];
  }
  return value;
};

const RemoteControlParameterTable = ({ parameters }) => {
  if (!parameters || Object.keys(parameters).length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 500,
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            width: '4px',
            height: '24px',
            backgroundColor: '#fbcd0b',
            marginRight: '12px',
            borderRadius: '4px'
          }
        }}
      >
        Remote Control Parameters
      </Typography>

      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 'none',
          '& .MuiTable-root': {
            borderCollapse: 'separate',
            borderSpacing: '0 4px',
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f8f9fa',
                  width: '50%'
                }}
              >
                Parameter Name
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f8f9fa',
                  width: '50%'
                }}
              >
                Value
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(parameters).map(([key, value], index) => (
              <TableRow
                key={key}
                sx={{
                  backgroundColor: '#fff',
                  '& td': {
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  }
                }}
              >
                <TableCell sx={{ fontWeight: 'normal' }}>
                  {key.toUpperCase()}
                </TableCell>
                <TableCell>
                  {getDisplayValue(key, value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RemoteControlParameterTable;