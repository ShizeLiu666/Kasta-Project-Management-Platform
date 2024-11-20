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

const INPUT_ACTION_MAPPING = {
  0: 'MOMENTARY',
  1: 'TOGGLE'
};

const InputModuleTable = ({ inputs }) => {
  if (!inputs || inputs.length === 0) {
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
        Input Module Configuration
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
                  width: '30%'
                }}
              >
                Device Name
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f8f9fa',
                  width: '35%'
                }}
              >
                Channel
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f8f9fa',
                  width: '35%'
                }}
              >
                Input Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inputs.map((input, deviceIndex) => (
              <React.Fragment key={deviceIndex}>
                {/* 如果不是第一个设备，添加一个空行 */}
                {deviceIndex > 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={3} 
                      sx={{ 
                        height: '16px',
                        border: 'none',
                        backgroundColor: 'transparent'
                      }} 
                    />
                  </TableRow>
                )}
                {/* 渲染设备的通道 */}
                {input.inputActions.map((action, channelIndex) => (
                  <TableRow
                    key={`${deviceIndex}-${channelIndex}`}
                    sx={{
                      backgroundColor: '#fff',
                    }}
                  >
                    <TableCell 
                      sx={{ 
                        fontWeight: channelIndex === 0 ? 'bold' : 'normal',
                        verticalAlign: 'top',
                        ...(channelIndex !== 0 && { border: 'none' })
                      }}
                    >
                      {channelIndex === 0 ? input.deviceName : ''}
                    </TableCell>
                    <TableCell>
                      {channelIndex + 1}
                    </TableCell>
                    <TableCell>
                      {INPUT_ACTION_MAPPING[action]}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InputModuleTable;