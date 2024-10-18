import React, { useState } from "react";
import { Card, CardBody, CardSubtitle } from "reactstrap";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Menu, MenuItem } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/EditNote';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import default_image from "../../../assets/images/projects/default_image.jpg";
// import LazyLoad from 'react-lazyload';

const ProjectCard = ({
  project,
  onCardClick,
  onEdit,
  onRemove,
  onChangeBackground,
  setMenuOpen,
  userRole,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // 直接设置图片 URL，不使用 useMemo
  const imageUrl = project.iconUrl || default_image;

  // Handle Menu open/close
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  // Edit action
  const handleEdit = () => {
    handleClose();
    onEdit(project);
  };

  // Remove action
  const handleRemove = () => {
    handleClose();
    onRemove(project);
  };

  // Change Background action
  const handleChangeBackground = () => {
    handleClose();
    onChangeBackground(project);
  };

  return (
    <Card
      className="blog-card"
      style={{ position: "relative", borderRadius: '4px'}}
      onClick={(event) => onCardClick(event, project)}
    >
      <div style={{ 
        padding: "10px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
      }}>
        <h6 style={{ margin: 0, fontWeight: "bold" }}>{project.name}</h6>
        <IconButton
          aria-label="more"
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
          style={{ padding: 0 }}
        >
          <MoreHorizIcon />
        </IconButton>
      </div>

        <div
          style={{
            paddingTop: '75%',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

      <CardBody style={{padding: "10px "}}>
        <CardSubtitle>Address: {project.address || 'None'}</CardSubtitle>
        <CardSubtitle>Description: {project.des || 'None'}</CardSubtitle>
        <CardSubtitle>Role: {project.role || 'Visitor'}</CardSubtitle>
      </CardBody>

      {/* Menu for Edit, Remove, and Change Background actions */}
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {userRole === 'OWNER' ? [
          <MenuItem key="change" onClick={handleChangeBackground}><WallpaperIcon style={{marginRight:"8px", color: "#4CAF50"}}/>Change Image</MenuItem>,
          <MenuItem key="edit" onClick={handleEdit}><EditIcon fontSize="medium" style={{marginRight:"8px", color: "#007bff"}}/>Edit</MenuItem>,
          <MenuItem key="remove" onClick={handleRemove}><DeleteIcon style={{marginRight:"8px", color: "#F44336"}}/>Remove</MenuItem>
        ] : null}
        <MenuItem onClick={handleClose}>Close</MenuItem>
      </Menu>
    </Card>
  );
};

export default ProjectCard;
