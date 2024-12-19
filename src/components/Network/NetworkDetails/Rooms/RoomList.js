import { axiosInstance, getToken } from '../../../auth';
import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

const RoomList = ({ networkId }) => {
    const [rooms, setRooms] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [roomDevices, setRoomDevices] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchDevicesInRoom = useCallback(async (roomId) => {
        try {
            const token = getToken();
            if (!token) {
                console.error("No token found");
                return;
            }

            const response = await axiosInstance.post('/rooms/list', {
                roomId: roomId,
                networkId: networkId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // 添加日志来检查响应数据
            console.log(`Room ${roomId} devices response:`, response.data);

            if (response.data.success) {
                // 确保设置的是数组数据
                const devices = Array.isArray(response.data.data) ? response.data.data : [];
                setRoomDevices(prev => ({
                    ...prev,
                    [roomId]: devices
                }));
            }
        } catch (error) {
            console.error(`Failed to fetch devices for room ${roomId}:`, error);
            // 确保在错误时设置空数组
            setRoomDevices(prev => ({
                ...prev,
                [roomId]: []
            }));
        }
    }, [networkId]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setIsLoading(true);
                const token = getToken();
                if (!token) {
                    console.error("No token found");
                    setIsEmpty(true);
                    return;
                }

                const url = '/rooms/list';
                const initialResponse = await axiosInstance.post(url, {
                    page: 1,
                    size: 1,
                    networkId: networkId
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const initialData = initialResponse.data;
                const totalSize = initialData.data.totalElements;

                if (totalSize === 0) {
                    setIsEmpty(true);
                    setIsLoading(false);
                    return;
                }

                const fullResponse = await axiosInstance.post(url, {
                    page: 1,
                    size: totalSize,
                    networkId: networkId
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const fullData = fullResponse.data;
                const rooms = fullData.data.content;
                setRooms(rooms);

                // 为每个房间获取设备
                rooms.forEach(room => {
                    fetchDevicesInRoom(room.roomId);
                });
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
                setIsEmpty(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (networkId) {
            fetchRooms();
        }
    }, [networkId, fetchDevicesInRoom]);

    if (isLoading) {
        return null;
    }

    if (isEmpty) {
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

    return (
        <Box>
            {rooms.map((room) => (
                <Box key={room.roomId} sx={{ mb: 4 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                        pl: 0
                    }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 500,
                                color: '#fbcd0b',
                                mb: 0.5,
                                ml: 0.5
                            }}
                        >
                            {room.name}
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                    color: '#95a5a6',
                                    ml: 0.5,
                                    fontWeight: 400
                                }}
                            >
                                - {room.roomId}
                            </Typography>
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                ml: 0.5,
                                color: 'text.secondary'
                            }}
                        >
                            ({roomDevices[room.roomId]?.length || 0} {(roomDevices[room.roomId]?.length || 0) === 1 ? 'device' : 'devices'})
                        </Typography>
                    </Box>

                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: 'none',
                            border: '1px solid #dee2e6',
                            borderRadius: '8px',
                            width: '100%'
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
                                        Device Name
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* 添加检查确保 roomDevices[room.roomId] 是数组 */}
                                {Array.isArray(roomDevices[room.roomId]) && roomDevices[room.roomId].map((device) => (
                                    <TableRow
                                        key={device.deviceId}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { backgroundColor: '#f8f9fa' }
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                overflow: 'hidden',
                                                maxWidth: '100%'
                                            }}>
                                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 600,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {device.name}
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            sx={{
                                                                color: '#95a5a6',
                                                                ml: 0.5,
                                                                fontWeight: 400
                                                            }}
                                                        >
                                                            - {device.deviceId}
                                                        </Typography>
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {device.appearanceShortname}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ))}
        </Box>
    );
};

export default RoomList;