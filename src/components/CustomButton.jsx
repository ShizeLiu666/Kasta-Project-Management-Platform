import React, { useState } from 'react';
import { Button } from 'reactstrap';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const buttonTypes = {
  create: {
    icon: <AddIcon />,
    color: "#fbcd0b"
  },
  invite: {
    icon: <SendIcon />,
    color: "#4CAF50"
  },
  leave: {
    icon: <LogoutIcon />,
    color: "#dc3545"  // danger color
  },
  remove: {
    icon: <PersonRemoveIcon />,
    color: "#f62d51"
  }
};

const CustomButton = ({ 
  type,
  color,
  onClick, 
  children, 
  userRole,
  allowedRoles,
  style = {},
  icon,
  disabled,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonWidth, setButtonWidth] = useState(null);
  const buttonRef = React.useRef(null);
  
  const buttonConfig = type ? buttonTypes[type] : {};
  const buttonColor = color || buttonConfig.color || "#fbcd0b";
  const buttonIcon = icon || buttonConfig.icon;

  React.useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, [children]);

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return null;
  }

  const handleClick = async (e) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onClick?.(e);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const buttonStyle = {
    backgroundColor: buttonColor,
    borderColor: buttonColor,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "none",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    borderRadius: '4px',
    padding: '6px 12px',
    minWidth: '120px',
    height: '40px',
    width: buttonWidth ? `${buttonWidth}px` : 'auto',
    opacity: (isLoading || disabled) ? 0.7 : 1,
    cursor: (isLoading || disabled) ? 'not-allowed' : 'pointer',
    ...style
  };

  const contentStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  };

  return (
    <Button
      ref={buttonRef}
      color="primary"
      onClick={handleClick}
      style={buttonStyle}
      className="custom-button"
      disabled={isLoading || disabled}
      {...props}
    >
      {buttonIcon && (
        <span style={{ 
          marginRight: '8px', 
          display: 'flex', 
          alignItems: 'center',
          opacity: isLoading ? 0.7 : 1
        }}>
          {buttonIcon}
        </span>
      )}
      <span style={contentStyle}>{isLoading ? 'Processing...' : children}</span>
    </Button>
  );
};

// 添加一个样式标签到组件中
const style = document.createElement('style');
style.textContent = `
  .custom-button:hover {
    filter: brightness(108%);
  }
  .custom-button:active {
    filter: brightness(100%);
  }
`;
document.head.appendChild(style);

export default CustomButton;
