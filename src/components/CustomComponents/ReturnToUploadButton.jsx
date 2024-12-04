import React from 'react';
import CustomButton from './CustomButton';
import KeyboardReturnTwoToneIcon from '@mui/icons-material/KeyboardReturnTwoTone';

const ReturnToUploadButton = ({ 
  onReturnToInitialStep, 
  jumpToStep,
  style // 允许自定义样式
}) => {
  const handleReturnClick = () => {
    // 先跳转到第一步
    jumpToStep(0);
    
    // 然后重置状态
    if (typeof onReturnToInitialStep === 'function') {
      onReturnToInitialStep();
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginTop: '20px',
      marginBottom: '20px',
      ...style 
    }}>
      <CustomButton
        onClick={handleReturnClick}
        icon={<KeyboardReturnTwoToneIcon />}
        style={{
          backgroundColor: "#253866",
          borderColor: "#253866",
          minWidth: '200px'
        }}
      >
        Return to Upload
      </CustomButton>
    </div>
  );
};

export default ReturnToUploadButton;