import React from 'react';
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
    onFilter, // 自定义过滤函数
    debounceTime = 100,
    autoFocus = false,
    disabled = false,
    showBorder = false,  // 新增边框显示选项
}) => {
  // 防抖处理
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // 处理搜索输入
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onFilter) {
      debounce(onFilter, debounceTime)(value);
    }
  };

  // 清除搜索内容
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
    border: showBorder ? '1px solid #ced4da' : 'none',  // 根据 showBorder 决定是否显示边框
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

  const clearIconStyle = {
    position: 'absolute',
    right: '10px',
    top: '53%',
    transform: 'translateY(-50%)',
    color: iconColor,
    cursor: 'pointer',
    zIndex: 2,
    display: searchTerm ? 'block' : 'none',
  };

  const inputStyle = {
    paddingLeft: '41px',
    paddingRight: '35px',
    fontSize: fontSize,
    border: 'none',
    backgroundColor: 'transparent',
    height: '100%',
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
        <ClearIcon 
          style={clearIconStyle}
          onClick={handleClear}
        />
      </InputGroup>
    </div>
  );
};

export default CustomSearchBar;