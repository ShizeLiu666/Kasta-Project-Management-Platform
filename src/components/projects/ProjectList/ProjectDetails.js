import React from 'react';
import { Row, Col } from 'reactstrap';
import { Box, Typography, Divider } from '@mui/material';
import RoomTypeList from '../RoomTypeList/RoomTypeList';
import ProjectMembers from '../ProjectDetails/ProjectMembers/ProjectMembers';

const ProjectDetails = ({ projectId, projectName, onNavigate, userRole, onLeaveProject }) => {
  return (
    <Box sx={{ p: 3, backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Project Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          mb: 1
        }}>
          {projectName}
        </Typography>
        <Divider sx={{ borderColor: '#e0e0e0' }} />
      </Box>

      {/* Main Content */}
      <Row className="g-4">
        <Col lg="8" md="12">
          <Box sx={{ 
            height: { lg: 'calc(100vh - 200px)', md: 'auto' }, 
            overflowY: 'auto',
            pr: { lg: 2, md: 0 }
          }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 2,
                color: 'text.primary'
              }}>
                Room Types
              </Typography>
              <RoomTypeList
                projectId={projectId}
                projectName={projectName}
                onNavigate={onNavigate}
                userRole={userRole}
              />
            </Box>
          </Box>
        </Col>
        
        <Col lg="4" md="12">
          <Box sx={{ 
            height: { lg: 'calc(100vh - 200px)', md: 'auto' }, 
            overflowY: 'auto',
            pl: { lg: 2, md: 0 }
          }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 2,
                color: 'text.primary'
              }}>
                Team
              </Typography>
              <ProjectMembers
                projectId={projectId}
                userRole={userRole}
                onLeaveProject={onLeaveProject}
              />
            </Box>
          </Box>
        </Col>
      </Row>
    </Box>
  );
};

export default ProjectDetails;
