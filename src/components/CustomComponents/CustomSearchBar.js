import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';


const CustomSearchBar = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...",
  width = "300px",
  height = "40px",
  backgroundColor = "#fff",
  borderRadius = "4px",
  fontSize = "14px",
  iconColor = "#6c757d",
  onFilter,
  debounceTime = 300,
  showBorder = true
}) => {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onFilter) {
      const timeout = setTimeout(() => {
        onFilter(value);
      }, debounceTime);
      return () => clearTimeout(timeout);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onFilter) {
      onFilter('');
    }
  };

  return (

    <TextField
      value={searchTerm}
      onChange={handleSearchChange}
      placeholder={placeholder}
      variant="outlined"
      size="small"
      sx={{
        width,
        '& .MuiOutlinedInput-root': {
          height,
          backgroundColor,
          '& fieldset': { // 默认边框
            borderColor: showBorder ? '#ced4da' : 'transparent',
          },
          '&:hover fieldset': { // hover 状态边框
            borderColor: '#fbcd0b',
          },
          '&.Mui-focused fieldset': { // focus 状态边框
            borderColor: '#fbcd0b',
            borderWidth: '1px',
          },
        },
        '& .MuiInputBase-input': {
          fontSize,
          padding: '8px 14px',
          paddingLeft: '40px', // 为搜索图标留出空间
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ position: 'absolute', left: '8px' }}>
            <SearchIcon sx={{ color: iconColor }} />
          </InputAdornment>
        ),
        endAdornment: searchTerm && (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClear}
              size="small"
              sx={{
                color: iconColor,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#333',
                },
                '& .MuiTouchRipple-root': {
                  display: 'none'
                }
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />

  );
};

export default CustomSearchBar;