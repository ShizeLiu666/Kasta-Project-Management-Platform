import React from 'react';
import { Row, Col } from 'reactstrap';
import RoomTypeList from './RoomTypeList/RoomTypeList';
import ProjectMembers from './ProjectMembers/ProjectMembers';

const ProjectDetails = ({ projectId, projectName, onNavigate }) => {
  return (
    <div>
      <h4>{projectName}</h4>
      <Row>
        <Col md="6">
          <ProjectMembers projectId={projectId} />
        </Col>
        <Col md="6">
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
