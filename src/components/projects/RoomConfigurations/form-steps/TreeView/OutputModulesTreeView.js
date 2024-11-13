import React from 'react';
import { 
  CustomTreeItem, 
  CustomTreeViewContainer 
} from './CustomAnimatedTreeView';

const OutputModulesTreeView = () => {
  return (
    <CustomTreeViewContainer defaultExpandedItems={['output-modules']}>
      <CustomTreeItem itemId="output-modules" label="Supported Output Module Formats">
        <CustomTreeItem 
          itemId="device-type" 
          label={<span><span style={{ color: 'red' }}>*</span> Only supports devices of type "4 Output Module"</span>}
        />
        <CustomTreeItem itemId="channel-format" label="Channel Format">
          <CustomTreeItem itemId="channel-syntax" label="Channel Syntax">
            <CustomTreeItem 
              itemId="basic-format" 
              label="<channel_number_1~4>: <channel_name>"
              copyText="<channel_number_1~4>: <channel_name>"
            />
            <CustomTreeItem 
              itemId="action-format" 
              label="<channel_number_1~4>: <channel_name> - <action>"
              copyText="<channel_number_1~4>: <channel_name> - <action>"
            />
          </CustomTreeItem>
          <CustomTreeItem itemId="actions" label="Supported Pulse Actions">
            <CustomTreeItem 
              itemId="action-normal" 
              label="NORMAL (default if not specified)"
              copyText="NORMAL"
            />
            <CustomTreeItem 
              itemId="action-1sec" 
              label="1SEC"
              copyText="1SEC"
            />
            <CustomTreeItem 
              itemId="action-6sec" 
              label="6SEC"
              copyText="6SEC"
            />
            <CustomTreeItem 
              itemId="action-9sec" 
              label="9SEC"
              copyText="9SEC"
            />
            <CustomTreeItem 
              itemId="action-revers" 
              label="REVERS"
              copyText="REVERS"
            />
          </CustomTreeItem>
        </CustomTreeItem>
      </CustomTreeItem>
    </CustomTreeViewContainer>
  );
};

export default OutputModulesTreeView;
