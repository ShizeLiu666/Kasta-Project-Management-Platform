import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap";
import axiosInstance from '../../../config'; 
import ProjectCard from "./ProjectCard";
import PasswordModal from "./PasswordModal";
import RoomTypeList from "../RoomTypeList/RoomTypeList";
import RoomConfigList from "../RoomConfigurations/RoomConfigList";
import default_image from "../../../assets/images/projects/default_image.jpg";
import Alert from "@mui/material/Alert";
import { Button } from "reactstrap";
import CreateProjectModal from "./CreateProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
import EditProjectModal from './EditProjectModal';
import SearchComponent from "./SearchComponent";
import { getToken } from '../../auth/auth';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [alert, setAlert] = useState({
    severity: "",
    message: "",
    open: false,
  });
  const [breadcrumbPath, setBreadcrumbPath] = useState(["Project List"]);
  const [showRoomTypes, setShowRoomTypes] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [deleteProjectModalOpen, setDeleteProjectModalOpen] = useState(false); // State for delete modal
  const [searchTerm, setSearchTerm] = useState(""); // State to track the search term
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);

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

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleCreateProjectModal = () => {
    setCreateProjectModalOpen(!createProjectModalOpen);
  };

  const toggleDeleteProjectModal = (project) => {
    setSelectedProject(project);
    setDeleteProjectModalOpen(!deleteProjectModalOpen); // Toggle delete modal
  };

  const handleCardClick = (event, project) => {
    if (!event.defaultPrevented && !menuOpen) {
      setSelectedProject(project);
      toggleModal();
    }
  };

  const handlePasswordSubmit = async (password) => {
    try {
      if (password === selectedProject.password) {
        setAlert({
          severity: "success",
          message: `Password for ${selectedProject.name} is correct!`,
          open: true,
        });
        setTimeout(() => {
          setAlert({ open: false });
          toggleModal();
          setBreadcrumbPath(["Project List", "Room Types"]);
          setShowRoomTypes(true);
        }, 1000);
      } else {
        setAlert({
          severity: "error",
          message: `Incorrect password for ${selectedProject.name}.`,
          open: true,
        });
      }
    } catch (error) {
      setAlert({
        severity: "error",
        message: "An error occurred. Please try again later.",
        open: true,
      });
      console.error("Error verifying password:", error);
    }

    setTimeout(() => {
      setAlert({ open: false });
    }, 3000);
  };

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

  const toggleEditProjectModal = (project) => {
    setSelectedProject(project);
    setEditProjectModalOpen(!editProjectModalOpen);
  };

  return (
    <div>
      {alert.open && (
        <Alert
          severity={alert.severity}
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          {alert.message}
        </Alert>
      )}

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
            <Col sm="6" lg="6" xl="4" key={index}>
              <div>
                <ProjectCard
                  image={project.iconUrl ? project.iconUrl : default_image}
                  title={project.name}
                  subtitle={project.address}
                  onCardClick={(event) => handleCardClick(event, project)}
                  onEdit={() => toggleEditProjectModal(project)}
                  onRemove={() => toggleDeleteProjectModal(project)}
                  setMenuOpen={setMenuOpen}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}

      {showRoomTypes && selectedProject && breadcrumbPath.length === 2 && (
        <RoomTypeList
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

      {selectedProject && (
        <PasswordModal
          isOpen={modalOpen}
          toggle={toggleModal}
          projectName={selectedProject.name}
          onSubmit={handlePasswordSubmit}
        />
      )}

      <CreateProjectModal
        isOpen={createProjectModalOpen}
        toggle={toggleCreateProjectModal}
        fetchProjects={fetchProjectList} // Pass fetchProjects as a prop to refresh the project list
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
    </div>
  );
};

export default ProjectList;