import React, { useState } from 'react';
import { 
  Box, Typography, Chip, Grid, Stack, Paper, 
  Collapse, IconButton, Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNetworkScenes, useSceneDevices, useNetworkGroups, useGroupDevices } from '../useNetworkQueries';
import SceneDeviceCard from './SceneDeviceCard';

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
      {scenes.map((scene) => (
        <SceneItem key={scene.sceneId} scene={scene} networkId={networkId} />
      ))}
    </Box>
  );
};

const SceneItem = ({ scene, networkId }) => {
  const [expanded, setExpanded] = useState(true);
  
  // 获取场景项目和网络中的所有组
  const { data: sceneItems = [], isLoading: isLoadingSceneItems } = useSceneDevices(networkId, scene.sceneId);
  const { data: allGroups = [], isLoading: isLoadingGroups } = useNetworkGroups(networkId);
  
  // 创建组映射，用于根据组ID查找组名
  const groupsMap = React.useMemo(() => {
    return allGroups.reduce((acc, group) => {
      acc[group.groupId] = group;
      return acc;
    }, {});
  }, [allGroups]);
  
  // 处理场景项目 - 区分直接绑定的设备和通过组绑定的设备
  const processedItems = React.useMemo(() => {
    const directDevices = [];
    const groupsWithDevices = [];
    
    sceneItems.forEach(item => {
      if (item.entityType === 0) {
        // 直接绑定的设备
        const deviceInfo = {
          ...item,
          productType: item.productType,
          deviceId: item.deviceId,
          name: item.deviceId,
          specificAttributes: item.attributes || {}
        };
        directDevices.push(deviceInfo);
      } else if (item.entityType === 1) {
        // 通过组绑定 - 我们需要获取组内的设备
        const groupInfo = groupsMap[item.groupId];
        if (groupInfo) {
          groupsWithDevices.push({
            ...groupInfo,
            sceneAttributes: item.attributes || {}
          });
        }
      }
    });
    
    return {
      directDevices,
      groupsWithDevices
    };
  }, [sceneItems, groupsMap]);

  const isLoading = isLoadingSceneItems || isLoadingGroups;

  if (isLoading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Paper 
          elevation={0}
          variant="outlined"
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            borderColor: 'rgba(224, 224, 224, 0.7)'
          }}
        >
          <Box sx={{
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {scene.name}
              <Tooltip title={`Scene ID: ${scene.sceneId || ''} | SID: ${scene.sid || scene.sceneId || ''}`}>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: '#95a5a6',
                    ml: 1,
                    fontWeight: 400,
                    cursor: 'pointer',
                    textDecoration: 'underline dotted',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 120,
                    verticalAlign: 'middle',
                    display: 'inline-block'
                  }}
                >
                  {`- ${scene.sceneId} | ${scene.sid || scene.sceneId}`}
                </Typography>
              </Tooltip>
            </Typography>
          </Box>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Loading scene details...</Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  const totalDeviceCount = processedItems.directDevices.length;
  const totalGroupCount = processedItems.groupsWithDevices.length;

  return (
    <Box sx={{ mb: 4 }}>
      <Paper 
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          borderColor: 'rgba(224, 224, 224, 0.7)'
        }}
      >
        {/* 标题区域 */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
            borderBottom: expanded ? '1px solid rgba(224, 224, 224, 0.7)' : 'none',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {scene.name}
              <Tooltip title={`Scene ID: ${scene.sceneId || ''} | SID: ${scene.sid || scene.sceneId || ''}`}>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: '#95a5a6',
                    ml: 1,
                    fontWeight: 400,
                    cursor: 'pointer',
                    textDecoration: 'underline dotted',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 120,
                    verticalAlign: 'middle',
                    display: 'inline-block'
                  }}
                >
                  {`- ${scene.sceneId} | ${scene.sid || scene.sceneId}`}
                </Typography>
              </Tooltip>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} sx={{ mr: 1 }}>
              {totalDeviceCount > 0 && (
                <Chip 
                  label={`Devices (${totalDeviceCount})`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(251, 205, 11, 0.1)',
                    color: '#fbcd0b'
                  }}
                />
              )}
              {totalGroupCount > 0 && (
                <Chip 
                  label={`Groups (${totalGroupCount})`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(0, 150, 136, 0.1)',
                    color: '#009688'
                  }}
                />
              )}
            </Stack>
            <IconButton 
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>
        
        {/* 可折叠内容区域 */}
        <Collapse in={expanded}>
          <Box sx={{ p: 2 }}>
            {/* 如果没有设备或组，显示空消息 */}
            {!totalDeviceCount && !totalGroupCount ? (
              <Typography align="center" py={2} color="text.secondary">
                No devices or groups in this scene
              </Typography>
            ) : (
              <Box>
                {/* 直接绑定的设备区域 */}
                {processedItems.directDevices.length > 0 && (
                  <Box sx={{ mb: processedItems.groupsWithDevices.length > 0 ? 3 : 0 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600,
                        color: '#fbcd0b',
                        pl: 1,
                        borderLeft: '3px solid #fbcd0b'
                      }}
                    >
                      Direct Devices
                    </Typography>
                    <Grid container spacing={2}>
                      {processedItems.directDevices.map((device) => (
                        <Grid item key={device.deviceId} xs={12} sm={6} md={3} lg={2}>
                          <SceneDeviceCard device={device} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
                
                {/* 通过组绑定的设备区域 */}
                {processedItems.groupsWithDevices.length > 0 && (
                  <Box>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600,
                        color: '#009688',
                        pl: 1,
                        borderLeft: '3px solid #009688'
                      }}
                    >
                      Groups & Devices
                    </Typography>
                    {processedItems.groupsWithDevices.map((group) => (
                      <GroupWithDevices 
                        key={group.groupId} 
                        group={group} 
                        networkId={networkId}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

// 新组件：显示组和组内设备
const GroupWithDevices = ({ group, networkId }) => {
  const { data: groupDevices = [], isLoading } = useGroupDevices(networkId, group.groupId);
  
  if (isLoading) {
    return (
      <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Typography>Loading group devices...</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ mb: 2, p: 2 }}>
      {/* 组标题 */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <img 
          src={require('../../../../assets/icons/NetworkOverview/Group.png')}
          alt="Group"
          style={{ width: 24, height: 24, marginRight: 8 }}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#009688' }}>
          {group.name}
          <Typography component="span" variant="caption" sx={{ ml: 1, color: '#95a5a6' }}>
            ({groupDevices.length} device{groupDevices.length !== 1 ? 's' : ''})
          </Typography>
        </Typography>
      </Box>
      
      {/* 组内设备 */}
      {groupDevices.length > 0 ? (
        <Grid container spacing={2}>
          {groupDevices.map((device) => (
            <Grid item key={device.deviceId} xs={12} sm={6} md={3} lg={2}>
              <SceneDeviceCard device={device} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary" align="center">
          No devices in this group
        </Typography>
      )}
    </Box>
  );
};

export default SceneList;
