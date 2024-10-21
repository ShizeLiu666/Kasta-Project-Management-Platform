import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
// import { useNavigate } from 'react-router-dom';
import RoomTypeList from './RoomTypeList/RoomTypeList';
import ProjectMembers from './ProjectMembers/ProjectMembers';
import CustomAlert from '../../CustomAlert';

const ProjectDetails = ({ projectId, projectName, onNavigate, userRole, onLeaveProject }) => {
  // const navigate = useNavigate();
  const [warningAlert, setWarningAlert] = useState({
    isOpen: true,
    message: "We are currently addressing an issue where visitors may not be able to see room types in specific projects. We appreciate your patience.",
    severity: "warning"
  });

  useEffect(() => {
    // 显示警告信息
    setWarningAlert(prev => ({ ...prev, isOpen: true }));
  }, []);

  const handleCloseWarning = () => {
    setWarningAlert(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div>
      <CustomAlert
        isOpen={warningAlert.isOpen}
        onClose={handleCloseWarning}
        message={warningAlert.message}
        severity={warningAlert.severity}
      />

      <h4>{projectName}</h4>
      <Row>
        <Col md="6">
          <ProjectMembers 
            projectId={projectId} 
            userRole={userRole} 
            onLeaveProject={onLeaveProject}
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
