import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { FormGroup, Label } from "reactstrap"; // Import FormGroup and Label for consistent styling
import './CountryCodeSelect.css'; // Import the custom CSS

export const countryOptions = [
  { id: "au", en: "Australia", zh: "澳大利亚", locale: "AU", code: "61" },
  { id: "nz", en: "New Zealand", zh: "新西兰", locale: "NZ", code: "64" },
  { id: "cn", en: "China", zh: "中国", locale: "CN", code: "86" },
  { id: "th", en: "Thailand", zh: "泰国", locale: "TH", code: "66" },
  { id: "ca", en: "Canada", zh: "加拿大", locale: "CA", code: "1" },
  { id: "ae", en: "United Arab Emirates", zh: "阿联酋", locale: "AE", code: "971" },
  { id: "id", en: "Indonesia", zh: "印尼", locale: "ID", code: "62" },
  { id: "ph", en: "Philippines", zh: "菲律宾", locale: "PH", code: "63" },
  { id: "vn", en: "Vietnam", zh: "越南", locale: "VN", code: "84" },
  { id: "my", en: "Malaysia", zh: "马来西亚", locale: "MY", code: "60" },
  { id: "mv", en: "Maldives", zh: "马尔代夫", locale: "MV", code: "960" },
  { id: "fj", en: "Fiji", zh: "斐济", locale: "FJ", code: "679" },
  { id: "hk", en: "Hong Kong(China)", zh: "中国香港", locale: "HK", code: "852" },
  { id: "sg", en: "Singapore", zh: "新加坡", locale: "SG", code: "65" },
  { id: "kr", en: "South Korea", zh: "韩国", locale: "KR", code: "82" },
  { id: "jp", en: "Japan", zh: "日本", locale: "JP", code: "81" },
  { id: "us", en: "United States of America (USA)", zh: "美国", locale: "US", code: "1" },
];

const CountryCodeSelect = ({ value, onChange, requiredField }) => {
  return (
    <FormGroup className="mb-3">
      <Label for="countryCode">
        Country Code
        {requiredField && <span className="required-field">*</span>}
      </Label>
      <Autocomplete
        id="country-code-select"
        options={countryOptions}
        getOptionLabel={(option) => `${option.en} (+${option.code})`}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
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
        isOptionEqualToValue={(option, value) => 
          option && value && option.id === value.id
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Choose a country"
            fullWidth
            className="custom-form-control" // Apply the custom CSS class
            InputLabelProps={{ shrink: true }}
            inputProps={{
              ...params.inputProps,
              autoComplete: "nope", // 防止浏览器自动填充
            }}
          />
        )}
      />
    </FormGroup>
  );
};

// 设置默认属性
CountryCodeSelect.defaultProps = {
  requiredField: false
};

export default CountryCodeSelect;