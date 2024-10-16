import React from 'react';
import { Row, Col } from 'reactstrap';
import RoomTypeList from '../RoomTypeList/RoomTypeList';

const ProjectDetails = ({ projectId, projectName, onNavigate }) => {
  return (
    <div>
      <h4>{projectName}</h4>
      <Row>
        <Col md="6" style={{ height: '200vh', overflowY: 'auto' }}>
          {/* 左侧区域，暂时预留 */}
          <div style={{ height: '100%', border: '1px solid #ddd' }}>
            {/* 这里可以添加左侧内容 */}
          </div>
        </Col>
        <Col md="6" style={{ height: '100vh', overflowY: 'auto' }}>
          <RoomTypeList
            projectId={projectId}
            projectName={projectName}
            onNavigate={onNavigate}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ProjectDetails;
