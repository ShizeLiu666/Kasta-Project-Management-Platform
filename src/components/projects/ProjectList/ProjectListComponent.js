import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Breadcrumb, BreadcrumbItem} from "reactstrap";
import axiosInstance from '../../../config'; 
import ProjectCard from "./ProjectCard";
import ProjectDetails from '../ProjectDetails/ProjectDetails';
import RoomConfigList from "../RoomConfigurations/RoomConfigList";
import CreateProjectModal from "./CreateProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
import EditProjectModal from './EditProjectModal';
import SearchComponent from "./SearchComponent";
import { getToken } from '../../auth/auth';
import UploadBackgroundModal from "./UploadBackgroundModal";
import CustomAlert from '../../CustomAlert';
import InvitationModal from '../../UserInvitations/InvitationModal';
import CustomButton from '../../CustomButton';
import LeaveProjectModal from '../ProjectDetails/ProjectMembers/LeaveProjectModal';
import InviteMemberModal from '../ProjectDetails/ProjectMembers/InviteMemberModal';

const ProjectListComponent = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "info",
    duration: 3000
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
  const [warningAlert, setWarningAlert] = useState({
    isOpen: true,
    message: "We are currently addressing an issue where changing the project card image also affects the avatar. We appreciate your patience.",
    severity: "warning"
  });
  const [inviteMemberModalOpen, setInviteMemberModalOpen] = useState(false);
  const [selectedProjectForInvite, setSelectedProjectForInvite] = useState(null);

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

        // Only open the invitation modal if there are pending invitations
        if (pendingInvites.length > 0) {
          setInvitationModalOpen(true);
        } else {
          setInvitationModalOpen(false);
        }
      } else {
        console.error("Error fetching projects:", response.data.errorMsg);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

  // const fetchUserRole = useCallback(async () => {
  //   try {
  //     const token = getToken();
  //     if (!token) {
  //       console.error("No token found, please log in again.");
  //       return;
  //     }
  
  //     const response = await axiosInstance.get("/user/role", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     if (response.data.success) {
  //       setUserRole(response.data.data.role);
  //     } else {
  //       console.error("Error fetching user role:", response.data.errorMsg);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user role:", error);
  //   }
  // }, []);

  useEffect(() => {
    fetchProjectList();
    // 显示警告信息
    setWarningAlert(prev => ({ ...prev, isOpen: true }));
  }, [fetchProjectList]);

  // const toggleModal = () => {
  //   setModalOpen(!modalOpen);
  // };

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

  // const showAlert = (message, severity, duration = 3000) => {
  //   setAlert({ isOpen: true, message, severity, duration });
  // };

  // const handlePasswordSubmit = async (password) => {
  //   try {
  //     if (password === selectedProject.password) {
  //       showAlert(`Password for ${selectedProject.name} is correct!`, "success");
  //       toggleModal();
  //       setBreadcrumbPath(["Project List", "Project Details"]);
  //       setShowRoomTypes(true);
  //     } else {
  //       showAlert(`Incorrect password for ${selectedProject.name}.`, "error");
  //     }
  //   } catch (error) {
  //     showAlert("An error occurred. Please try again later.", "error");
  //     console.error("Error verifying password:", error);
  //   }
  // };

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

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadSuccess = () => {
    fetchProjectList();
  };

  const handleInvitationAction = (action, projectId) => {
    fetchProjectList();
    setAlert({
      isOpen: true,
      message: `Successfully ${action === 'accept' ? 'accepted' : 'rejected'} invitation for project ${projectId}`,
      severity: "success",
      duration: 3000
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
      duration: 3000
    });
  };

  const handleCloseWarning = () => {
    setWarningAlert(prev => ({ ...prev, isOpen: false }));
  };

  const handleInviteMember = (project) => {
    setSelectedProjectForInvite(project);
    setInviteMemberModalOpen(true);
  };

  return (
    <div>
      <CustomAlert
        isOpen={warningAlert.isOpen}
        onClose={handleCloseWarning}
        message={warningAlert.message}
        severity={warningAlert.severity}
      />

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
                    handleNavigate(["Project List", "Room Types"], null, null)
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
          <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <CustomButton
            type="create"
            onClick={toggleCreateProjectModal}
          >
            Create New Project
          </CustomButton>
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
          userRole={selectedProject.role}  // 传递用户角色
        />
      )}

      {breadcrumbPath.length === 3 && selectedRoomType && (
        <RoomConfigList
          projectRoomId={selectedRoomType.id}
          roomTypeName={selectedRoomType.name}
          userRole={selectedUserRole}  // 传递用户角色
        />
      )}

      {/* {selectedProject && (
        <PasswordModal
          isOpen={modalOpen}
          toggle={toggleModal}
          projectName={selectedProject.name}
          onSubmit={handlePasswordSubmit}
        />
      )} */}

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
              duration: 3000
            });
          }
        }}
      />

      <InviteMemberModal
        isOpen={inviteMemberModalOpen}
        toggle={() => setInviteMemberModalOpen(false)}
        projectId={selectedProjectForInvite?.projectId}  // 使用 projectId 而不是 id
        onMemberInvited={(response) => {
          console.log('Invite Member Response:', response);
          if (response.success) {
            fetchProjectList();
          } else {
            console.error('Error inviting member:', response.errorMsg);
          }
        }}
      />
    </div>
  );
};

// 导出时使用新的组件名称
export default ProjectListComponent;
