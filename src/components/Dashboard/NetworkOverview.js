import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import GroupIconMUI from '@mui/icons-material/Group';
import { motion } from 'framer-motion';
// import NetworkIcon from '../../assets/icons/NetworkOverview/Network.png';
import DeviceIcon from '../../assets/icons/NetworkOverview/Device.png';
import GroupIcon from '../../assets/icons/NetworkOverview/Group.png';
import SceneIcon from '../../assets/icons/NetworkOverview/Scene.png';
import RoomIcon from '../../assets/icons/NetworkOverview/Room.png';
import TimerIcon from '../../assets/icons/NetworkOverview/Timer.png';
import ScheduleIcon from '../../assets/icons/NetworkOverview/Schedule.png';

const NetworkOverview = () => {
  // 使用模拟数据
  const mockNetworkStats = {
    totalNetworks: 5,
    totalDevices: 25,
    totalMembers: 8,
    totalGroups: 6,
    totalScenes: 4,
    totalRooms: 3,
    totalTimers: 5,
    totalSchedules: 2,
    currentNetwork: {
      meshName: "Home Network"
    }
  };

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
        Network Overview
      </Typography>
      
      {mockNetworkStats.currentNetwork && (
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
          Current Network: {mockNetworkStats.currentNetwork.meshName}
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
            value={mockNetworkStats.totalMembers}
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
            value={mockNetworkStats.totalDevices}
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
            value={mockNetworkStats.totalGroups}
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
            value={mockNetworkStats.totalScenes}
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
            value={mockNetworkStats.totalRooms}
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
            value={mockNetworkStats.totalTimers}
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
            value={mockNetworkStats.totalSchedules}
            color="#FAEBD7"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NetworkOverview;