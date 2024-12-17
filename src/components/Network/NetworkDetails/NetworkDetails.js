import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import NetworkMember from './NetworkMember';
import DeviceList from './Devices/DeviceList';
import GroupList from './Groups/GroupList';

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
          <Tab label="Room" />
          <Tab label="Scene" />
          <Tab label="Timer" />
          <Tab label="Schedule" />
        </Tabs>
      </Box>

      <Box sx={{ p: 2 }}>
        {selectedTab === 0 && <NetworkMember networkId={network.networkId} />}
        {selectedTab === 1 && <DeviceList networkId={network.networkId} />}
        {selectedTab === 2 && <GroupList networkId={network.networkId} />}
        {selectedTab === 3 && <div>Rooms Coming Soon...</div>}
        {selectedTab === 4 && <div>Scenes Coming Soon...</div>}
        {selectedTab === 5 && <div>Timers Coming Soon...</div>}
        {selectedTab === 6 && <div>Schedules Coming Soon...</div>}
      </Box>
    </>
  );
};

export default NetworkDetails;