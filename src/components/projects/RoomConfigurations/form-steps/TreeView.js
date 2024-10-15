import React from 'react';
import TreeMenu from 'react-simple-tree-menu';
import { AllDeviceTypes } from '../ExcelProcessor/ExcelProcessor';
import './TreeView.scss';

const createTreeData = () => {
  const treeData = [{
    key: 'devices',
    label: 'Supported Devices',
    nodes: []
  }];

  Object.entries(AllDeviceTypes).forEach(([deviceType, models]) => {
    const deviceNode = {
      key: deviceType,
      label: deviceType,
      nodes: []
    };

    if (Array.isArray(models)) {
      deviceNode.nodes.push({
        key: `${deviceType}-models`,
        label: models.join(', '),
        isModelList: true
      });
    } else if (typeof models === 'object') {
      Object.entries(models).forEach(([subType, subModels]) => {
        const subTypeNode = {
          key: `${deviceType}-${subType}`,
          label: subType,
          nodes: [{
            key: `${deviceType}-${subType}-models`,
            label: subModels.join(', '),
            isModelList: true
          }]
        };
        deviceNode.nodes.push(subTypeNode);
      });
    }

    treeData[0].nodes.push(deviceNode);
  });

  return treeData;
};

const TreeView = () => {
  const treeData = createTreeData();

  const renderItem = ({ hasNodes, isOpen, level, label, toggleNode, isModelList }) => {
    return (
      <div className={`tree-node level-${level} ${isModelList ? 'model-list' : ''}`} onClick={toggleNode}>
        {hasNodes && !isModelList && (
          <span className="toggle-icon">{isOpen ? '▼' : '▶'}</span>
        )}
        <span className="node-label">{label}</span>
      </div>
    );
  };

  return (
    <div className="tree-view-container">
      {/* <h5>Supported Devices</h5> */}
      <TreeMenu data={treeData} hasSearch={false} renderItem={renderItem} />
    </div>
  );
};

export default TreeView;
