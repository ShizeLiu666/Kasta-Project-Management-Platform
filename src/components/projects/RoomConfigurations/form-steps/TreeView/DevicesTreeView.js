import React from 'react';
import { 
  CustomTreeItem, 
  CustomTreeViewContainer 
} from './CustomAnimatedTreeView';
import { AllDeviceTypes } from '../../ExcelProcessor/ExcelProcessor';

const DevicesTreeView = () => {
  const renderDeviceModels = (models, deviceType, subType = null) => {
    const modelList = Array.isArray(models) ? models : [];
    
    return modelList.map(model => (
      <CustomTreeItem 
        key={`${deviceType}-${model}`}
        itemId={`${deviceType}-${model}`}
        label={model}
        copyText={model}
      />
    ));
  };

  return (
    <CustomTreeViewContainer defaultExpandedItems={['devices']}>
      <CustomTreeItem itemId="devices" label="Supported Devices">
        {Object.entries(AllDeviceTypes).map(([deviceType, models]) => (
          <CustomTreeItem
            key={deviceType}
            itemId={deviceType}
            label={deviceType}
          >
            {Array.isArray(models) ? (
              renderDeviceModels(models, deviceType)
            ) : (
              Object.entries(models).map(([subType, subModels]) => (
                <CustomTreeItem
                  key={`${deviceType}-${subType}`}
                  itemId={`${deviceType}-${subType}`}
                  label={subType}
                >
                  {renderDeviceModels(subModels, deviceType, subType)}
                </CustomTreeItem>
              ))
            )}
          </CustomTreeItem>
        ))}
      </CustomTreeItem>
    </CustomTreeViewContainer>
  );
};

export default DevicesTreeView;