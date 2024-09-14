// SearchComponent.js
import React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

// SearchComponent.js
const SearchComponent = ({ searchTerm, setSearchTerm, placeholder = "Search..." }) => {
    return (
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'flex-end', // Align items at the bottom
          width: 250,
          marginRight: '10px',
          border: 'none',
          boxShadow: 'none'
        }}
        onSubmit={(e) => e.preventDefault()}  // Prevent form submission
      >
        <InputBase
          sx={{
            ml: 1,
            flex: 1
          }}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputProps={{ 'aria-label': 'search project' }}
        />
        <IconButton
          type="button"
          sx={{
            p: '5px'
          }}
          aria-label="search"
          onClick={() => console.log("Search functionality here")}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    );
  };
  
  export default SearchComponent;  
