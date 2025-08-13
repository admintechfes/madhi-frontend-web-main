import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  InputAdornment,
  ListSubheader
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export default function DropDownWithSearch(props) {
  const [searchText, setSearchText] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleChange = (event) => {
    const selectedValue = event.target.value;
    props.onChange(selectedValue);
    setSearchText("");
    // dispatch(props.listSearch());
  };

  const debouncedSearch = debounce((text) => {
    if (text) {
      dispatch(props.listSearch(text));
    }
  }, 1000);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    props.searchText(e.target.value); 
  };

  const handleDropdownOpen = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setSearchText("");
    // dispatch(props.listSearch());
    setIsDropdownOpen(false);
  };

  return (
    <Box>
      <FormControl className="!tw-min-w-[180px] tw-w-full" size="small" disabled={props.disabled}>
        <InputLabel
          id="demo-select-small"
          className={`${
            props.bgGray
              ? "!tw-bg-backgroundDarkGrey  !tw-text-primaryText"
              : " !tw-bg-none"
          }  `}
        >
          {props.label}
        </InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={props.value || ""}
          label={props.label}
          placeholder={props.placeholder}
          onChange={handleChange}
          className={`${
            props.bgGray
              ? "!tw-bg-backgroundDarkGrey  !tw-text-primaryText"
              : " !tw-bg-none"
          }  `}
          MenuProps={{ autoFocus:false, PaperProps: { sx: { maxHeight: 260 } } }}
          onOpen={handleDropdownOpen}
          onClose={handleDropdownClose} 
        >
          <ListSubheader>
            <TextField
              size="small"
              sx={{ paddingTop: '10px', paddingBottom: '10px', padding:'8px' }}
              autoFocus
              placeholder="Type to search..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              onChange={handleSearch}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  e.stopPropagation();
                }
              }}
              value={searchText}
            />
            </ListSubheader>
            {	props?.options?.length > 0 ? (
							props?.options?.map((option, index) => (
								<MenuItem className="tw-text-SecondaryTextColor" key={index} value={option[props.valuekey]}>
									{option[props.labelkey]}
								</MenuItem>
							))
						) : (
							<MenuItem sx={{ display: 'flex', justifyContent: 'center' }} disabled className="tw-text-SecondaryTextColor">
								No Data
							</MenuItem>
						)}
          
        </Select>
      </FormControl>
    </Box>
  );
}
