import React, { useState } from "react";
import { Card, CardBody, CardImg, CardSubtitle, CardTitle } from "reactstrap";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Menu, MenuItem } from "@mui/material";
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/EditNote';

const ProjectCard = ({
  image,
  title,
  subtitle,
  onCardClick,
  onEdit,
  onRemove,
  setMenuOpen,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

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
    onEdit();
  };

  // Remove action
  const handleRemove = () => {
    handleClose();
    onRemove();
  };

  return (
    <Card
      className="blog-card"
      style={{ position: "relative" }}
      onClick={onCardClick}
    >
      <CardImg alt="Card image cap" src={image} />
      <CardBody className="p-4">
        <CardTitle tag="h5">{title}</CardTitle>
        <CardSubtitle>{subtitle}</CardSubtitle>
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
          color: "#68696a",
        }}
      >
        <MoreHorizIcon fontSize="large"/>
      </IconButton>

      {/* Menu for Edit and Remove actions */}
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
        <MenuItem onClick={handleEdit}><EditIcon fontSize="medium" style={{marginRight:"8px"}}/>Edit</MenuItem>
        <MenuItem onClick={handleRemove}><DeleteIcon style={{marginRight:"8px", color: "#F44336"}}/>Remove</MenuItem>
      </Menu>
    </Card>
  );
};

export default ProjectCard;
