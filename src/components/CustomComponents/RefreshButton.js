import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';

const RefreshButton = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      style={{
        background: 'none',
        border: 'none',
        marginLeft: '5px',
        padding: '8px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color 0.2s',
        // cursor: isLoading ? 'wait' : 'pointer'
      }}
      onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#f0f0f0')}
      onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <RefreshIcon 
        sx={{ 
          color: isLoading ? '#999' : '#666',
          animation: isLoading ? 'spin 1s linear infinite' : 'none'
        }} 
      />
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
};

export default RefreshButton;