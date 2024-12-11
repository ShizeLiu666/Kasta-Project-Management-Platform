import React from 'react';
import { CustomTreeItem, CustomTreeViewContainer } from './CustomAnimatedTreeView';

const RemoteControlsTreeView = () => {
  return (
    <CustomTreeViewContainer defaultExpandedItems={['remote-controls']}>
      <CustomTreeItem 
        itemId="remote-controls" 
        label="Supported Remote Control Formats (All keywords are optional e.g. DEVICE, GROUP, SCENE)"
      >
        {/* DEVICE Type */}
        <CustomTreeItem itemId="device" label="Device">
          {/* Fan Type */}
          <CustomTreeItem itemId="fan" label="Fan Type">
            <CustomTreeItem
              itemId="fan-simple"
              label="(DEVICE) <device_name>    (Default operation: FAN)"
              copyText="<device_name>"
            />
            <CustomTreeItem
              itemId="fan-fan"
              label="(DEVICE) <device_name> - FAN"
              copyText="<device_name> - FAN"
            />
            <CustomTreeItem
              itemId="fan-lamp"
              label="(DEVICE) <device_name> - LAMP"
              copyText="<device_name> - LAMP"
            />
            <CustomTreeItem
              itemId="fan-whole"
              label="(DEVICE) <device_name> - WHOLE"
              copyText="<device_name> - WHOLE"
            />
          </CustomTreeItem>

          {/* Curtain Type */}
          <CustomTreeItem itemId="curtain" label="Curtain Type">
            <CustomTreeItem
              itemId="curtain-simple"
              label="(DEVICE) <device_name>    (Default operation: OPEN)"
              copyText="<device_name>"
            />
            <CustomTreeItem
              itemId="curtain-open"
              label="(DEVICE) <device_name> - OPEN"
              copyText="<device_name> - OPEN"
            />
            <CustomTreeItem
              itemId="curtain-close"
              label="(DEVICE) <device_name> - CLOSE"
              copyText="<device_name> - CLOSE"
            />
            <CustomTreeItem
              itemId="curtain-whole"
              label="(DEVICE) <device_name> - WHOLE"
              copyText="<device_name> - WHOLE"
            />
          </CustomTreeItem>

          {/* PowerPoint Type */}
          <CustomTreeItem itemId="powerpoint" label="PowerPoint Type (Two-Way)">
            <CustomTreeItem
              itemId="powerpoint-simple"
              label="(DEVICE) <device_name>    (Default operation: WHOLE)"
              copyText="<device_name>"
            />
            <CustomTreeItem
              itemId="powerpoint-left"
              label="(DEVICE) <device_name> - LEFT"
              copyText="<device_name> - LEFT"
            />
            <CustomTreeItem
              itemId="powerpoint-right"
              label="(DEVICE) <device_name> - RIGHT"
              copyText="<device_name> - RIGHT"
            />
            <CustomTreeItem
              itemId="powerpoint-whole"
              label="(DEVICE) <device_name> - WHOLE"
              copyText="<device_name> - WHOLE"
            />
          </CustomTreeItem>

          {/* 4 Output Module */}
          <CustomTreeItem itemId="output-module" label="4 Output Module">
            <CustomTreeItem
              itemId="output-simple"
              label="(DEVICE) <device_name>    (Default operation: WHOLE)"
              copyText="<device_name>"
            />
            <CustomTreeItem
              itemId="output-first"
              label="(DEVICE) <device_name> - FIRST"
              copyText="<device_name> - FIRST"
            />
            <CustomTreeItem
              itemId="output-second"
              label="(DEVICE) <device_name> - SECOND"
              copyText="<device_name> - SECOND"
            />
            <CustomTreeItem
              itemId="output-third"
              label="(DEVICE) <device_name> - THIRD"
              copyText="<device_name> - THIRD"
            />
            <CustomTreeItem
              itemId="output-fourth"
              label="(DEVICE) <device_name> - FOURTH"
              copyText="<device_name> - FOURTH"
            />
            <CustomTreeItem
              itemId="output-whole"
              label="(DEVICE) <device_name> - WHOLE"
              copyText="<device_name> - WHOLE"
            />
          </CustomTreeItem>

          {/* Other Devices */}
          <CustomTreeItem itemId="other-devices" label="Other Devices">
            <CustomTreeItem
              itemId="other-simple"
              label="(DEVICE) <device_name>"
              copyText="<device_name>"
            />
          </CustomTreeItem>
        </CustomTreeItem>

        {/* GROUP */}
        <CustomTreeItem itemId="group" label="Group">
          <CustomTreeItem
            itemId="group-no-action"
            label="(GROUP) <group_name>"
            copyText="<group_name>"
          />
        </CustomTreeItem>

        {/* SCENE */}
        <CustomTreeItem itemId="scene" label="Scene">
          <CustomTreeItem
            itemId="scene-no-action"
            label="(SCENE) <scene_name>"
            copyText="<scene_name>"
          />
        </CustomTreeItem>
      </CustomTreeItem>
    </CustomTreeViewContainer>
  );
};

export default RemoteControlsTreeView;