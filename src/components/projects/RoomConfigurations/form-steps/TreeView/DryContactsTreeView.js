import React from 'react';
import { 
  CustomTreeItem, 
  CustomTreeViewContainer 
} from './CustomAnimatedTreeView';

const DryContactsTreeView = () => {
  return (
    <CustomTreeViewContainer defaultExpandedItems={['dry-contact-modules']}>
      <CustomTreeItem itemId="dry-contact-modules" label="Supported Dry Contact Module Formats">
        <CustomTreeItem 
          itemId="device-type" 
          label={<span><span style={{ color: 'red' }}>*</span> Only supports devices of type "Dry Contact"</span>}
        />
        <CustomTreeItem itemId="format" label="Format">
          <CustomTreeItem 
            itemId="name-format" 
            label="NAME: <device_name>"
            copyText="NAME: <device_name>"
          />
          <CustomTreeItem itemId="actions" label="Supported Actions">
            <CustomTreeItem 
              itemId="action-normal" 
              label="NORMAL"
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

export default DryContactsTreeView;