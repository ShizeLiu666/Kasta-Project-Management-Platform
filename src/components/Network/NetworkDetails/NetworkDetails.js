import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Fade from '@mui/material/Fade';
import NetworkMember from './NetworkMember';
import DeviceList from './Devices/DeviceList';
import GroupList from './Groups/GroupList';
import SceneList from './Scenes/SceneList';
import RoomList from './Rooms/RoomList';
import TimerList from './Timers/TimerList';
import ScheduleList from './Schedules/ScheduleList';
import { useParams } from 'react-router-dom';

const NetworkDetails = ({ network }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const { tab } = useParams(); // 获取 URL 参数

  // 根据 URL 参数设置选中的 tab
  useEffect(() => {
    const tabMap = {
      'member': 0,
      'device': 1,
      'group': 2,
      'scene': 3,
      'room': 4,
      'timer': 5,
      'schedule': 6
    };
    
    if (tab && tabMap[tab] !== undefined) {
      setSelectedTab(tabMap[tab]);
    }
  }, [tab]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const renderTabContent = () => {
    const networkId = network.networkId;
    switch (selectedTab) {
      case 0:
        return <NetworkMember networkId={networkId} />;
      case 1:
        return <DeviceList networkId={networkId} />;
      case 2:
        return <GroupList networkId={networkId} />;
      case 3:
        return <SceneList networkId={networkId} />;
      case 4:
        return <RoomList networkId={networkId} />;
      case 5:
        return <TimerList networkId={networkId} />;
      case 6:
        return <ScheduleList networkId={networkId} />;
      default:
        return null;
    }
  };

  return (
    <Fade in={true} timeout={300}>
      <Box>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          mb: 1
        }}>
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
                },
                '& .MuiTouchRipple-root': {
                  display: 'none'
                }
              }
            }}
          >
            {[
              "Member",
              "Device",
              "Group",
              "Scene",
              "Room",
              "Timer",
              "Schedule"
            ].map((label, index) => (
              <Tab 
                key={label}
                label={label}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: 2, position: 'relative', minHeight: '200px' }}>
          <Box>
            {renderTabContent()}
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default NetworkDetails;