import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { axiosInstance, getToken } from '../auth';
import GroupIconMUI from '@mui/icons-material/Group';
import { motion } from 'framer-motion';
import NetworkIcon from '../../assets/icons/NetworkOverview/Network.png';
import DeviceIcon from '../../assets/icons/NetworkOverview/Device.png';
import GroupIcon from '../../assets/icons/NetworkOverview/Group.png';
import SceneIcon from '../../assets/icons/NetworkOverview/Scene.png';

const NetworkOverview = () => {
  const [networkStats, setNetworkStats] = useState({
    totalNetworks: 0,
    totalDevices: 0,
    totalMembers: 0,
    totalGroups: 0,
    totalScenes: 0,
    totalRooms: 0,
    totalTimers: 0,
    totalSchedules: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNetworkStats = async () => {
      try {
        const token = getToken();
        const [networksResponse, currentNetworkResponse] = await Promise.all([
          axiosInstance.get('/networks/list', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axiosInstance.get('/networks/current', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (currentNetworkResponse.data.success && currentNetworkResponse.data.data) {
          const currentNetwork = currentNetworkResponse.data.data;
          
          // 获取当前网络的设备、分组和场景数量
          const [devicesResponse, groupsResponse, scenesResponse] = await Promise.all([
            axiosInstance.post('/devices/list', {
              networkId: currentNetwork.networkId,
              page: 1,
              size: 1
            }, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axiosInstance.get(`/networks/${currentNetwork.networkId}/groups`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axiosInstance.get(`/networks/${currentNetwork.networkId}/scenes`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);

          setNetworkStats({
            totalNetworks: networksResponse.data.data.length,
            totalDevices: devicesResponse.data.data.totalElements || 0,
            totalGroups: groupsResponse.data.data.length || 0,
            totalScenes: scenesResponse.data.data.length || 0,
            currentNetwork: currentNetwork
          });
        }
      } catch (error) {
        console.error('Error fetching network stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkStats();
  }, []);

  const StatCard = ({ icon, title, value, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: '12px',
            backgroundColor: `${color}20`,
            color: color
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );

  if (loading) {
    return <Box p={3}>Loading...</Box>;
  }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Network Overview
      </Typography>
      
      {networkStats.currentNetwork && (
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Current Network: {networkStats.currentNetwork.meshName}
        </Typography>
      )}

      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={
              <img 
                src={NetworkIcon} 
                alt="Network" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'block'
                }} 
              />
            }
            title="Total Networks"
            value={networkStats.totalNetworks}
            color="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<GroupIconMUI fontSize="large" />}
            title="Network Members"
            value={networkStats.totalMembers}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={
              <img 
                src={DeviceIcon} 
                alt="Device" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'block'
                }} 
              />
            }
            title="Connected Devices"
            value={networkStats.totalDevices}
            color="#fbcd0b"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={
              <img 
                src={GroupIcon} 
                alt="Group" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'block'
                }} 
              />
            }
            title="Groups"
            value={networkStats.totalGroups}
            color="#009688"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={
              <img 
                src={SceneIcon} 
                alt="Scene" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'block'
                }} 
              />
            }
            title="Scenes"
            value={networkStats.totalScenes}
            color="#9C27B0"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={
              <Box 
                sx={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'block',
                  backgroundColor: '#1976D2',
                  borderRadius: '4px'
                }} 
              />
            }
            title="Rooms"
            value={networkStats.totalRooms}
            color="#1976D2"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={
              <Box 
                sx={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'block',
                  backgroundColor: '#FF5722',
                  borderRadius: '4px'
                }} 
              />
            }
            title="Timers"
            value={networkStats.totalTimers}
            color="#FF5722"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={
              <Box 
                sx={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'block',
                  backgroundColor: '#607D8B',
                  borderRadius: '4px'
                }} 
              />
            }
            title="Schedules"
            value={networkStats.totalSchedules}
            color="#607D8B"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NetworkOverview;