import React, { useState } from "react";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Menu, MenuItem } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/EditNote';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import default_image from "../../../assets/images/projects/default_image.jpg";


const ProjectCard = ({
  project,  // 我们现在传入整个 project 对象
  onCardClick,
  onEdit,
  onRemove,
  onChangeBackground,
  setMenuOpen,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // 使用 project.iconUrl 如果存在，否则使用默认图片
  const cardImage = project.iconUrl || default_image;

  // Handle Menu open/close
  const handleMenuClick = (event) => {
    event.stopPropagation(); // Prevent triggering the card's click handler
    setAnchorEl(event.currentTarget);
    setMenuOpen(true); // Menu is open
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false); // Menu is closed
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
      style={{ position: "relative" }}
      onClick={(event) => onCardClick(event, project)}
    >
      <div style={{
        height: "250px",
        overflow: "hidden",
        position: "relative"
      }}>
        <img
          src={cardImage}
          alt={project.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center"
          }}
        />
      </div>
      <CardBody className="p-4">
        <CardTitle tag="h5">{project.name}</CardTitle>
        <CardSubtitle>{project.address}</CardSubtitle>
      </CardBody>

      {/* More Options Icon */}
      <IconButton
        aria-label="more"
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
        style={{
          position: "absolute",
          top: "5px",
          right: "10px",
          color: "#A9A9A9",
        }}
      >
        <MoreHorizIcon fontSize="large"/>
      </IconButton>

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
        style={{
          marginRight: 0,
          marginTop: "50px",
        }}
      >
        <MenuItem onClick={handleChangeBackground}><WallpaperIcon style={{marginRight:"8px", color: "#4CAF50"}}/>Change Image</MenuItem>
        <MenuItem onClick={handleEdit}><EditIcon fontSize="medium" style={{marginRight:"8px", color: "#007bff"}}/>Edit</MenuItem>
        <MenuItem onClick={handleRemove}><DeleteIcon style={{marginRight:"8px", color: "#F44336"}}/>Remove</MenuItem>
      </Menu>
    </Card>
  );
};

export default ProjectCard;
