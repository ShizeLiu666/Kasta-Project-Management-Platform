// src/components/Network/NetworkDetails/Devices/Tables/PPT/PPT.js
import React, { useState } from 'react';
import { 
  Box, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PowerPointIcon from '../../../../../../assets/icons/DeviceType/POWER_POINT.png';

const PowerPointStatus = ({ label, value, type }) => {
  let displayValue = '-';

  switch (type) {
    case 'power':
    case 'led':
      displayValue = value === 1 ? 'On' : 'Off';
      break;
    case 'lock':
      displayValue = value === 1 ? 'Locked' : 'Unlocked';
      break;
    case 'delay':
      displayValue = `${value || 0}min`;
      break;
    case 'name':
      displayValue = value || '-';
      break;
    default:
      displayValue = value || '-';
  }

  return (
    <Box sx={{ textAlign: 'center', mb: 1 }}>
      <Typography 
        variant="caption" 
        sx={{
          color: '#95a5a6',
          display: 'block',
          fontSize: '0.7rem'
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="body2"
        sx={{ fontWeight: 500 }}
      >
        {displayValue}
      </Typography>
    </Box>
  );
};

const PowerPointChannel = ({ data }) => {
  return (
    <Box sx={{ 
      padding: '12px',
      borderRadius: 1.5,
      bgcolor: '#f8f9fa',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <PowerPointStatus label="Name" value={data.name} type="name" />
      <PowerPointStatus label="Power" value={data.power} type="power" />
      <PowerPointStatus label="Lock Status" value={data.lock} type="lock" />
      <PowerPointStatus label="Delay Time" value={data.delay} type="delay" />
      <PowerPointStatus label="LED Status" value={data.backLight} type="led" />
    </Box>
  );
};

const POWER_POINT = ({ devices }) => {
  const [expanded, setExpanded] = useState(true);
  
  if (!devices || devices.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Paper 
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          borderColor: 'rgba(224, 224, 224, 0.7)'
        }}
      >
        {/* 标题区域 - 与 BasicTable 一致 */}
        <Box 
          onClick={() => setExpanded(!expanded)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
            borderBottom: expanded ? '1px solid #dee2e6' : 'none',
            cursor: 'pointer',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={PowerPointIcon}
              alt="Power Point"
              style={{ width: 30, height: 30, marginRight: 12 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#fbcd0b',
              }}
            >
              Power Point
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`${devices.length} ${devices.length === 1 ? 'device' : 'devices'}`}
              size="small"
              sx={{
                bgcolor: 'rgba(251, 205, 11, 0.1)',
                color: '#fbcd0b',
                fontWeight: 500,
                mr: 1
              }}
            />
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* 可折叠的表格内容 */}
        <Collapse in={expanded}>
          <TableContainer 
            component={Box} 
            sx={{ 
              width: '100%',
              '& .MuiTable-root': {
                tableLayout: 'fixed',
                width: '100%'
              }
            }}
          >
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell 
                    width="25%" 
                    sx={{ 
                      borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                      fontWeight: 'bold',
                      padding: '12px 16px'
                    }}
                  >
                    Device
                  </TableCell>
                  <TableCell 
                    width="37.5%" 
                    align="center"
                    sx={{ 
                      borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                      fontWeight: 'bold',
                      padding: '12px 16px'
                    }}
                  >
                    Left Channel
                  </TableCell>
                  <TableCell 
                    width="37.5%" 
                    align="center"
                    sx={{ 
                      borderBottom: '1px solid rgba(224, 224, 224, 0.7)',
                      fontWeight: 'bold',
                      padding: '12px 16px'
                    }}
                  >
                    Right Channel
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {devices.map((device, deviceIndex) => {
                  const { specificAttributes } = device;
                  
                  const leftChannel = {
                    name: specificAttributes.leftName,
                    power: specificAttributes.leftPower,
                    lock: specificAttributes.leftLock,
                    delay: specificAttributes.leftDelay,
                    backLight: specificAttributes.leftBackLight
                  };

                  const rightChannel = {
                    name: specificAttributes.rightName,
                    power: specificAttributes.rightPower,
                    lock: specificAttributes.rightLock,
                    delay: specificAttributes.rightDelay,
                    backLight: specificAttributes.rightBackLight
                  };

                  return (
                    <TableRow
                      key={device.deviceId}
                      sx={{ bgcolor: 'white' }}
                    >
                      <TableCell 
                        component="th" 
                        scope="row" 
                        sx={{ 
                          padding: '16px',
                          borderBottom: deviceIndex === devices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {device.name}
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: '#95a5a6', ml: 0.5, fontWeight: 400 }}
                            >
                              - {device.deviceId}
                            </Typography>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {device.appearanceShortname}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell 
                        align="center"
                        sx={{
                          padding: '16px',
                          borderBottom: deviceIndex === devices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                        }}
                      >
                        <PowerPointChannel data={leftChannel} />
                      </TableCell>

                      <TableCell 
                        align="center"
                        sx={{
                          padding: '16px',
                          borderBottom: deviceIndex === devices.length - 1 ? 'none' : '1px solid rgba(224, 224, 224, 0.2)',
                        }}
                      >
                        <PowerPointChannel data={rightChannel} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default POWER_POINT;