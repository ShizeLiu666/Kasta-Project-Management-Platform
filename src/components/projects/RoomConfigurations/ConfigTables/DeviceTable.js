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
  Tooltip,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import RenameDeviceModal from './RenameDeviceModal';

const DeviceTypeRow = ({ deviceType, devices, isExpanded, onToggle, onRename }) => {
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
          {deviceType}
        </TableCell>
        <TableCell sx={{ width: '30%' }}>
          {devices[0].appearanceShortname}
        </TableCell>
        <TableCell 
          sx={{ 
            width: '35%',
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
        <TableCell sx={{ width: '10%' }}>
          <Tooltip title="Rename Device">
            <IconButton
              size="small"
              onClick={() => onRename(devices)}
              sx={{
                color: '#fbcd0b',
                '&:hover': {
                  color: '#e3b900',
                  backgroundColor: 'rgba(251, 205, 11, 0.1)'
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      {isTextTruncated && (
        <TableRow>
          <TableCell 
            colSpan={4} 
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

const DeviceTable = ({ devices, onDeviceRename, onDownloadUpdatedConfig }) => {
  const [expandedTypes, setExpandedTypes] = React.useState(new Set());
  const [isTableExpanded, setIsTableExpanded] = useState(true);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState('');
  const [selectedDeviceModel, setSelectedDeviceModel] = useState('');

  const groupedDevices = useMemo(() => {
    return devices.reduce((acc, device) => {
      const key = `${device.deviceType}_${device.appearanceShortname}`;
      if (!acc[key]) {
        acc[key] = {
          deviceType: device.deviceType,
          appearanceShortname: device.appearanceShortname,
          devices: []
        };
      }
      acc[key].devices.push(device);
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

  const handleRename = (devices) => {
    setSelectedDevices(devices);
    setSelectedDeviceType(devices[0].deviceType);
    setSelectedDeviceModel(devices[0].appearanceShortname);
    setRenameModalOpen(true);
  };

  const handleRenameModalClose = () => {
    setRenameModalOpen(false);
    setSelectedDevices([]);
    setSelectedDeviceType('');
    setSelectedDeviceModel('');
  };

  const handleRenameSave = (renamedDevices, newModel, downloadCallback) => {
    if (onDeviceRename) {
      onDeviceRename(renamedDevices, newModel, downloadCallback, selectedDeviceType, selectedDeviceModel);
    }
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
                    width: '35%'
                  }}
                >
                  Device Names
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: '#f8f9fa',
                    width: '10%',
                    textAlign: 'center'
                  }}
                >
                  Rename
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(groupedDevices).map((group) => (
                <DeviceTypeRow
                  key={`${group.deviceType}_${group.appearanceShortname}`}
                  deviceType={`${group.deviceType} (${group.devices.length})`}
                  devices={group.devices}
                  isExpanded={expandedTypes.has(`${group.deviceType}_${group.appearanceShortname}`)}
                  onToggle={() => handleToggle(`${group.deviceType}_${group.appearanceShortname}`)}
                  onRename={handleRename}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>

      <RenameDeviceModal
        open={renameModalOpen}
        onClose={handleRenameModalClose}
        devices={selectedDevices}
        allDevices={devices}
        deviceType={selectedDeviceType}
        deviceModel={selectedDeviceModel}
        onSave={handleRenameSave}
        onDownloadUpdatedConfig={onDownloadUpdatedConfig}
      />
    </Box>
  );
};

export default DeviceTable;