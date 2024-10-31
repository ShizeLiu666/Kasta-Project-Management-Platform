import React from 'react';
import { CustomTreeItem, CustomTreeViewContainer } from './CustomAnimatedTreeView';

const RemoteParametersTreeView = () => {
  return (
    <CustomTreeViewContainer defaultExpandedItems={['remote-parameters']}>
      <CustomTreeItem itemId="remote-parameters" label="Supported Remote Control Parameters">
        {/* Backlight */}
        <CustomTreeItem itemId="backlight" label="Backlight">
          <CustomTreeItem
            itemId="backlight-enabled"
            label="BACKLIGHT: ENABLED"
            copyText="BACKLIGHT: ENABLED"
          />
          <CustomTreeItem
            itemId="backlight-disabled"
            label="BACKLIGHT: DISABLED"
            copyText="BACKLIGHT: DISABLED"
          />
        </CustomTreeItem>

        {/* Backlight Color */}
        <CustomTreeItem itemId="backlight-color" label="Backlight Color">
          <CustomTreeItem
            itemId="backlight-color-white"
            label="BACKLIGHT_COLOR: WHITE"
            copyText="BACKLIGHT_COLOR: WHITE"
          />
          <CustomTreeItem
            itemId="backlight-color-green"
            label="BACKLIGHT_COLOR: GREEN"
            copyText="BACKLIGHT_COLOR: GREEN"
          />
          <CustomTreeItem
            itemId="backlight-color-blue"
            label="BACKLIGHT_COLOR: BLUE"
            copyText="BACKLIGHT_COLOR: BLUE"
          />
        </CustomTreeItem>

        {/* Backlight Timeout */}
        <CustomTreeItem itemId="backlight-timeout" label="Backlight Timeout">
          <CustomTreeItem
            itemId="backlight-timeout-30s"
            label="BACKLIGHT_TIMEOUT: 30S"
            copyText="BACKLIGHT_TIMEOUT: 30S"
          />
          <CustomTreeItem
            itemId="backlight-timeout-1min"
            label="BACKLIGHT_TIMEOUT: 1MIN"
            copyText="BACKLIGHT_TIMEOUT: 1MIN"
          />
          <CustomTreeItem
            itemId="backlight-timeout-2min"
            label="BACKLIGHT_TIMEOUT: 2MIN"
            copyText="BACKLIGHT_TIMEOUT: 2MIN"
          />
          <CustomTreeItem
            itemId="backlight-timeout-3min"
            label="BACKLIGHT_TIMEOUT: 3MIN"
            copyText="BACKLIGHT_TIMEOUT: 3MIN"
          />
          <CustomTreeItem
            itemId="backlight-timeout-5min"
            label="BACKLIGHT_TIMEOUT: 5MIN"
            copyText="BACKLIGHT_TIMEOUT: 5MIN"
          />
          <CustomTreeItem
            itemId="backlight-timeout-10min"
            label="BACKLIGHT_TIMEOUT: 10MIN"
            copyText="BACKLIGHT_TIMEOUT: 10MIN"
          />
          <CustomTreeItem
            itemId="backlight-timeout-never"
            label="BACKLIGHT_TIMEOUT: NEVER"
            copyText="BACKLIGHT_TIMEOUT: NEVER"
          />
        </CustomTreeItem>

        {/* Beep */}
        <CustomTreeItem itemId="beep" label="Beep">
          <CustomTreeItem
            itemId="beep-enabled"
            label="BEEP: ENABLED"
            copyText="BEEP: ENABLED"
          />
          <CustomTreeItem
            itemId="beep-disabled"
            label="BEEP: DISABLED"
            copyText="BEEP: DISABLED"
          />
        </CustomTreeItem>

        {/* Night Light */}
        <CustomTreeItem itemId="night-light" label="Night Light">
          <CustomTreeItem
            itemId="night-light-low"
            label="NIGHT_LIGHT: LOW"
            copyText="NIGHT_LIGHT: LOW"
          />
          <CustomTreeItem
            itemId="night-light-medium"
            label="NIGHT_LIGHT: MEDIUM"
            copyText="NIGHT_LIGHT: MEDIUM"
          />
          <CustomTreeItem
            itemId="night-light-high"
            label="NIGHT_LIGHT: HIGH"
            copyText="NIGHT_LIGHT: HIGH"
          />
          <CustomTreeItem
            itemId="night-light-disabled"
            label="NIGHT_LIGHT: DISABLED"
            copyText="NIGHT_LIGHT: DISABLED"
          />
        </CustomTreeItem>
      </CustomTreeItem>
    </CustomTreeViewContainer>
  );
};

export default RemoteParametersTreeView;