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
  Typography,
  IconButton,
  Collapse
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const formatDeviceSettings = (content) => {
  if (content.deviceType && content.deviceType.includes("PowerPoint Type")) {
    if (content.deviceType.includes("Single-Way")) {
      const statusText = content.statusConditions.status === 2 ? 'ON' : 'OFF';
      return `Status: ${statusText}`;
    } else {
      const mapStatusToText = (status) => {
        switch (status) {
          case 2: return 'ON';
          case 1: return 'OFF';
          case 0: return 'UNSELECT';
          default: return 'OFF';
        }
      };
      
      return `Left: ${mapStatusToText(content.statusConditions.leftStatus)}, Right: ${mapStatusToText(content.statusConditions.rightStatus)}`;
    }
  }

  if (content.statusConditions) {
    if (content.statusConditions.level !== undefined) { 
      return `Level: ${content.statusConditions.level}`;
    }
    if (content.statusConditions.speed !== undefined) {
      const speedMapping = {
        0: 'LOW',
        1: 'MEDIUM',
        2: 'HIGH'
      };
      const speedText = speedMapping[content.statusConditions.speed] || 'LOW';
      return `Speed: ${speedText}, Relay: ${content.statusConditions.relay ? 'ON' : 'OFF'}`;
    }
    if (content.statusConditions.position !== undefined) {
      return `Position: ${content.statusConditions.position}`;
    }
    return content.status ? 'ON' : 'OFF';
  }

  return content.status ? 'ON' : 'OFF';
};

const SceneTable = ({ scenes }) => {
  const [isTableExpanded, setIsTableExpanded] = useState(true);

  if (!scenes || scenes.length === 0) {
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
            backgroundColor: '#9C27B0',
            marginRight: '12px',
            borderRadius: '4px'
          }
        }}
      >
        Scene Configuration
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
                  Scene Name
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: '#f8f9fa',
                    width: '35%'
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
                  Device Settings
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scenes.map((scene, sceneIndex) => (
                <React.Fragment key={sceneIndex}>
                  {/* 如果不是第一个场景，添加空行 */}
                  {sceneIndex > 0 && (
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
                  {/* 渲染场景的设备 */}
                  {scene.contents.map((content, contentIndex) => (
                    <TableRow
                      key={`${sceneIndex}-${contentIndex}`}
                      sx={{
                        backgroundColor: '#fff',
                      }}
                    >
                      <TableCell 
                        sx={{ 
                          fontWeight: contentIndex === 0 ? 'bold' : 'normal',
                          verticalAlign: 'top',
                          ...(contentIndex !== 0 && { border: 'none' })
                        }}
                      >
                        {contentIndex === 0 ? `${scene.sceneName} (${scene.contents.length})` : ''}
                      </TableCell>
                      <TableCell>
                        {content.deviceName || content.name}
                      </TableCell>
                      <TableCell>
                        {formatDeviceSettings(content)}
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

export default SceneTable;