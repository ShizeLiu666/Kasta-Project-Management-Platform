import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap";
import axiosInstance from '../../../config'; 
import ProjectCard from "./ProjectCard";
import ProjectDetails from '../ProjectDetails/ProjectDetails';
import RoomConfigList from "../RoomConfigurations/RoomConfigList";
import { Button } from "reactstrap";
import CreateProjectModal from "./CreateProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
import EditProjectModal from './EditProjectModal';
import SearchComponent from "./SearchComponent";
import { getToken } from '../../auth/auth';
import UploadBackgroundModal from "./UploadBackgroundModal";
import CustomAlert from '../../CustomAlert';  // 导入 CustomAlert

// 将组件名称从 ProjectList 改为 ProjectListComponent
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
        const projects = response.data.data.map((project) => ({
          projectId: project.projectId,
          name: project.name,
          password: project.password,
          iconUrl: project.iconUrl,
          address: project.address,
          role: project.role,
        }));
        setProjects(projects);
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
  };

  const handleNavigate = (newPath, roomTypeId, roomTypeName) => {
    setBreadcrumbPath(newPath);
    setSelectedRoomType({ id: roomTypeId, name: roomTypeName });
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadSuccess = (newBackgroundUrl) => {
    fetchProjectList();
  };

  return (
    <div>
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

          <Button
            color="secondary"
            onClick={toggleCreateProjectModal}
            style={{
              backgroundColor: "#fbcd0b",
              borderColor: "#fbcd0b",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Create New Project
          </Button>
        </div>
      )}

      {!showRoomTypes && (
        <Row>
          {filteredProjects.map((project, index) => (
            <Col xs="12" sm="6" md="4" lg="3" key={index}>
              <div>
                <ProjectCard
                  project={project}
                  onCardClick={handleCardClick}
                  onEdit={toggleEditProjectModal}
                  onRemove={toggleDeleteProjectModal}
                  onChangeBackground={toggleUploadBackgroundModal}
                  setMenuOpen={setMenuOpen}
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
        />
      )}

      {breadcrumbPath.length === 3 && selectedRoomType && (
        <RoomConfigList
          projectRoomId={selectedRoomType.id}
          roomTypeName={selectedRoomType.name}
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
    </div>
  );
};

// 导出时使用新的组件名称
export default ProjectListComponent;
