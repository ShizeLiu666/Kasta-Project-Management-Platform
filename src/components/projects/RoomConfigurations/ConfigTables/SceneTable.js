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

const formatDeviceSettings = (content) => {
  if (content.deviceType && content.deviceType.includes("PowerPoint Type")) {
    if (content.deviceType.includes("Single-Way")) {
      return `Status: ${content.status}`;
    } else {
      return `Left: ${content.leftStatus}, Right: ${content.rightStatus}`;
    }
  }

  if (content.statusConditions) {
    if (content.statusConditions.level !== undefined) {
      return `Level: ${content.statusConditions.level}`;
    }
    if (content.statusConditions.speed !== undefined) {
      return `Speed: ${content.statusConditions.speed}, Relay: ${content.statusConditions.relay ? 'ON' : 'OFF'}`;
    }
    if (content.statusConditions.position !== undefined) {
      return `Position: ${content.statusConditions.position}`;
    }
    return content.status ? 'ON' : 'OFF';
  }

  return content.status ? 'ON' : 'OFF';
};

const SceneTable = ({ scenes }) => {
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
    </Box>
  );
};

export default SceneTable;