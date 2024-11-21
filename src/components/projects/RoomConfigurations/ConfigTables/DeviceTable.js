import React, { useMemo, useState, useEffect, useRef } from 'react';
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

const DeviceTypeRow = ({ deviceType, devices, isExpanded, onToggle }) => {
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const isOverflowing = textRef.current.scrollWidth > textRef.current.clientWidth;
        setIsTextTruncated(isOverflowing);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [devices]);

  const deviceNames = devices.map(device => device.deviceName).join(', ');

  return (
    <>
      <TableRow 
        sx={{
          '& > *': { borderBottom: 'unset' },
          backgroundColor: '#fff',
        }}
      >
        <TableCell 
          component="th" 
          scope="row"
          sx={{ 
            fontWeight: 'bold',
            width: '30%',
          }}
        >
          {deviceType} ({devices.length})
        </TableCell>
        <TableCell sx={{ width: '30%' }}>
          {devices[0].appearanceShortname}
        </TableCell>
        <TableCell 
          sx={{ 
            width: '40%',
            position: 'relative',
          }}
        >
          <Box
            ref={textRef}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              pr: isTextTruncated ? 4 : 0,
            }}
          >
            {deviceNames}
          </Box>
          {isTextTruncated && (
            <IconButton
              size="small"
              onClick={onToggle}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      {isTextTruncated && (
        <TableRow>
          <TableCell 
            colSpan={3} 
            sx={{ 
              py: 0,
              backgroundColor: '#fafafa',
            }}
          >
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ py: 2, px: 3 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {deviceNames}
                </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const DeviceTable = ({ devices }) => {
  const [expandedTypes, setExpandedTypes] = React.useState(new Set());
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  const groupedDevices = useMemo(() => {
    return devices.reduce((acc, device) => {
      const type = device.deviceType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(device);
      return acc;
    }, {});
  }, [devices]);

  const handleToggle = (deviceType) => {
    setExpandedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deviceType)) {
        newSet.delete(deviceType);
      } else {
        newSet.add(deviceType);
      }
      return newSet;
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
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
        Device Configuration
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
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: '#f8f9fa',
                    width: '30%'
                  }}
                >
                  Device Type
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: '#f8f9fa',
                    width: '30%'
                  }}
                >
                  Model
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: '#f8f9fa',
                    width: '40%'
                  }}
                >
                  Device Names
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedDevices).map(([deviceType, deviceList]) => (
                <DeviceTypeRow
                  key={deviceType}
                  deviceType={deviceType}
                  devices={deviceList}
                  isExpanded={expandedTypes.has(deviceType)}
                  onToggle={() => handleToggle(deviceType)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Box>
  );
};

export default DeviceTable;