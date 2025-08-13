import * as React from 'react';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField } from '@mui/material';

export function BasicDatePicker(props) {
	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<DatePicker {...props} slotProps={{ textField: { size: 'small' } }} label={props.label} renderInput={(params) => <TextField fullWidth size='small' {...params} />} />
		</LocalizationProvider>
	);
}
