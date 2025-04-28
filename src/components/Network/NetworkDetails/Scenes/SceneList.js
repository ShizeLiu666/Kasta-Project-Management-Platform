import React, { useState } from 'react';
import { 
  Box, Typography, Chip, Grid, Stack, Paper, 
  Collapse, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNetworkScenes, useSceneDevices, useNetworkGroups } from '../useNetworkQueries';
import SceneDeviceCard from './SceneDeviceCard';
import SceneGroupCard from './SceneGroupCard';

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
  
  // 将场景项目分为设备和组
  const itemStats = React.useMemo(() => {
    return sceneItems.reduce((acc, item) => {
      if (item.entityType === 0) {
        // 设备
        const deviceInfo = {
          ...item,
          productType: item.productType,
          deviceId: item.deviceId,
          name: item.deviceId, // 如果API没有返回name，我们暂时用deviceId代替
          specificAttributes: item.attributes || {}
        };
        acc.devices.push(deviceInfo);
      } else if (item.entityType === 1) {
        // 组 - 使用groupsMap查找完整组信息
        if (groupsMap[item.groupId]) {
          const groupInfo = {
            ...groupsMap[item.groupId],
            attributes: item.attributes || {}
          };
          acc.groups.push(groupInfo);
        } else {
          // 如果在groupsMap中找不到，至少提供基本信息
          const basicGroupInfo = {
            groupId: item.groupId,
            name: `Group ${item.groupId}`, // 临时名称
            attributes: item.attributes || {}
          };
          acc.groups.push(basicGroupInfo);
        }
      }
      return acc;
    }, { devices: [], groups: [] });
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
              <Typography
                component="span"
                variant="body2"
                sx={{ color: '#95a5a6', ml: 1, fontWeight: 400 }}
              >
                - {scene.sceneId}
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Loading scene details...</Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

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
          onClick={() => setExpanded(!expanded)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
            borderBottom: expanded ? '1px solid rgba(224, 224, 224, 0.7)' : 'none',
            cursor: 'pointer',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {scene.name}
              <Typography
                component="span"
                variant="body2"
                sx={{ color: '#95a5a6', ml: 1, fontWeight: 400 }}
              >
                - {scene.sceneId}
              </Typography>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} sx={{ mr: 1 }}>
              {itemStats.devices.length > 0 && (
                <Chip 
                  label={`Devices (${itemStats.devices.length})`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(251, 205, 11, 0.1)',
                    color: '#fbcd0b'
                  }}
                />
              )}
              {itemStats.groups.length > 0 && (
                <Chip 
                  label={`Groups (${itemStats.groups.length})`}
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
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>
        
        {/* 可折叠内容区域 */}
        <Collapse in={expanded}>
          <Box sx={{ p: 2 }}>
            {/* 如果没有设备或组，显示空消息 */}
            {!itemStats.devices.length && !itemStats.groups.length ? (
              <Typography align="center" py={2} color="text.secondary">
                No devices or groups in this scene
              </Typography>
            ) : (
              <Box>
                {/* 设备区域 */}
                {itemStats.devices.length > 0 && (
                  <Box sx={{ mb: itemStats.groups.length > 0 ? 3 : 0 }}>
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
                      Devices
                    </Typography>
                    <Grid container spacing={2}>
                      {itemStats.devices.map((device) => (
                        <Grid item key={device.deviceId} xs={12} sm={6} md={3} lg={2}>
                          <SceneDeviceCard device={device} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
                
                {/* 组区域 */}
                {itemStats.groups.length > 0 && (
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
                      Groups
                    </Typography>
                    <Grid container spacing={2}>
                      {itemStats.groups.map((group) => (
                        <Grid item key={group.groupId} xs={12} sm={6} md={3} lg={2}>
                          <SceneGroupCard group={group} />
                        </Grid>
                      ))}
                    </Grid>
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

export default SceneList;
