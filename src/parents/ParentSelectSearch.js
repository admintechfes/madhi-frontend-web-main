import React, { useEffect, useState } from "react";
import { Box, FormControl, Select, MenuItem, InputLabel, TextField, InputAdornment, Checkbox, Button, ListSubheader } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default React.memo(function ParentSelectSearch(props) {
  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useState(props.options);
  const ITEM_HEIGHT = props.height ? props.height : 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    autoFocus: false,
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 6.0 + ITEM_PADDING_TOP,
        width: 220,
      },
    },
  };

  useEffect(() => {
    if (props.options) {
      setSearchData(props.options);
    }
  }, [props.options])

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    props.onChange(selectedValue);
  };

  const handleSearch = (e) => {
    let value = e.target.value;
    setSearchText(value);
    const filteredData = props.options.filter((item) => item.name?.toLowerCase().includes(value?.toLowerCase()) || item?.full_name?.toLowerCase().includes(value?.toLowerCase()) || item?.ConductedBy?.toLowerCase().includes(value?.toLowerCase())
    ||  item?.label?.toLowerCase().includes(value?.toLowerCase()) || item?.title?.toLowerCase().includes(value?.toLowerCase())
    );
    setSearchData(filteredData);
  };

  const handleClick = (data) => {
		if(props?.Obj){
			props?.setObj(data)
		}
	}

  return (
    <FormControl className="tw-min-w-[120px] tw-w-full" size="small" disabled={props.disabled}>
      <InputLabel id="demo-select-small" className={`${props.bgGray ? "!tw-bg-backgroundDarkGrey  !tw-text-primaryText" : "!tw-bg-none"}`}>
        {props.label}
      </InputLabel>
      <Select labelId="demo-select-small" id="demo-select-small" value={props.value || ''} label={props.label}
        placeholder={props.placeholder} onChange={handleChange} className={`${props.bgGray ? "!tw-bg-backgroundDarkGrey  !tw-text-primaryText" : " !tw-bg-none"}`}
        MenuProps={MenuProps} onClose={() => {
          setSearchText("")
          setSearchData(props.options)
        }}>
        <ListSubheader>
          <TextField size="small" autoFocus placeholder="Type to search..." fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            value={searchText} onChange={handleSearch} onKeyDown={(e) => {
              if (e.key !== "Escape") {
                e.stopPropagation();
              }
            }}
          />
        </ListSubheader>
        {searchData?.length == 0 ? <span className="tw-flex tw-justify-center tw-text-grey">No Data Found</span> : searchData?.map((option, index) => (
          <MenuItem key={index} onClick={() => handleClick(option)} value={option[props.valuekey]} >
            {option[props.labelkey]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
})
