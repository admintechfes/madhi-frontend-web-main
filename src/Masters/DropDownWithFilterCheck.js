import * as React from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  TextField,
  InputAdornment,
  ListSubheader
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MENU_WIDTH = 250; // Fixed menu width

const getMenuProps = () => ({
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: MENU_WIDTH,
    },
  },
});

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

export default function DropDownWithFilterCheck(props) {
  // const [personName, setPersonName] = React.useState(props?.value||[]);
  const [searchText, setSearchText] = React.useState('');



  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    // setPersonName(value);

    if (props.onChange) {
      props.onChange(value);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    props.searchText(e.target.value); 
  };

  const debouncedSearch = debounce(handleSearch, 300);

  const filteredOptions = props.options.filter((option) =>
    option[props.labelkey].toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box>
      <FormControl className="!tw-min-w-[180px] tw-w-full" disabled={props.disabled} size="small">
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
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={props?.value||[]}
          onChange={handleChange}
          input={<OutlinedInput label= {props.label}/>}
          renderValue={(selected) => {
            const values = selected.map((value) => 
              props.options.find(option => option[props.valuekey] === value)?.[props.labelkey]
            ).filter(Boolean); // Filter out undefined/null values
            
            return values.length > 0 ? values.join(', ') : ''; // Apply join only when data is found
          }}
          MenuProps={getMenuProps()}
          label={props.label}
          // sx={{ width: `${props?.selectWidth}? ${props?.selectWidth}:'180px'` }} // Set fixed width here
          className="!tw-w-[180px]" 
        >
          {/* <ListSubheader> */}
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
            {/* </ListSubheader> */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <MenuItem key={option[props.valuekey]} value={option[props.valuekey]} >
                <Checkbox checked={props?.value.indexOf(option[props.valuekey]) > -1} />
                <ListItemText primary={option[props.labelkey]}  />
              </MenuItem>
            ))
          ) : (
            <MenuItem sx={{ display: 'flex', justifyContent: 'center' }} disabled>
              No Data
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
