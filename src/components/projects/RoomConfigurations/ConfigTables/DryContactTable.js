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
  Typography,
} from '@mui/material';

const DryContactTable = ({ dryContacts }) => {
  if (!dryContacts || dryContacts.length === 0) {
    return null;
  }

  const getPulseText = (pulse) => {
    const pulseMap = {
      0: 'NORMAL',
      1: '1SEC',
      2: '6SEC',
      3: '9SEC',
      4: 'REVERS'
    };
    return pulseMap[pulse] || 'NORMAL';
  };

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
        Dry Contact Configuration
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
                Device Name
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f8f9fa',
                  width: '50%'
                }}
              >
                Dry Contact Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dryContacts.map((contact) => (
              <TableRow 
                key={contact.deviceName}
                sx={{ backgroundColor: '#fff' }}
              >
                <TableCell 
                  component="th" 
                  scope="row"
                  sx={{ width: '50%' }}
                >
                  {contact.deviceName}
                </TableCell>
                <TableCell sx={{ width: '50%' }}>
                  {getPulseText(contact.pulse)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DryContactTable;