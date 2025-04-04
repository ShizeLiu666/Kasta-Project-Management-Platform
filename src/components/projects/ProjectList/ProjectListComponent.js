import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Breadcrumb, BreadcrumbItem} from "reactstrap";
import axiosInstance from '../../../config'; 
import ProjectCard from "./ProjectCard";
import ProjectDetails from '../ProjectDetails/ProjectDetails';
import RoomConfigList from "../RoomConfigurations/RoomConfigList";
import CreateProjectModal from "./CreateProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
import EditProjectModal from './EditProjectModal';
import { getToken } from '../../auth/auth';
import UploadBackgroundModal from "./UploadBackgroundModal";
import CustomAlert from '../../CustomComponents/CustomAlert';
import InvitationModal from '../../UserInvitations/InvitationModal';
import CustomButton from '../../CustomComponents/CustomButton';
import LeaveProjectModal from '../ProjectDetails/ProjectMembers/LeaveProjectModal';
import InviteMemberModal from '../ProjectDetails/ProjectMembers/InviteMemberModal';
import CustomSearchBar from "../../CustomComponents/CustomSearchBar";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';

const ProjectListComponent = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "info",
    duration: 1000
  });
  const [breadcrumbPath, setBreadcrumbPath] = useState(["Project List"]);
  const [showRoomTypes, setShowRoomTypes] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [deleteProjectModalOpen, setDeleteProjectModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);
  const [uploadBackgroundModalOpen, setUploadBackgroundModalOpen] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [invitationModalOpen, setInvitationModalOpen] = useState(false);
  const [leaveProjectModalOpen, setLeaveProjectModalOpen] = useState(false);
  const [selectedProjectToLeave, setSelectedProjectToLeave] = useState(null);
  // const [userRole, setUserRole] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  // const [warningAlert, setWarningAlert] = useState({
  //   isOpen: true,
  //   message: "We are currently addressing an issue where changing the project card image also affects the avatar. We appreciate your patience.",
  //   severity: "warning"
  // });
  const [inviteMemberModalOpen, setInviteMemberModalOpen] = useState(false);
  const [selectedProjectForInvite, setSelectedProjectForInvite] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);

  const fetchProjectList = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        window.alert("No token found, please log in again.");
        return;
      }

      const response = await axiosInstance.get("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const allProjects = response.data.data;
        const acceptedProjects = allProjects.filter(project => 
          project.role === 'OWNER' || project.memberStatus === 'ACCEPT'
        );
        setProjects(acceptedProjects);

        const pendingInvites = allProjects.filter(project => project.memberStatus === 'WAITING');
        setPendingInvitations(pendingInvites);
      } else {
        console.error("Error fetching projects:", response.data.errorMsg);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);


  const toggleCreateProjectModal = () => {
    setCreateProjectModalOpen(!createProjectModalOpen);
  };

  const toggleDeleteProjectModal = (project) => {
    setSelectedProject(project);
    setDeleteProjectModalOpen(!deleteProjectModalOpen);
  };

  const toggleEditProjectModal = (project) => {
    setSelectedProject(project);
    setEditProjectModalOpen(!editProjectModalOpen);
  };

  const toggleUploadBackgroundModal = (project) => {
    setSelectedProject(project);
    setUploadBackgroundModalOpen(!uploadBackgroundModalOpen);
  };

  const handleCardClick = (event, project) => {
    if (!event.defaultPrevented && !menuOpen) {
      setSelectedProject(project);
      setBreadcrumbPath(["Project List", "Project Details"]);
      setShowRoomTypes(true);
    }
  };

  const handleBreadcrumbClick = () => {
    setBreadcrumbPath(["Project List"]);
    setShowRoomTypes(false);
    fetchProjectList(); // 重新获取项目列表
  };

  const handleNavigate = (newPath, roomTypeId, roomTypeName, userRole) => {
    setBreadcrumbPath(newPath);
    setSelectedRoomType({ id: roomTypeId, name: roomTypeName });
    setSelectedUserRole(userRole);  // 保存用户角色
  };

  const handleUploadSuccess = (updatedProject) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.projectId === updatedProject.projectId ? {...project, ...updatedProject} : project
      )
    );
  };

  const handleInvitationAction = (action, projectId) => {
    fetchProjectList();
    
    // 如果是批量操作（projectId 为 null），则关闭弹窗
    if (!projectId) {
      setInvitationModalOpen(false);
    }
    
    setAlert({
      isOpen: true,
      message: projectId 
        ? `Successfully ${action === 'accept' ? 'accepted' : 'rejected'} invitation for project ${projectId}`
        : `Successfully ${action === 'accept' ? 'accepted' : 'rejected'} all invitations`,
      severity: "success",
      duration: 1000
    });
  };

  const handleLeaveProject = (project) => {
    setSelectedProjectToLeave(project);
    setLeaveProjectModalOpen(true);
  };

  const handleLeaveProjectSuccess = () => {
    fetchProjectList();
    setLeaveProjectModalOpen(false);
    setSelectedProjectToLeave(null);
    setAlert({
      isOpen: true,
      message: 'Successfully left the project',
      severity: 'success',
      duration: 1000
    });
  };

  // const handleCloseWarning = () => {
  //   setWarningAlert(prev => ({ ...prev, isOpen: false }));
  // };

  const handleInviteMember = (project) => {
    setSelectedProjectForInvite(project);
    setInviteMemberModalOpen(true);
  };

  // 过滤项目的函数
  const filterProjects = useCallback((searchValue) => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [projects]);

  // 当 projects 或 searchTerm 改变时更新过滤结果
  useEffect(() => {
    setFilteredProjects(filterProjects(searchTerm));
  }, [projects, searchTerm, filterProjects]);

  const handleEditSuccess = (updatedProject) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.projectId === updatedProject.projectId 
          ? { ...project, ...updatedProject }
          : project
      )
    );
    setAlert({
      isOpen: true,
      message: "Project updated successfully",
      severity: "success",
      duration: 1000
    });
  };

  return (
    <div>
      {/* <CustomAlert
        isOpen={warningAlert.isOpen}
        onClose={handleCloseWarning}
        message={warningAlert.message}
        severity={warningAlert.severity}
      /> */}

      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        message={alert.message}
        severity={alert.severity}
        autoHideDuration={alert.duration}
      />

      <Row>
        <Col>
          <Breadcrumb>
            <BreadcrumbItem>
              {breadcrumbPath.length > 1 ? (
                <button
                  onClick={handleBreadcrumbClick}
                  style={{
                    background: "none",
                    border: "none",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                  }}
                >
                  Project List
                </button>
              ) : (
                "Project List"
              )}
            </BreadcrumbItem>
            {breadcrumbPath.length > 2 ? (
              <BreadcrumbItem>
                <button
                  onClick={() =>
                    handleNavigate(["Project List", "Project Details"], null, null)
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                  }}
                >
                  {breadcrumbPath[1]}
                </button>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem active>{breadcrumbPath[1]}</BreadcrumbItem>
            )}
            {breadcrumbPath.length > 2 && (
              <BreadcrumbItem active>{breadcrumbPath[2]}</BreadcrumbItem>
            )}
          </Breadcrumb>
        </Col>
      </Row>

      {breadcrumbPath.length === 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
            width: "100%",
          }}
        >
          <CustomSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search Project Name..."
            filterKey="name"
            onFilter={(value) => {
              const filtered = filterProjects(value);
              setFilteredProjects(filtered);
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <IconButton 
              onClick={() => setInvitationModalOpen(true)}
              sx={{ 
                color: pendingInvitations.length > 0 ? '#fbcd0b' : 'action.disabled'
              }}
            >
              <Badge 
                badgeContent={pendingInvitations.length} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#f62d51'
                  }
                }}
              >
                <NotificationsIcon fontSize="large"/>
              </Badge>
            </IconButton>

            <CustomButton
              type="create"
              onClick={toggleCreateProjectModal}
            >
              Create New Project
            </CustomButton>
          </div>
        </div>
      )}

      {!showRoomTypes && (
        <Row>
          {filteredProjects.map((project, index) => (
            <Col xs="12" sm="6" md="4" lg="3" key={index} className="px-0 mb-0">
              <div>
                <ProjectCard
                  project={project}
                  onCardClick={handleCardClick}
                  onEdit={toggleEditProjectModal}
                  onRemove={toggleDeleteProjectModal}
                  onChangeBackground={toggleUploadBackgroundModal}
                  onLeaveProject={handleLeaveProject}
                  setMenuOpen={setMenuOpen}
                  userRole={project.role}
                  onInviteMember={handleInviteMember}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}

      {showRoomTypes && selectedProject && breadcrumbPath.length === 2 && (
        <ProjectDetails
          projectId={selectedProject.projectId}
          projectName={selectedProject.name}
          onNavigate={handleNavigate}
          userRole={selectedProject.role}
          onLeaveProject={() => {
            setShowRoomTypes(false);
            setBreadcrumbPath(["Project List"]);
            fetchProjectList();
          }}
        />
      )}

      {breadcrumbPath.length === 3 && selectedRoomType && (
        <RoomConfigList
          projectRoomId={selectedRoomType.id}
          roomTypeName={selectedRoomType.name}
          userRole={selectedUserRole}  // 传递用户角色
        />
      )}

      <CreateProjectModal
        isOpen={createProjectModalOpen}
        toggle={toggleCreateProjectModal}
        fetchProjects={fetchProjectList}
      />

      <EditProjectModal
        isOpen={editProjectModalOpen}
        toggle={() => toggleEditProjectModal(null)}
        fetchProjects={fetchProjectList}
        project={selectedProject}
        onEditSuccess={handleEditSuccess}
      />

      {selectedProject && (
        <DeleteProjectModal
          isOpen={deleteProjectModalOpen}
          toggle={() => toggleDeleteProjectModal(null)}
          project={selectedProject} 
          onDelete={fetchProjectList}
        />
      )}

      <UploadBackgroundModal
        isOpen={uploadBackgroundModalOpen}
        toggle={() => toggleUploadBackgroundModal(null)}
        projectId={selectedProject?.projectId}
        project={selectedProject}  // 添加这一行
        onUploadSuccess={handleUploadSuccess}
      />

      <InvitationModal
        isOpen={invitationModalOpen}
        toggle={() => setInvitationModalOpen(!invitationModalOpen)}
        invitations={pendingInvitations}
        onActionComplete={handleInvitationAction}
      />

      <LeaveProjectModal
        isOpen={leaveProjectModalOpen}
        toggle={() => setLeaveProjectModalOpen(false)}
        projectId={selectedProjectToLeave?.projectId}
        onLeaveSuccess={(response) => {
          console.log('Leave Project Response:', response);
          if (response && response.success) {
            handleLeaveProjectSuccess();
          } else {
            console.error('Error leaving project:', response?.errorMsg || 'Unknown error');
            setAlert({
              isOpen: true,
              message: response?.errorMsg || 'Failed to leave the project',
              severity: 'error',
              duration: 1000
            });
          }
        }}
      />

      <InviteMemberModal
        isOpen={inviteMemberModalOpen}
        toggle={() => setInviteMemberModalOpen(false)}
        projectId={selectedProjectForInvite?.projectId}
        onMemberInvited={(response) => {
          if (response.success) {
            fetchProjectList();
            setAlert({
              isOpen: true,
              message: 'Member invited successfully',
              severity: 'success',
              duration: 1000
            });
          } else {
            setAlert({
              isOpen: true,
              message: response.errorMsg || 'Failed to invite member',
              severity: 'error',
              duration: 2000
            });
          }
        }}
        currentMembers={selectedProjectForInvite?.members || []}
      />
    </div>
  );
};

// 导出时使用新的组件名称
export default ProjectListComponent;
