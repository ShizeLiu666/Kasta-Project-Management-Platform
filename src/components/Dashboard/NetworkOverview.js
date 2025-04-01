import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import GroupIconMUI from '@mui/icons-material/Group';
import { motion } from 'framer-motion';
import axiosInstance from '../../config';
import { getToken } from '../auth/auth';
// import NetworkIcon from '../../assets/icons/NetworkOverview/Network.png';
import DeviceIcon from '../../assets/icons/NetworkOverview/Device.png';
import GroupIcon from '../../assets/icons/NetworkOverview/Group.png';
import SceneIcon from '../../assets/icons/NetworkOverview/Scene.png';
import RoomIcon from '../../assets/icons/NetworkOverview/Room.png';
import TimerIcon from '../../assets/icons/NetworkOverview/Timer.png';
import ScheduleIcon from '../../assets/icons/NetworkOverview/Schedule.png';

const NetworkOverview = () => {
  const [networkStats, setNetworkStats] = useState(null);

  useEffect(() => {
    const fetchPrimaryNetwork = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await axiosInstance.get('/networks/primary-network', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setNetworkStats({
            deviceCount: response.data.data.deviceCount || 0,
            groupCount: response.data.data.groupCount || 0,
            roomCount: response.data.data.roomCount || 0,
            sceneCount: response.data.data.sceneCount || 0,
            timerCount: response.data.data.timerCount || 0,
            scheduleCount: response.data.data.scheduleCount || 0,
            memberCount: response.data.data.memberCount || 0,
            networkId: response.data.data.networkId
          });
        } else {
          // 如果没有 primary network，尝试获取所有网络并设置第一个为 primary
          const networksResponse = await axiosInstance.get('/networks', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (networksResponse.data.success && networksResponse.data.data.length > 0) {
            const firstNetwork = networksResponse.data.data[0];
            // 设置第一个网络为 primary network
            await axiosInstance.post(
              `/networks/${firstNetwork.networkId}/set-primary-network`,
              null,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            // 重新获取 primary network 数据
            fetchPrimaryNetwork();
          } else {
            setNetworkStats(null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch network stats:', error);
        setNetworkStats(null);
      }
    };

    fetchPrimaryNetwork();
  }, []);

  // 如果没有数据，显示空状态
  if (!networkStats) {
    return (
      <Box p={1.5}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: '#2c3e50', 
            fontSize: '1rem',
            mb: 0.5
          }}
        >
          Primary Network Overview
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#95a5a6',
            fontSize: '0.875rem'
          }}
        >
          No network available
        </Typography>
      </Box>
    );
  }

  const StatCard = ({ icon, title, value, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '0.1rem',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: '10px',
            backgroundColor: `${color}20`,
            color: color
          }}
        >
          {React.cloneElement(icon, {
            style: {
              width: '24px',
              height: '24px',
              display: 'block'
            }
          })}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
            {title}
          </Typography>
          <Typography variant="h6" fontWeight="bold" fontSize="1.1rem">
            {value}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );

  return (
    <Box p={1.5}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          color: '#2c3e50', 
          fontSize: '1rem',
          mb: 0.5
        }}
      >
        Primary Network Overview
      </Typography>
      
      {networkStats && (
        <Typography 
          variant="subtitle2"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            color: '#2c3e50',
            letterSpacing: '0.5px',
            fontSize: '0.7rem'
          }}
        >
          Current Network: {networkStats.networkId}
        </Typography>
      )}

      <Grid container spacing={2} mt={0.5}>
        {/* <Grid item xs={12} md={4}>
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
            value={mockNetworkStats.totalNetworks}
            color="#3f51b5"
          />
        </Grid> */}
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<GroupIconMUI fontSize="large" />}
            title="Members"
            value={networkStats.memberCount}
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
            title="Devices"
            value={networkStats.deviceCount}
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
            value={networkStats.groupCount}
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
            value={networkStats.sceneCount}
            color="#9C27B0"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={
              <img
                src={RoomIcon} 
                alt="Room" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'block'
                }} 
              />
            }
            title="Rooms"
            value={networkStats.roomCount}
            color="#1976D2"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={
              <img
                src={TimerIcon} 
                alt="Timer" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'block'
                }} 
              />
            }
            title="Timers"
            value={networkStats.timerCount}
            color="#E91E63"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={
              <img
                src={ScheduleIcon} 
                alt="Schedule" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  display: 'block'
                }} 
              />
            }
            title="Schedules"
            value={networkStats.scheduleCount}
            color="#FAEBD7"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NetworkOverview;