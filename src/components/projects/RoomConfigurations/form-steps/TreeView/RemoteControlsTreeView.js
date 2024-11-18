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
              label="DEVICE <device_name>    (Default operation: WHOLE)"
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

        {/* Input Module */}
        <CustomTreeItem itemId="input-module" label="Input Module (5/6 Input)">
          {/* 基础设备绑定 */}
          <CustomTreeItem itemId="input-basic" label="Basic Device Binding">
            <CustomTreeItem
              itemId="input-device-simple"
              label="DEVICE <device_name>    (Default: MOMENTARY)"
              copyText="DEVICE <device_name>"
            />
          </CustomTreeItem>

          {/* 设备操作 */}
          <CustomTreeItem itemId="input-device-operation" label="Device with Operation">
            <CustomTreeItem
              itemId="input-device-curtain"
              label="Curtain Examples"
            >
              <CustomTreeItem
                itemId="input-curtain-open"
                label="DEVICE <device_name> - OPEN    (Default: MOMENTARY)"
                copyText="DEVICE <device_name> - OPEN"
              />
              <CustomTreeItem
                itemId="input-curtain-close"
                label="DEVICE <device_name> - CLOSE    (Default: MOMENTARY)"
                copyText="DEVICE <device_name> - CLOSE"
              />
            </CustomTreeItem>
            
            <CustomTreeItem
              itemId="input-device-fan"
              label="Fan Examples"
            >
              <CustomTreeItem
                itemId="input-fan-fan"
                label="DEVICE <device_name> - FAN    (Default: MOMENTARY)"
                copyText="DEVICE <device_name> - FAN"
              />
              <CustomTreeItem
                itemId="input-fan-lamp"
                label="DEVICE <device_name> - LAMP    (Default: MOMENTARY)"
                copyText="DEVICE <device_name> - LAMP"
              />
            </CustomTreeItem>
          </CustomTreeItem>

          {/* Input Action */}
          <CustomTreeItem itemId="input-action" label="Device with Input Action">
            <CustomTreeItem
              itemId="input-toggle"
              label="DEVICE <device_name> + TOGGLE"
              copyText="DEVICE <device_name> + TOGGLE"
            />
            <CustomTreeItem
              itemId="input-momentary"
              label="DEVICE <device_name> + MOMENTARY    (Default)"
              copyText="DEVICE <device_name> + MOMENTARY"
            />
          </CustomTreeItem>

          {/* 组合操作 */}
          <CustomTreeItem itemId="input-combined" label="Combined Operation and Input Action">
            <CustomTreeItem
              itemId="input-combined-curtain"
              label="Curtain Examples"
            >
              <CustomTreeItem
                itemId="input-curtain-open-toggle"
                label="DEVICE <device_name> - OPEN + TOGGLE"
                copyText="DEVICE <device_name> - OPEN + TOGGLE"
              />
              <CustomTreeItem
                itemId="input-curtain-close-momentary"
                label="DEVICE <device_name> - CLOSE + MOMENTARY"
                copyText="DEVICE <device_name> - CLOSE + MOMENTARY"
              />
            </CustomTreeItem>
            
            <CustomTreeItem
              itemId="input-combined-fan"
              label="Fan Examples"
            >
              <CustomTreeItem
                itemId="input-fan-fan-toggle"
                label="DEVICE <device_name> - FAN + TOGGLE"
                copyText="DEVICE <device_name> - FAN + TOGGLE"
              />
              <CustomTreeItem
                itemId="input-fan-lamp-momentary"
                label="DEVICE <device_name> - LAMP + MOMENTARY"
                copyText="DEVICE <device_name> - LAMP + MOMENTARY"
              />
            </CustomTreeItem>
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