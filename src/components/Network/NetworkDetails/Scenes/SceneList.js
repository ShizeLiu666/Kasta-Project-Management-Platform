import { axiosInstance, getToken } from '../../../auth';
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const SceneList = ({ networkId }) => {
    // const [scenes, setScenes] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        const fetchScenes = async () => {
            try {
                const token = getToken();
                if (!token) {
                    console.error("No token found");
                    return;
                }

                const url = '/scene/list';
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
                console.log(fullData);
                // setScenes(fullData.data.content);
            } catch (error) {
                console.error('Failed to fetch scenes:', error);
                setIsEmpty(true);
            }
        };

        if (networkId) {
            fetchScenes();
        }
    }, [networkId]);

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
                    No scenes found in this network
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Scene list will be implemented here */}
        </Box>
    );
};

export default SceneList;
