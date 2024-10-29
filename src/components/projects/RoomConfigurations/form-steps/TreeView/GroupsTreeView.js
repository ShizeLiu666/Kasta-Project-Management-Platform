import React from 'react';
import {
    CustomTreeItem,
    CustomTreeViewContainer
} from './CustomAnimatedTreeView';

const GroupsTreeView = () => {
    const formatWithLineBreaks = (text) => (
        <pre style={{
            margin: 0,
            fontFamily: 'inherit',
            fontSize: 'inherit',
            whiteSpace: 'pre'
        }}>
            {text}
        </pre>
    );

    return (
        <CustomTreeViewContainer defaultExpandedItems={['groups']}>
            <CustomTreeItem itemId="groups" label="Supported Group Formats">
                <CustomTreeItem itemId="name-format" label="Group Name Format">
                    <CustomTreeItem
                        itemId="name-prefix"
                        label="NAME: <group_name>"
                        copyText="NAME: group_name"
                    />
                </CustomTreeItem>

                <CustomTreeItem itemId="content-format" label="Device Content Format">
                    <CustomTreeItem
                        itemId="device-content"
                        label={formatWithLineBreaks(`   DEVICE CONTENT:
    <registered_device_name_1>
    <registered_device_name_2>
    ...`)}
                        copyText={`DEVICE CONTENT:
<registered_device_name_1>
<registered_device_name_2>
...`}
                    />
                </CustomTreeItem>
            </CustomTreeItem>
        </CustomTreeViewContainer>
    );
};

export default GroupsTreeView;