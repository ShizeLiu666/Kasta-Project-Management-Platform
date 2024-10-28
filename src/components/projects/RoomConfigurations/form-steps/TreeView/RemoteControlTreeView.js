import React from 'react';
import TreeMenu from 'react-simple-tree-menu';
import './TreeView.scss';
import './RemoteControlTreeView.scss';

const createTreeData = () => {
  return [
    {
      key: 'remote-controls',
      label: 'Supported Remote Control Formats',
      nodes: [
        {
          key: 'device',
          label: 'DEVICE',
          nodes: [
            {
              key: 'fan',
              label: 'Fan Type',
              nodes: [
                { 
                  key: 'fan-simple', 
                  label: 'DEVICE <device_name>    (Default operation: FAN)'
                },
                { key: 'fan-fan', label: 'DEVICE <device_name> - FAN' },
                { key: 'fan-lamp', label: 'DEVICE <device_name> - LAMP' },
                { key: 'fan-whole', label: 'DEVICE <device_name> - WHOLE' },
              ],
            },
            {
              key: 'curtain',
              label: 'Curtain Type',
              nodes: [
                { 
                  key: 'curtain-simple', 
                  label: 'DEVICE <device_name>    (Default operation: OPEN)'
                },
                { key: 'curtain-open', label: 'DEVICE <device_name> - OPEN' },
                { key: 'curtain-close', label: 'DEVICE <device_name> - CLOSE' },
                { key: 'curtain-whole', label: 'DEVICE <device_name> - WHOLE' },
              ],
            },
            {
              key: 'powerpoint',
              label: 'PowerPoint Type (Two-Way)',
              nodes: [
                { 
                  key: 'powerpoint-simple', 
                  label: 'DEVICE <device_name>    (Default operation: WHOLE)'
                },
                { key: 'powerpoint-left', label: 'DEVICE <device_name> - LEFT' },
                { key: 'powerpoint-right', label: 'DEVICE <device_name> - RIGHT' },
                { key: 'powerpoint-whole', label: 'DEVICE <device_name> - WHOLE' },
              ],
            },
            {
              key: 'output-module',
              label: '4 Output Module',
              nodes: [
                { 
                  key: 'output-simple', 
                  label: 'DEVICE <device_name>    (Default operation: FIRST)'
                },
                { key: 'output-first', label: 'DEVICE <device_name> - FIRST' },
                { key: 'output-second', label: 'DEVICE <device_name> - SECOND' },
                { key: 'output-third', label: 'DEVICE <device_name> - THIRD' },
                { key: 'output-fourth', label: 'DEVICE <device_name> - FOURTH' },
                { key: 'output-whole', label: 'DEVICE <device_name> - WHOLE' },
              ],
            },
            {
              key: 'other-devices',
              label: 'Other Devices',
              nodes: [
                { 
                  key: 'other-simple', 
                  label: 'DEVICE <device_name>'
                },
              ],
            },
          ],
        },
        {
          key: 'group',
          label: 'GROUP',
          nodes: [
            { key: 'group-no-action', label: 'GROUP <group_name>' },
            { key: 'group-with-action', label: 'GROUP <group_name> - <action>' },
          ],
        },
        {
          key: 'scene',
          label: 'SCENE',
          nodes: [
            { key: 'scene-no-action', label: 'SCENE <scene_name>' },
            { key: 'scene-with-action', label: 'SCENE <scene_name> - <action>' },
          ],
        },
      ],
    },
  ];
};

const RemoteControlTreeView = () => {
  const treeData = createTreeData();

  const renderItem = ({ hasNodes, isOpen, level, label, toggleNode }) => {
    return (
      <div 
        className={`tree-node level-${level}`} 
        onClick={toggleNode}
      >
        {hasNodes && (
          <span className="toggle-icon">{isOpen ? '▼' : '▶'}</span>
        )}
        <span className="node-label">{label}</span>
      </div>
    );
  };

  return (
    <div className="tree-view-container">
      <TreeMenu data={treeData} hasSearch={false} renderItem={renderItem} />
    </div>
  );
};

export default RemoteControlTreeView;
