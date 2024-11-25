import React from 'react';
import { 
  CustomTreeItem, 
  CustomTreeViewContainer 
} from './CustomAnimatedTreeView';

const InputModulesTreeView = () => {
  return (
    <CustomTreeViewContainer defaultExpandedItems={['input-modules']}>
      <CustomTreeItem itemId="input-modules" label="Supported Input Module Formats">
        <CustomTreeItem 
          itemId="device-type" 
          label={<span><span style={{ color: 'red' }}>*</span> Only supports devices of type "5 Input Module"</span>}
        />
        <CustomTreeItem itemId="channel-format" label="Channel Format">
          <CustomTreeItem itemId="channel-syntax" label="Channel Syntax">
            <CustomTreeItem 
              itemId="basic-format" 
              label="<channel_number_1~5>: <action>"
              copyText="<channel_number_1~5>: <action>"
            />
          </CustomTreeItem>
          <CustomTreeItem itemId="actions" label="Supported Actions">
            <CustomTreeItem 
              itemId="action-toggle" 
              label="TOGGLE"
              copyText="TOGGLE"
            />
            <CustomTreeItem 
              itemId="action-momentary" 
              label="MOMENTARY"
              copyText="MOMENTARY"
            />
          </CustomTreeItem>
        </CustomTreeItem>
      </CustomTreeItem>
    </CustomTreeViewContainer>
  );
};

export default InputModulesTreeView;