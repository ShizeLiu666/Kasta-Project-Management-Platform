import { axiosInstance, getToken } from '../../../auth';
import React, { useEffect, useState } from 'react';
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

const TimerList = ({ networkId }) => {
    const [timers, setTimers] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTimers = async () => {
            try {
                setIsLoading(true);
                const token = getToken();
                if (!token) {
                    console.error("No token found");
                    setIsEmpty(true);
                    return;
                }

                const url = '/timers/list';
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
                setTimers(fullData.data.content);
                setIsEmpty(false);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch timers:', error);
                setIsEmpty(true);
                setIsLoading(false);
            }
        };

        if (networkId) {
            fetchTimers();
        }
    }, [networkId]);

    const formatTime = (hour, min, second) => {
        return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    };

    const formatAction = (action) => {
        switch (action) {
            case 0: return 'OFF';
            case 1: return 'ON';
            default: return '-';
        }
    };

    const formatEntityType = (type) => {
        switch (type) {
            case 0: return 'Device';
            case 1: return 'Group';
            default: return '-';
        }
    };

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
                    No timers found in this network
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
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
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Timer Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Time</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Action</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Target ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timers.map((timer) => (
                            <TableRow
                                key={timer.timerId}
                                sx={{
                                    '&:hover': { backgroundColor: '#f8f9fa' }
                                }}
                            >
                                <TableCell>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {timer.name}
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            sx={{
                                                color: '#95a5a6',
                                                ml: 0.5,
                                                fontWeight: 400
                                            }}
                                        >
                                            - {timer.timerId}
                                        </Typography>
                                    </Typography>
                                </TableCell>
                                <TableCell>{formatTime(timer.hour, timer.min, timer.second)}</TableCell>
                                <TableCell>{formatAction(timer.action)}</TableCell>
                                <TableCell>{formatEntityType(timer.entityType)}</TableCell>
                                <TableCell>{timer.entityType === 0 ? timer.deviceId : timer.groupId}</TableCell>
                                <TableCell>{timer.enable === 1 ? 'Enabled' : 'Disabled'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TimerList;