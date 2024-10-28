import React from 'react';
import { 
  CustomTreeItem, 
  CustomTreeViewContainer 
} from './CustomAnimatedTreeView';

const VirtualContactsTreeView = () => {
  return (
    <CustomTreeViewContainer defaultExpandedItems={['virtual-contacts']}>
      <CustomTreeItem itemId="virtual-contacts" label="Supported Virtual Contact Formats">
        <CustomTreeItem 
          itemId="device-type" 
          label={<span><span style={{ color: 'red' }}>*</span> Only supports devices of type "4 Output Module"</span>}
        />
        <CustomTreeItem itemId="channel-format" label="Channel Format">
          <CustomTreeItem itemId="channel-syntax" label="Channel Syntax">
            <CustomTreeItem 
              itemId="basic-format" 
              label="<channel_number_1~4>: Terminal_<name>"
              copyText="<channel_number_1~4>: Terminal_<name>"
            />
            <CustomTreeItem 
              itemId="action-format" 
              label="<channel_number_1~4>: Terminal_<name> - <action>"
              copyText="<channel_number_1~4>: Terminal_<name> - <action>"
            />
          </CustomTreeItem>
          <CustomTreeItem itemId="actions" label="Supported Actions">
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

export default VirtualContactsTreeView;
