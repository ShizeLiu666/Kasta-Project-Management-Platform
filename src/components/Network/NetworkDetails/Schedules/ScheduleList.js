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

const ScheduleList = ({ networkId }) => {
    const [schedules, setSchedules] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setIsLoading(true);
                const token = getToken();
                if (!token) {
                    console.error("No token found");
                    setIsEmpty(true);
                    return;
                }

                const url = '/schedule/list';
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
                setSchedules(fullData.data.content);
                setIsEmpty(false);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch schedules:', error);
                setIsEmpty(true);
                setIsLoading(false);
            }
        };

        if (networkId) {
            fetchSchedules();
        }
    }, [networkId]);

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
                    No schedules found in this network
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
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Schedule Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Schedule ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Sort Order</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>Icon</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schedules.map((schedule) => (
                            <TableRow
                                key={schedule.scheduleId}
                                sx={{
                                    '&:hover': { backgroundColor: '#f8f9fa' }
                                }}
                            >
                                <TableCell>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {schedule.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#95a5a6'
                                        }}
                                    >
                                        {schedule.scheduleId}
                                    </Typography>
                                </TableCell>
                                <TableCell>{schedule.sortOrder}</TableCell>
                                <TableCell>
                                    {schedule.iconUrl && (
                                        <Box
                                            component="img"
                                            src={schedule.iconUrl}
                                            alt={schedule.name}
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                objectFit: 'contain'
                                            }}
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ScheduleList;
