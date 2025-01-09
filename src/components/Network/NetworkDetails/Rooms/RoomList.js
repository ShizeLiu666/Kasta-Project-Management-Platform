import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useNetworkRooms, useRoomDevices } from '../useNetworkQueries';
import RoomComponent from './RoomComponent';

// 楼层顺序和显示名称映射
const FLOOR_ORDER = ['GROUND', 'FIRST', 'SECOND'];
const FLOOR_NAMES = {
  GROUND: 'Ground Floor',
  FIRST: 'First Floor',
  SECOND: 'Second Floor'
};

const RoomList = ({ networkId }) => {
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

  // 按楼层分组房间
  const roomsByFloor = rooms.reduce((acc, room) => {
    const floor = room.floor || 'GROUND'; // 默认为地面层
    if (!acc[floor]) {
      acc[floor] = [];
    }
    acc[floor].push(room);
    return acc;
  }, {});

  return (
    <Box>
      {FLOOR_ORDER.map((floor) => {
        const floorRooms = roomsByFloor[floor] || [];
        if (floorRooms.length === 0) return null;

        return (
          <Box key={floor} sx={{ mb: 4 }}>
            {/* 楼层标题 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                gap: 2
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#fbcd0b',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {FLOOR_NAMES[floor]}
              </Typography>
              <Divider sx={{ flex: 1 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 'fit-content' }}
              >
                {floorRooms.length} {floorRooms.length === 1 ? 'room' : 'rooms'}
              </Typography>
            </Box>

            {/* 该楼层的房间列表 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {floorRooms.map((room) => (
                <RoomItem key={room.roomId} room={room} networkId={networkId} />
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

// RoomItem 组件保持不变
const RoomItem = ({ room, networkId }) => {
  const {
    data: devices = [],
    isLoading: isLoadingDevices
  } = useRoomDevices(networkId, room.roomId);

  if (isLoadingDevices) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading room devices...</Typography>
      </Box>
    );
  }

  return <RoomComponent room={room} devices={devices} />;
};

export default RoomList;