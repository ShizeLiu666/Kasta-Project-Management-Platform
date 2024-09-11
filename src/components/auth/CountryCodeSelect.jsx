import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { FormGroup, Label } from "reactstrap"; // Import FormGroup and Label for consistent styling

const countryOptions = [
  { en: "Australia", zh: "澳大利亚", locale: "AU", code: "61" },
  { en: "New Zealand", zh: "新西兰", locale: "NZ", code: "64" },
  { en: "China", zh: "中国", locale: "CN", code: "86" },
  { en: "Thailand", zh: "泰国", locale: "TH", code: "66" },
  { en: "Canada", zh: "加拿大", locale: "CA", code: "1" },
  { en: "United Arab Emirates", zh: "阿联酋", locale: "AE", code: "971" },
  { en: "Indonesia", zh: "印尼", locale: "ID", code: "62" },
  { en: "Philippines", zh: "菲律宾", locale: "PH", code: "63" },
  { en: "Vietnam", zh: "越南", locale: "VN", code: "84" },
  { en: "Malaysia", zh: "马来西亚", locale: "MY", code: "60" },
  { en: "Maldives", zh: "马尔代夫", locale: "MV", code: "960" },
  { en: "Fiji", zh: "斐济", locale: "FJ", code: "679" },
  { en: "Hong Kong(China)", zh: "中国香港", locale: "HK", code: "852" },
  { en: "Singapore", zh: "新加坡", locale: "SG", code: "65" },
  { en: "South Korea", zh: "韩国", locale: "KR", code: "82" },
  { en: "Japan", zh: "日本", locale: "JP", code: "81" },
  { en: "United States of America (USA)", zh: "美国", locale: "US", code: "1" },
];

const CountryCodeSelect = ({ value, onChange }) => {
  return (
    <FormGroup className="mb-3"> {/* Maintain consistent margin with other fields */}
      <Label for="countryCode">Country Code</Label>
      <Autocomplete
        id="country-code-select"
        options={countryOptions}
        getOptionLabel={(option) => `${option.en} (+${option.code})`}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.code}>
            <img
              loading="lazy"
              width="20"
              src={`https://flagcdn.com/w20/${option.locale.toLowerCase()}.png`}
              alt=""
              style={{ marginRight: 8 }}
            />
            {option.en} (+{option.code})
          </Box>
        )}
        value={value}
        onChange={(event, newValue) => onChange(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Choose a country"
            fullWidth
            InputLabelProps={{ shrink: true }} // Keep label in place
            sx={{
              ".MuiOutlinedInput-root": {
                borderRadius: "4px", // Add input field style
              },
              "& .MuiOutlinedInput-input": {
                padding: "10px", // Adjust padding for consistency
              },
            }}
          />
        )}
      />
    </FormGroup>
  );
};

export default CountryCodeSelect;