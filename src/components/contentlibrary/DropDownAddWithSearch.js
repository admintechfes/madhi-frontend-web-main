import React, { useState, useEffect, useRef } from "react";
import { Box, FormControl, Select, MenuItem, InputLabel, TextField, InputAdornment, Checkbox, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function DropDownAddWithSearch(props) {
  const [tagName, setTagName] = useState(props.defaultValues ? props.defaultValues : []);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const searchInputRef = useRef(null);

  const ITEM_HEIGHT = 40;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 6.0 + ITEM_PADDING_TOP,
        width: 180,
      },
    },
  };

  useEffect(() => {
    if (tagName.length === props.Data.length && props.Data.length > 0) {  //first condition
      setSelectAllChecked(true);
    }
    else if (selectAllChecked && (tagName.length === 0 || tagName.length < props.searchData?.length)) { // third conition
      setSelectAllChecked(false);
    }
  }, [tagName, props.searchData?.length, selectAllChecked]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [props.searchText]);

  const handleChange = (event) => {
    const { value } = event.target;
    if (value.includes("Select All")) {
      if (selectAllChecked) {
        // Deselect all search data
        const remainingTags = tagName.filter(tag => !props.searchData.some(item => item[props.labelkey] === tag));  // search Data only select tag data filtering
        setSelectAllChecked(false);
        setTagName(remainingTags);
        props.onChange(remainingTags);
        const remainingIds = props.Data.filter(item => remainingTags.includes(item[props.labelkey])).map(item => item[props.valuekey]); //storing the ID from already filter data 
        props?.setSelectedId && props?.setSelectedId(remainingIds);

      } else {
        // Select all search data
        const allLabels = props.searchData.map((item) => item[props.labelkey]);
        const allIds = props.searchData.map((item) => item[props.valuekey]);
        setSelectAllChecked(true);
        setTagName(allLabels);
        props.onChange(allLabels);
        props?.setSelectedId && props?.setSelectedId(allIds);
      }
    } else {
      const newValue = typeof value === 'string' ? value.split(',') : value;
      const allIds = props.searchData.filter((item) => newValue.includes(item[props.labelkey])).map((item) => item[props.valuekey]);
      setTagName(newValue);
      props.onChange(newValue);
      props?.setSelectedId && props?.setSelectedId(allIds);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    props.setSearchText(value);
    const filteredData = props.Data.filter((item) => item[props.labelkey].toLowerCase().includes(value.toLowerCase()));
    props.setSearchData(filteredData);
  };

  return (
    <Box>
      <FormControl className="tw-min-w-[120px] tw-w-full" size="small">
        <InputLabel id="demo-select-small" className={`${props.bgGray ? "!tw-bg-backgroundDarkGrey  !tw-text-primaryText" : "!tw-bg-none"}`}>
          {props.label}
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={tagName}
          label={props.label}
          placeholder={props.placeholder}
          onChange={handleChange}
          renderValue={(selected) => selected.join(', ')}
          className={`${props.bgGray ? "!tw-bg-backgroundDarkGrey  !tw-text-primaryText" : " !tw-bg-none"}`}
          MenuProps={MenuProps}
        >
          <div className="!tw-pt-2 !tw-px-4">
            <TextField
              size="small"
              type="text"
              placeholder="Type to search..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              inputRef={searchInputRef}
              onChange={handleSearch}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  e.stopPropagation();
                }
              }}
              value={props.searchText}
            />
          </div>
          {props?.searchData.length > 1 && (
            <MenuItem value="Select All">
              <Checkbox
                checked={selectAllChecked}
                name="selectAll"
                color="primary"
              />
              Select All
            </MenuItem>
          )}
          {props?.searchData?.length > 0 &&  props?.searchData?.map((option, index) => (
            <MenuItem key={index} value={option[props.labelkey]}>
              <Checkbox
                checked={tagName.indexOf(option[props.labelkey]) > -1}
                name={option[props.valuekey]}
                color="primary"
              />
              {option[props.labelkey]}
            </MenuItem>
          ))}
          {props.searchText.length > 1 && (
            <Button className="!tw-text-[#3892FF] !tw-px-8 !tw-py-2" onClick={() => props.AddNewData()}>+ Add<span className="tw-ml-1">"{props.searchText}"</span></Button>
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
