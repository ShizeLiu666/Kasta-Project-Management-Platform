import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Box } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import CustomButton from "../CustomComponents/CustomButton";

const DateRangeFilter = forwardRef(({ onDateChange, value, onValidityChange }, ref) => {
  const [startDate, setStartDate] = useState(value?.startDate || null);
  const [endDate, setEndDate] = useState(value?.endDate || null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const today = new Date();

  // 检查日期选择的有效性
  useEffect(() => {
    const isValid = (!startDate || (startDate && endDate));
    onValidityChange?.(isValid);
  }, [startDate, endDate, onValidityChange]);

  // Update local state when value prop changes
  useEffect(() => {
    setStartDate(value?.startDate || null);
    setEndDate(value?.endDate || null);
  }, [value]);

  // When startDate changes, check if endDate needs to be cleared
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setEndDate(null);
      onDateChange(startDate, null);
    }
  }, [startDate, endDate, onDateChange]);

  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    onDateChange(null, null);  // 只通知父组件日期已重置，不触发刷新
  };

  useImperativeHandle(ref, () => ({
    reset: clearDateFilter,
    getValues: () => ({ startDate, endDate })
  }));

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(null);
      onDateChange(date, null);
    } else {
      onDateChange(date, endDate);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateChange(startDate, date);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'stretch', md: 'center' },
      gap: 2 
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        flex: 1
      }}>
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
                  },
                  width: { xs: '100%', md: '230px' }
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
                      cursor: 'not-allowed',
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '& .MuiInputBase-input': {
                        cursor: 'not-allowed',
                        '-webkit-text-fill-color': 'rgba(0, 0, 0, 0.38)',
                      }
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: startDate ? '#fbcd0b' : 'rgba(0, 0, 0, 0.6)',
                  },
                  width: { xs: '100%', md: '230px' }
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
      </Box>
      {(startDate || endDate) && (
        <CustomButton
          onClick={clearDateFilter}
          icon={<EventRepeatIcon />}
          style={{
            minWidth: { xs: '100%', md: 'auto' },
            height: '38px',
            padding: '0 12px',
            width: { xs: '100%', md: '150px' },
            backgroundColor: '#fff',
            color: '#6c757d',
            border: '1px solid #6c757d'
          }}
        >
          Clear Date
        </CustomButton>
      )}
    </Box>
  );
});

DateRangeFilter.displayName = 'DateRangeFilter';

export default DateRangeFilter; 