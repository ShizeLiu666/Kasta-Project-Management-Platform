import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { useNetworkScenes, useSceneDevices } from '../useNetworkQueries';
import { PRODUCT_TYPE_MAP } from '../PRODUCT_TYPE_MAP';
import CCT_DOWNLIGHT from '../Devices/Tables/CCT_DOWNLIGHT/CCT_DOWNLIGHT';
import DIMMER from '../Devices/Tables/DIMMER/DIMMER';
import FAN from '../Devices/Tables/FAN/FAN';
import POWER_POINT from '../Devices/Tables/POWER_POINT/POWER_POINT';
import RGB_CW from '../Devices/Tables/RGB_CW/RGB_CW';
import SOCKET_RELAY from '../Devices/Tables/SOCKET_RELAY/SOCKET_RELAY';
import THERMOSTAT from '../Devices/Tables/THERMOSTAT/THERMOSTAT';

const DEVICE_COMPONENTS = {
  CCT_DOWNLIGHT,
  DIMMER,
  FAN,
  POWER_POINT,
  RGB_CW,
  SOCKET_RELAY,
  THERMOSTAT
};

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
  const { 
    data: sceneItems = [],
    isLoading,
  } = useSceneDevices(networkId, scene.sceneId);

  console.log('Scene Items Raw:', sceneItems);
  console.log('NetworkId:', networkId);
  console.log('SceneId:', scene.sceneId);

  const itemStats = sceneItems.reduce((acc, item) => {
    if (item.entityType === 0) {
      acc.devices.push(item);
    } else {
      acc.groups.push(item);
    }
    return acc;
  }, { devices: [], groups: [] });

  console.log('Item Stats:', itemStats);

  const devicesByProductType = itemStats.devices.reduce((acc, item) => {
    console.log('Processing device item:', item);
    console.log('Device Info:', item.deviceInfo);
    
    if (item.deviceInfo) {
      const productType = PRODUCT_TYPE_MAP[item.deviceInfo.productType];
      console.log('Product Type Mapping:', {
        original: item.deviceInfo.productType,
        mapped: productType
      });
      
      if (productType) {
        if (!acc[productType]) {
          acc[productType] = [];
        }
        acc[productType].push({
          ...item.deviceInfo,
          specificAttributes: item.attributes
        });
      }
    }
    return acc;
  }, {});

  console.log('Devices By Product Type:', devicesByProductType);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading scene devices...</Typography>
      </Box>
    );
  }

  if (!sceneItems || sceneItems.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary">
          No devices in this scene
        </Typography>
      </Box>
    );
  }

  const renderDeviceTable = (productType, devices) => {
    try {
      const deviceType = devices[0].deviceType;
      const DeviceComponent = DEVICE_COMPONENTS[deviceType];
      
      if (!DeviceComponent) {
        console.warn(`No component found for device type: ${deviceType}`);
        return null;
      }

      return (
        <Box key={`${productType}-${deviceType}`} sx={{ mb: 3 }}>
          <DeviceComponent devices={devices} />
        </Box>
      );
    } catch (error) {
      console.error(`Failed to load component for ${productType}`, error);
      return null;
    }
  };

  return (
    <Box key={scene.sceneId} sx={{ mb: 4 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        mb: 2
      }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: '#fbcd0b',
          }}
        >
          {scene.name}
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: '#95a5a6',
              ml: 1,
              fontWeight: 400
            }}
          >
            - {scene.sceneId}
          </Typography>
        </Typography>

        <Stack direction="row" spacing={1}>
          {itemStats.devices.length > 0 && (
            <Chip 
              label={`Devices (${itemStats.devices.length})`}
              size="small"
              sx={{ 
                backgroundColor: '#e1f5fe',
                color: '#0288d1'
              }}
            />
          )}
          {itemStats.groups.length > 0 && (
            <Chip 
              label={`Groups (${itemStats.groups.length})`}
              size="small"
              sx={{ 
                backgroundColor: '#f1f8e9',
                color: '#558b2f'
              }}
            />
          )}
        </Stack>

        {Object.entries(devicesByProductType)
          .sort(([typeA], [typeB]) => typeA.localeCompare(typeB))
          .map(([productType, devices]) => (
            <React.Fragment key={productType}>
              {renderDeviceTable(productType, devices)}
            </React.Fragment>
          ))}

        {itemStats.groups.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: '#558b2f' }}>
              Groups
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SceneList;
