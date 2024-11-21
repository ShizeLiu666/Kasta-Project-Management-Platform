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
  Typography
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const PULSE_MAPPING = {
  0: 'NORMAL',
  1: '1SEC',
  2: '6SEC',
  3: '9SEC',
  4: 'REVERS'
};

const OutputModuleTable = ({ outputs }) => {
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  if (!outputs || outputs.length === 0) {
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
        Output Module Configuration
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
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', width: '25%' }}>
                  Device Name
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', width: '15%' }}>
                  Channel
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', width: '30%' }}>
                  Channel Name
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', width: '30%' }}>
                  Output Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outputs.map((output, deviceIndex) => (
                <React.Fragment key={deviceIndex}>
                  {deviceIndex > 0 && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ height: '16px', border: 'none', backgroundColor: 'transparent' }} />
                    </TableRow>
                  )}
                  {output.outputs.map((channel, channelIndex) => (
                    <TableRow key={`${deviceIndex}-${channelIndex}`} sx={{ backgroundColor: '#fff' }}>
                      <TableCell sx={{ fontWeight: channelIndex === 0 ? 'bold' : 'normal', verticalAlign: 'top', ...(channelIndex !== 0 && { border: 'none' }) }}>
                        {channelIndex === 0 ? output.deviceName : ''}
                      </TableCell>
                      <TableCell>
                        {channelIndex + 1}
                      </TableCell>
                      <TableCell>
                        {channel.outputName || <span style={{ color: '#999' }}>-</span>}
                      </TableCell>
                      <TableCell>
                        {PULSE_MAPPING[channel.pulse || 0]}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Box>
  );
};

export default OutputModuleTable;