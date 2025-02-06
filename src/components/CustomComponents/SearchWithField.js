import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CustomSearchBar from './CustomSearchBar';
import RefreshButton from './RefreshButton';

function SearchWithField({
  searchTerm,
  setSearchTerm,
  searchField,
  setSearchField,
  searchFields,
  onFilter,
  onRefresh,
  containerStyle,
  width = "300px",
  showBorder = true,
}) {
  // Get placeholder text based on selected field
  const getPlaceholder = () => {
    if (searchField === 'all') {
      return 'Search in all fields...';
    }
    const field = searchFields.find(f => f.value === searchField);
    return field ? `Search by ${field.label}...` : 'Search...';
  };

  const handleRefresh = () => {
    // 先清空搜索状态
    setSearchTerm('');
    setSearchField('all');
    // 然后调用父组件的刷新函数
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ...containerStyle }}>
      <FormControl
        size="small"
        sx={{
          minWidth: 180,
          '& .MuiOutlinedInput-root': {
            height: '40px',
            backgroundColor: '#fff',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fbcd0b'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fbcd0b',
              borderWidth: '1px'
            }
          },
          '& .Mui-focused': {
            color: '#fbcd0b !important'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#fbcd0b'
          }
        }}
      >
        <InputLabel>Search In</InputLabel>
        <Select
          value={searchField}
          label="Search In"
          onChange={(e) => {
            setSearchField(e.target.value);
            setSearchTerm('');
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root': {
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                  },
                  minWidth: 180,
                },
              }
            }
          }}
        >
          {searchFields.map(field => (
            <MenuItem
              key={field.value}
              value={field.value}
              TouchRippleProps={{ disabled: true }}
            >
              {field.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <CustomSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder={getPlaceholder()}
        width={width}
        showBorder={showBorder}
        onFilter={onFilter}
        debounceTime={300}
      />

      {onRefresh && <RefreshButton onClick={handleRefresh} />}
    </Box>
  );
}

export default SearchWithField; 