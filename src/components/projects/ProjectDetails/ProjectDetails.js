import React from 'react';
import { Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import RoomTypeList from './RoomTypeList/RoomTypeList';
import ProjectMembers from './ProjectMembers/ProjectMembers';

const ProjectDetails = ({ projectId, projectName, onNavigate, userRole }) => {
  const navigate = useNavigate();

  const handleLeaveProject = () => {
    // 导航回项目列表页面
    navigate('/admin/projects');
  };

  return (
    <div>
      <h4>{projectName}</h4>
      <Row>
        <Col md="6">
          <ProjectMembers 
          projectId={projectId} 
          userRole={userRole} 
          onLeaveProject={handleLeaveProject}
          />
        </Col>
        <Col md="6">
          <RoomTypeList
            projectId={projectId}
            projectName={projectName}
            onNavigate={onNavigate}
            userRole={userRole}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ProjectDetails;
