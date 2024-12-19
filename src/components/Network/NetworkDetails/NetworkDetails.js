import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import NetworkMember from './NetworkMember';
import DeviceList from './Devices/DeviceList';
import GroupList from './Groups/GroupList';
import SceneList from './Scenes/SceneList';
import RoomList from './Rooms/RoomList';
import TimerList from './Timers/TimerList';
import ScheduleList from './Schedules/ScheduleList';

const NetworkDetails = ({ network }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#fbcd0b'
            }
          }}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent'
              },
              '&.Mui-selected': {
                color: '#fbcd0b'
              }
            },
            '& .MuiTouchRipple-root': {
              display: 'none'
            }
          }}
        >
          <Tab label="Network Member" />
          <Tab label="Device" />
          <Tab label="Group" />
          <Tab label="Scene" />
          <Tab label="Room" />
          <Tab label="Timer" />
          <Tab label="Schedule" />
        </Tabs>
      </Box>

      <Box sx={{ p: 2 }}>
        {selectedTab === 0 && <NetworkMember networkId={network.networkId} />}
        {selectedTab === 1 && <DeviceList networkId={network.networkId} />}
        {selectedTab === 2 && <GroupList networkId={network.networkId} />}
        {selectedTab === 3 && <SceneList networkId={network.networkId} />}
        {selectedTab === 4 && <RoomList networkId={network.networkId} />}
        {selectedTab === 5 && <TimerList networkId={network.networkId} />}
        {selectedTab === 6 && <ScheduleList networkId={network.networkId} />}
      </Box>
    </>
  );
};

export default NetworkDetails;