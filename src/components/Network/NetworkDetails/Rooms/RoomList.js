import React, { useState } from 'react';
import { Box, Typography, IconButton, Collapse, Paper, Chip, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNetworkRooms, useRoomDevices } from '../useNetworkQueries';
import RoomComponent from './RoomComponent';

// 使用英文常量定义楼层
const FLOOR_MAPPING = {
  '一楼': 'GROUND',
  '二楼': 'FIRST',
  '三楼': 'SECOND'
};

const FLOOR_ORDER = ['GROUND', 'FIRST', 'SECOND'];
const FLOOR_NAMES = {
  'GROUND': 'Ground Floor',
  'FIRST': 'First Floor',
  'SECOND': 'Second Floor'
};

// 添加判断图片是否有效的函数
const hasValidImage = (url) => {
  return url && url !== '' && url !== 'string';
};

const RoomList = ({ networkId }) => {
  // 为每个楼层添加展开状态管理
  const [expandedFloors, setExpandedFloors] = useState(
    FLOOR_ORDER.reduce((acc, floor) => ({ ...acc, [floor]: true }), {})
  );

  const toggleFloor = (floor) => {
    setExpandedFloors(prev => ({
      ...prev,
      [floor]: !prev[floor]
    }));
  };

  const {
    data: rooms = [],
    isLoading,
    error
  } = useNetworkRooms(networkId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading rooms...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 3 }}>
        <Typography>{error.message || 'Failed to load rooms'}</Typography>
      </Box>
    );
  }

  if (!rooms.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          color: '#666',
          backgroundColor: '#fafbfc',
          borderRadius: '12px',
          border: '1px dashed #dee2e6'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No rooms found in this network
        </Typography>
      </Box>
    );
  }

  // 修改按楼层分组的逻辑
  const roomsByFloor = rooms.reduce((acc, room) => {
    // 将中文楼层名转换为英文常量
    const floor = FLOOR_MAPPING[room.floor] || 'GROUND';
    if (!acc[floor]) {
      acc[floor] = [];
    }
    // 确保 bgUrl 是有效的
    const processedRoom = {
      ...room,
      bgUrl: hasValidImage(room.bgUrl) ? room.bgUrl : null
    };
    acc[floor].push(processedRoom);
    return acc;
  }, {});

  return (
    <Box>
      {FLOOR_ORDER.map((floor) => {
        const floorRooms = roomsByFloor[floor] || [];
        if (floorRooms.length === 0) return null;

        return (
          <Paper
            key={floor}
            elevation={0}
            variant="outlined"
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden',
              borderColor: 'rgba(224, 224, 224, 0.7)'
            }}
          >
            {/* 楼层标题栏 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderBottom: expandedFloors[floor] ? '1px solid rgba(224, 224, 224, 0.7)' : 'none'
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#fbcd0b',
                  fontWeight: 600
                }}
              >
                {FLOOR_NAMES[floor]}
              </Typography>
              
              <Box sx={{ flex: 1 }} />
              
              <Chip
                label={`${floorRooms.length} ${floorRooms.length === 1 ? 'Room' : 'Rooms'}`}
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
                  toggleFloor(floor);
                }}
              >
                {expandedFloors[floor] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            {/* 可折叠的房间内容 */}
            <Collapse in={expandedFloors[floor]}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {floorRooms.map((room) => (
                    <RoomItem key={room.roomId} room={room} networkId={networkId} />
                  ))}
                </Box>
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
};

// RoomItem 组件需要修改
const RoomItem = ({ room, networkId }) => {
  const {
    data: devices = [],
    isLoading: isLoadingDevices
  } = useRoomDevices(networkId, room.roomId);

  if (isLoadingDevices) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>
          Loading room devices...
          <Tooltip title={`Room ID: ${room.roomId || ''} | RID: ${room.rid || room.roomId || ''}`}>
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: '#95a5a6',
                ml: 1,
                fontWeight: 400,
                cursor: 'pointer',
                textDecoration: 'underline dotted',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 120,
                verticalAlign: 'middle',
                display: 'inline-block'
              }}
            >
              {`- ${room.roomId} | ${room.rid || room.roomId}`}
            </Typography>
          </Tooltip>
        </Typography>
      </Box>
    );
  }

  return <RoomComponent room={room} devices={devices} />;
};

export default RoomList;