import React from 'react';
import PropTypes from 'prop-types';
import './ComponentCard.css';

const ComponentCard = ({ children, title, subtitle }) => {
  return (
    <div className="component-card">
      <div className="component-card-title">{title}</div>
      <div className="component-card-body">
        {subtitle && <div className="component-card-subtitle">{subtitle}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};

ComponentCard.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node
};

export default ComponentCard;
