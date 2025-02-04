import React, { useState } from "react";
import { Box } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import CustomButton from "../CustomComponents/CustomButton";

function DateRangeFilter({ onDateChange }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const today = new Date();

  const handleStartDateChange = (date) => {
    setStartDate(date);
    onDateChange(date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateChange(startDate, date);
  };

  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    onDateChange(null, null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          maxDate={today}
          open={startDateOpen}
          onOpen={() => setStartDateOpen(true)}
          onClose={() => setStartDateOpen(false)}
          slotProps={{
            textField: {
              size: 'small',
              onClick: () => setStartDateOpen(true),
              sx: {
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#fbcd0b',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fbcd0b',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#fbcd0b',
                }
              }
            },
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  border: '1px solid #fbcd0b',
                },
                '& .MuiPickersDay-root.Mui-selected': {
                  backgroundColor: '#fbcd0b',
                }
              }
            }
          }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          minDate={startDate}
          maxDate={today}
          disabled={!startDate}
          open={endDateOpen}
          onOpen={() => setEndDateOpen(true)}
          onClose={() => setEndDateOpen(false)}
          slotProps={{
            textField: {
              size: 'small',
              onClick: () => startDate && setEndDateOpen(true),
              sx: {
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: startDate ? '#fbcd0b' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: startDate ? '#fbcd0b' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&.Mui-disabled': {
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    }
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: startDate ? '#fbcd0b' : 'rgba(0, 0, 0, 0.6)',
                }
              }
            },
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  border: '1px solid #fbcd0b',
                },
                '& .MuiPickersDay-root.Mui-selected': {
                  backgroundColor: '#fbcd0b',
                }
              }
            }
          }}
        />
      </LocalizationProvider>
      {(startDate || endDate) && (
        <CustomButton
          onClick={clearDateFilter}
          icon={<FilterAltOffIcon />}
          style={{
            minWidth: 'auto',
            height: '38px',
            padding: '0 12px'
          }}
        >
          Clear Filter
        </CustomButton>
      )}
    </Box>
  );
}

export default DateRangeFilter; 