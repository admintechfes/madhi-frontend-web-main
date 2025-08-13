import React, { useState, useEffect, useRef } from "react";
import { Box, FormControl, Select, MenuItem, InputLabel, TextField, InputAdornment, Checkbox, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function DropDownAddWithSearchManual({
  Data,
  valuekey,
  labelkey,
  label,
  placeholder,
  onChange,
  searchData,
  setSearchData,
  setSearchText,
  searchText,
  AddNewData,
  selectedValues,
  setSelectedId,
  defaultValues = [],
  defaultValues1 = [],
  bgGray = false
}) {
  const [tagName, setTagName] = useState(selectedValues);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const searchInputRef = useRef(null);




useEffect(() => {
  setTagName(selectedValues)
}, [selectedValues]);

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
  const allDataLabels = Data?.map(item => item[labelkey]);
  const allDataIds = Data?.map(item => item[valuekey]);
  if (tagName?.length === allDataLabels?.length && allDataLabels?.length > 0) {
    setSelectAllChecked(true);
  } else if (selectAllChecked && (tagName?.length === 0 || tagName?.length < allDataLabels?.length)) {
    setSelectAllChecked(false);
  }
}, [tagName, Data, selectAllChecked, labelkey, valuekey]);

useEffect(() => {
  if (searchInputRef.current) {
    searchInputRef.current.focus();
  }
}, [searchText]);

const handleChange = (event) => {
  const { value } = event.target;
  if (value.includes("Select All")) {
    if (selectAllChecked) {
      const remainingTags = tagName.filter(tag => !searchData.some(item => item[labelkey] === tag));
      setSelectAllChecked(false);
      setTagName(remainingTags);
      onChange(remainingTags);
      const remainingIds = Data.filter(item => remainingTags.includes(item[labelkey]))?.map(item => item[valuekey]);
      setSelectedId(remainingIds);
    } else {
      const allLabels = searchData?.map(item => item[labelkey]);
      const allIds = searchData?.map(item => item[valuekey]);
      setSelectAllChecked(true);
      setTagName(allLabels);
      onChange(allLabels);
      setSelectedId(allIds);
    }
  } else {
    const newValue = typeof value === 'string' ? value.split(',') : value;
    const allIds = searchData.filter(item => newValue.includes(item[labelkey]))?.map(item => item[valuekey]);
    setTagName(newValue);
    onChange(newValue);
    setSelectedId(allIds);
  }
};

const handleSearch = (e) => {
  const value = e.target.value;
  setSearchText(value);
  const filteredData = Data.filter(item => item[labelkey].toLowerCase().includes(value.toLowerCase()));
  setSearchData(filteredData);
};

return (
  <Box>
    <FormControl className="tw-min-w-[120px] tw-w-full" size="small">
      <InputLabel id="demo-select-small" className={`${bgGray ? "!tw-bg-backgroundDarkGrey !tw-text-primaryText" : "!tw-bg-none"}`}>
        {label}
      </InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={tagName}
        label={label}
        placeholder={placeholder}
        onChange={handleChange}
        renderValue={(selected) => selected.join(', ')}
        className={`${bgGray ? "!tw-bg-backgroundDarkGrey !tw-text-primaryText" : " !tw-bg-none"}`}
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
            value={searchText}
          />
        </div>
        {searchData?.length > 1 && (
          <MenuItem value="Select All">
            <Checkbox checked={selectAllChecked} name="selectAll" color="primary" />
            Select All
          </MenuItem>
        )}
        {searchData?.map((option, index) => (
          <MenuItem key={index} value={option[labelkey]}>
            <Checkbox checked={tagName.includes(option[labelkey])} name={option[valuekey]} color="primary" />
            {option[labelkey]}
          </MenuItem>
        ))}
        {searchText?.length > 1 && (
          <Button className="!tw-text-[#3892FF] !tw-px-8 !tw-py-2" onClick={AddNewData}>
            + Add<span className="tw-ml-1">"{searchText}"</span>
          </Button>
        )}
      </Select>
    </FormControl>
  </Box>
);
}
