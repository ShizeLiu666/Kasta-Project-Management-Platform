import React from 'react';
import { CustomTreeItem, CustomTreeViewContainer } from './CustomAnimatedTreeView';

const RemoteControlsTreeView = () => {
  return (
    <CustomTreeViewContainer defaultExpandedItems={['remote-controls']}>
      <CustomTreeItem itemId="remote-controls" label="Supported Remote Control Formats">
        {/* DEVICE Type */}
        <CustomTreeItem itemId="device" label="Device">
          {/* Fan Type */}
          <CustomTreeItem itemId="fan" label="Fan Type">
            <CustomTreeItem
              itemId="fan-simple"
              label="DEVICE <device_name>    (Default operation: FAN)"
              copyText="DEVICE <device_name>"
            />
            <CustomTreeItem
              itemId="fan-fan"
              label="DEVICE <device_name> - FAN"
              copyText="DEVICE <device_name> - FAN"
            />
            <CustomTreeItem
              itemId="fan-lamp"
              label="DEVICE <device_name> - LAMP"
              copyText="DEVICE <device_name> - LAMP"
            />
            <CustomTreeItem
              itemId="fan-whole"
              label="DEVICE <device_name> - WHOLE"
              copyText="DEVICE <device_name> - WHOLE"
            />
          </CustomTreeItem>

          {/* Curtain Type */}
          <CustomTreeItem itemId="curtain" label="Curtain Type">
            <CustomTreeItem
              itemId="curtain-simple"
              label="DEVICE <device_name>    (Default operation: OPEN)"
              copyText="DEVICE <device_name>"
            />
            <CustomTreeItem
              itemId="curtain-open"
              label="DEVICE <device_name> - OPEN"
              copyText="DEVICE <device_name> - OPEN"
            />
            <CustomTreeItem
              itemId="curtain-close"
              label="DEVICE <device_name> - CLOSE"
              copyText="DEVICE <device_name> - CLOSE"
            />
            <CustomTreeItem
              itemId="curtain-whole"
              label="DEVICE <device_name> - WHOLE"
              copyText="DEVICE <device_name> - WHOLE"
            />
          </CustomTreeItem>

          {/* PowerPoint Type */}
          <CustomTreeItem itemId="powerpoint" label="PowerPoint Type (Two-Way)">
            <CustomTreeItem
              itemId="powerpoint-simple"
              label="DEVICE <device_name>    (Default operation: WHOLE)"
              copyText="DEVICE <device_name>"
            />
            <CustomTreeItem
              itemId="powerpoint-left"
              label="DEVICE <device_name> - LEFT"
              copyText="DEVICE <device_name> - LEFT"
            />
            <CustomTreeItem
              itemId="powerpoint-right"
              label="DEVICE <device_name> - RIGHT"
              copyText="DEVICE <device_name> - RIGHT"
            />
            <CustomTreeItem
              itemId="powerpoint-whole"
              label="DEVICE <device_name> - WHOLE"
              copyText="DEVICE <device_name> - WHOLE"
            />
          </CustomTreeItem>

          {/* 4 Output Module */}
          <CustomTreeItem itemId="output-module" label="4 Output Module">
            <CustomTreeItem
              itemId="output-simple"
              label="DEVICE <device_name>    (Default operation: FIRST)"
              copyText="DEVICE <device_name>"
            />
            <CustomTreeItem
              itemId="output-first"
              label="DEVICE <device_name> - FIRST"
              copyText="DEVICE <device_name> - FIRST"
            />
            <CustomTreeItem
              itemId="output-second"
              label="DEVICE <device_name> - SECOND"
              copyText="DEVICE <device_name> - SECOND"
            />
            <CustomTreeItem
              itemId="output-third"
              label="DEVICE <device_name> - THIRD"
              copyText="DEVICE <device_name> - THIRD"
            />
            <CustomTreeItem
              itemId="output-fourth"
              label="DEVICE <device_name> - FOURTH"
              copyText="DEVICE <device_name> - FOURTH"
            />
            <CustomTreeItem
              itemId="output-whole"
              label="DEVICE <device_name> - WHOLE"
              copyText="DEVICE <device_name> - WHOLE"
            />
          </CustomTreeItem>

          {/* Other Devices */}
          <CustomTreeItem itemId="other-devices" label="Other Devices">
            <CustomTreeItem
              itemId="other-simple"
              label="DEVICE <device_name>"
              copyText="DEVICE <device_name>"
            />
          </CustomTreeItem>
        </CustomTreeItem>

        {/* GROUP */}
        <CustomTreeItem itemId="group" label="Group">
          <CustomTreeItem
            itemId="group-no-action"
            label="GROUP <group_name>"
            copyText="GROUP <group_name>"
          />
          {/* <CustomTreeItem
            itemId="group-with-action"
            label="GROUP <group_name> - <action>"
            copyText="GROUP <group_name> - <action>"
          /> */}
        </CustomTreeItem>

        {/* SCENE */}
        <CustomTreeItem itemId="scene" label="Scene">
          <CustomTreeItem
            itemId="scene-no-action"
            label="SCENE <scene_name>"
            copyText="SCENE <scene_name>"
          />
          {/* <CustomTreeItem
            itemId="scene-with-action"
            label="SCENE <scene_name> - <action>"
            copyText="SCENE <scene_name> - <action>"
          /> */}
        </CustomTreeItem>
      </CustomTreeItem>
    </CustomTreeViewContainer>
  );
};

export default RemoteControlsTreeView;