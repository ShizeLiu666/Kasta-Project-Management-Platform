import React from 'react';
import { CustomTreeItem, CustomTreeViewContainer } from './CustomAnimatedTreeView';

const ScenesTreeView = () => {
  return (
    <CustomTreeViewContainer defaultExpandedItems={['scenes']}>
      <CustomTreeItem itemId="scenes" label="Supported Scene Control Formats">
        {/* Relay Type */}
        <CustomTreeItem itemId="scenes-relay" label="Relay Type">
          <CustomTreeItem itemId="scenes-relay-single" label="Single Device Control">
            <CustomTreeItem
              itemId="scenes-relay-single-on"
              label="<device_name> ON"
              copyText="<device_name> ON"
            />
            <CustomTreeItem
              itemId="scenes-relay-single-off"
              label="<device_name> OFF"
              copyText="<device_name> OFF"
            />
          </CustomTreeItem>
          <CustomTreeItem itemId="scenes-relay-group" label="Group Device Control">
            <CustomTreeItem
              itemId="scenes-relay-group-on"
              label="<device_name>, <device_name> ON"
              copyText="<device_name>, <device_name> ON"
            />
            <CustomTreeItem
              itemId="scenes-relay-group-off"
              label="<device_name>, <device_name> OFF"
              copyText="<device_name>, <device_name> OFF"
            />
          </CustomTreeItem>
        </CustomTreeItem>

        {/* Dimmer Type */}
        <CustomTreeItem itemId="scenes-dimmer" label="Dimmer Type">
          <CustomTreeItem itemId="scenes-dimmer-single" label="Single Device Control">
            <CustomTreeItem
              itemId="scenes-dimmer-single-on"
              label="<device_name> ON"
              copyText="<device_name> ON"
            />
            <CustomTreeItem
              itemId="scenes-dimmer-single-off"
              label="<device_name> OFF"
              copyText="<device_name> OFF"
            />
            <CustomTreeItem
              itemId="scenes-dimmer-single-dim"
              label="<device_name> ON +XX%    (XX: 0-100)"
              copyText="<device_name> ON +XX%"
            />
          </CustomTreeItem>
          <CustomTreeItem itemId="scenes-dimmer-group" label="Group Device Control">
            <CustomTreeItem
              itemId="scenes-dimmer-group-on"
              label="<device_name>, <device_name> ON"
              copyText="<device_name>, <device_name> ON"
            />
            <CustomTreeItem
              itemId="scenes-dimmer-group-off"
              label="<device_name>, <device_name> OFF"
              copyText="<device_name>, <device_name> OFF"
            />
            <CustomTreeItem
              itemId="scenes-dimmer-group-dim"
              label="<device_name>, <device_name> ON +XX%    (XX: 0-100)"
              copyText="<device_name>, <device_name> ON +XX%"
            />
          </CustomTreeItem>
        </CustomTreeItem>

        {/* Fan Type */}
        <CustomTreeItem itemId="scenes-fan" label="Fan Type">
          <CustomTreeItem itemId="scenes-fan-basic" label="Basic Control">
            <CustomTreeItem
              itemId="scenes-fan-on"
              label="<device_name> ON RELAY ON"
              copyText="<device_name> ON RELAY ON"
            />
            <CustomTreeItem
              itemId="scenes-fan-off"
              label="<device_name> OFF RELAY OFF"
              copyText="<device_name> OFF RELAY OFF"
            />
            <CustomTreeItem
              itemId="scenes-fan-light-only"
              label="<device_name> OFF RELAY ON"
              copyText="<device_name> OFF RELAY ON"
            />
            <CustomTreeItem
              itemId="scenes-fan-fan-only"
              label="<device_name> ON RELAY OFF"
              copyText="<device_name> ON RELAY OFF"
            />
          </CustomTreeItem>
          <CustomTreeItem itemId="scenes-fan-speed" label="Speed Control">
            <CustomTreeItem
              itemId="scenes-fan-speed-1"
              label="<device_name> ON RELAY ON SPEED 1"
              copyText="<device_name> ON RELAY ON SPEED 1"
            />
            <CustomTreeItem
              itemId="scenes-fan-speed-2"
              label="<device_name> ON RELAY ON SPEED 2"
              copyText="<device_name> ON RELAY ON SPEED 2"
            />
            <CustomTreeItem
              itemId="scenes-fan-speed-3"
              label="<device_name> ON RELAY ON SPEED 3"
              copyText="<device_name> ON RELAY ON SPEED 3"
            />
          </CustomTreeItem>
        </CustomTreeItem>

        {/* Curtain Type */}
        <CustomTreeItem itemId="scenes-curtain" label="Curtain Type">
          <CustomTreeItem itemId="scenes-curtain-single" label="Single Device Control">
            <CustomTreeItem
              itemId="scenes-curtain-single-open"
              label="<device_name> OPEN"
              copyText="<device_name> OPEN"
            />
            <CustomTreeItem
              itemId="scenes-curtain-single-close"
              label="<device_name> CLOSE"
              copyText="<device_name> CLOSE"
            />
          </CustomTreeItem>
          <CustomTreeItem itemId="scenes-curtain-group" label="Group Device Control">
            <CustomTreeItem
              itemId="scenes-curtain-group-open"
              label="<device_name>, <device_name> OPEN"
              copyText="<device_name>, <device_name> OPEN"
            />
            <CustomTreeItem
              itemId="scenes-curtain-group-close"
              label="<device_name>, <device_name> CLOSE"
              copyText="<device_name>, <device_name> CLOSE"
            />
          </CustomTreeItem>
        </CustomTreeItem>

        {/* PowerPoint Type */}
        <CustomTreeItem itemId="scenes-powerpoint" label="PowerPoint Type">
          {/* Single-Way PowerPoint */}
          <CustomTreeItem itemId="scenes-powerpoint-single" label="Single-Way PowerPoint">
            <CustomTreeItem
              itemId="scenes-powerpoint-single-on"
              label="<device_name> ON"
              copyText="<device_name> ON"
            />
            <CustomTreeItem
              itemId="scenes-powerpoint-single-off"
              label="<device_name> OFF"
              copyText="<device_name> OFF"
            />
          </CustomTreeItem>

          {/* Two-Way PowerPoint */}
          <CustomTreeItem itemId="scenes-powerpoint-two" label="Two-Way PowerPoint">
            <CustomTreeItem
              itemId="scenes-powerpoint-two-both-on"
              label="<device_name> ON ON"
              copyText="<device_name> ON ON"
            />
            <CustomTreeItem
              itemId="scenes-powerpoint-two-both-off"
              label="<device_name> OFF OFF"
              copyText="<device_name> OFF OFF"
            />
            <CustomTreeItem
              itemId="scenes-powerpoint-two-left-on"
              label="<device_name> ON OFF"
              copyText="<device_name> ON OFF"
            />
            <CustomTreeItem
              itemId="scenes-powerpoint-two-right-on"
              label="<device_name> OFF ON"
              copyText="<device_name> OFF ON"
            />
            <CustomTreeItem
              itemId="scenes-powerpoint-two-left-unselect"
              label="<device_name> UNSELECT ON"
              copyText="<device_name> UNSELECT ON"
            />
            <CustomTreeItem
              itemId="scenes-powerpoint-two-right-unselect"
              label="<device_name> ON UNSELECT"
              copyText="<device_name> ON UNSELECT"
            />
          </CustomTreeItem>
        </CustomTreeItem>

        {/* Dry Contact Type */}
        <CustomTreeItem itemId="scenes-drycontact" label="Dry Contact Type">
          <CustomTreeItem itemId="scenes-drycontact-single" label="Single Device Control">
            <CustomTreeItem
              itemId="scenes-drycontact-single-on"
              label="<device_name> ON"
              copyText="<device_name> ON"
            />
            <CustomTreeItem
              itemId="scenes-drycontact-single-off"
              label="<device_name> OFF    (Only for NORMAL devices)"
              copyText="<device_name> OFF"
            />
          </CustomTreeItem>
          <CustomTreeItem itemId="scenes-drycontact-group" label="Group Device Control">
            <CustomTreeItem
              itemId="scenes-drycontact-group-on"
              label="<device_name>, <device_name> ON"
              copyText="<device_name>, <device_name> ON"
            />
            <CustomTreeItem
              itemId="scenes-drycontact-group-off"
              label="<device_name>, <device_name> OFF    (Only for NORMAL devices)"
              copyText="<device_name>, <device_name> OFF"
            />
          </CustomTreeItem>
        </CustomTreeItem>
      </CustomTreeItem>
    </CustomTreeViewContainer>
  );
};

export default ScenesTreeView;