import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const DryContactTable = ({ dryContacts }) => {
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  if (!dryContacts || dryContacts.length === 0) {
    return null;
  }

  const getPulseText = (pulse) => {
    const pulseMap = {
      0: 'NORMAL',
      1: '1SEC',
      2: '6SEC',
      3: '9SEC',
      4: 'REVERSE'
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
        <IconButton
          size="small"
          onClick={() => setIsTableExpanded(!isTableExpanded)}
          sx={{ ml: 0.5 }}
        >
          {isTableExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Typography>

      <Collapse in={isTableExpanded} timeout="auto" unmountOnExit>
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
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', width: '50%' }}>
                  Device Name
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', width: '50%' }}>
                  Dry Contact Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dryContacts.map((contact) => (
                <TableRow key={contact.deviceName} sx={{ backgroundColor: '#fff' }}>
                  <TableCell component="th" scope="row" sx={{ width: '50%' }}>
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
      </Collapse>
    </Box>
  );
};

export default DryContactTable;