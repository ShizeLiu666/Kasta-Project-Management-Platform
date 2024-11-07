import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import NetworkMember from './NetworkMember';

const NetworkDetails = ({ network }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // 临时的占位组件
  const PlaceholderComponent = ({ title }) => (
    <div>
      <h3>{title}</h3>
      <p>Coming soon...</p>
    </div>
  );

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
              backgroundColor: '#fbcd0b'  // 修改底部指示器颜色
            }
          }}
          sx={{
            '& .MuiTab-root': {  // 修改所有 Tab 的样式
              textTransform: 'none',  // 防止大写
              '&:hover': {
                backgroundColor: 'transparent'  // 移除悬停效果
              },
              '&.Mui-selected': {
                color: '#fbcd0b'  // 选中时的文字颜色
              }
            },
            '& .MuiTouchRipple-root': {  // 移除点击涟漪效果
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
        {selectedTab === 1 && <PlaceholderComponent title="Devices" />}
        {selectedTab === 2 && <PlaceholderComponent title="Groups" />}
        {selectedTab === 3 && <PlaceholderComponent title="Room" />}
        {selectedTab === 4 && <PlaceholderComponent title="Scene" />}
        {selectedTab === 5 && <PlaceholderComponent title="Timer" />}
        {selectedTab === 6 && <PlaceholderComponent title="Schedule" />}
      </Box>
    </>
  );
};

export default NetworkDetails;