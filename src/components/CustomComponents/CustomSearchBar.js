import React, { useCallback } from 'react';
import { Input, InputGroup } from 'reactstrap';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

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
    filterKey = "name",
    onFilter,
    debounceTime = 100,
    autoFocus = false,
    disabled = false,
    showBorder = false,
}) => {
  const debouncedFilter = useCallback((value) => {
    let timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      if (onFilter) {
        onFilter(value);
      }
    }, debounceTime);
  }, [onFilter, debounceTime]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFilter(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onFilter) {
      onFilter('');
    }
  };

  const containerStyle = {
    position: 'relative',
    width: width,
  };

  const inputGroupStyle = {
    backgroundColor: backgroundColor,
    borderRadius: borderRadius,
    height: height,
    border: showBorder ? '1px solid #ced4da' : 'none',
    transition: 'all 0.3s ease',
  };

  const searchIconStyle = {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: iconColor,
    zIndex: 2,
  };

  const inputStyle = {
    paddingLeft: '41px',
    paddingRight: '35px',
    fontSize: fontSize,
    border: 'none',
    backgroundColor: 'transparent',
    height: '100%',
    position: 'relative',
    zIndex: 1,
    '&:focus': {
      boxShadow: 'none',
      borderColor: '#80bdff',
    },
  };

  return (
    <div style={containerStyle}>
      <InputGroup style={inputGroupStyle}>
        <SearchIcon style={searchIconStyle} />
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={placeholder}
          style={inputStyle}
          autoFocus={autoFocus}
          disabled={disabled}
        />
        {searchTerm && (
          <div 
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '0',
              top: '0',
              height: '100%',
              width: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            <ClearIcon 
              style={{
                color: iconColor,
                fontSize: '20px',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: '#333',
                },
              }}
            />
          </div>
        )}
      </InputGroup>
    </div>
  );
};

export default CustomSearchBar;