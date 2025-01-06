import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNetworkScenes } from '../useNetworkQueries';

const SceneList = ({ networkId }) => {
  const { 
    data: scenes = [], 
    isLoading, 
    error 
  } = useNetworkScenes(networkId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading scenes...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 3 }}>
        <Typography>{error.message || 'Failed to load scenes'}</Typography>
      </Box>
    );
  }

  if (!scenes.length) {
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
      {/* Scene list implementation will go here */}
      {scenes.map(scene => (
        <Box key={scene.sceneId}>
          <Typography>{scene.name}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SceneList;
