import React, { useEffect, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

export default function DropDownwithCheckmarks(props) {
	const [permissionAccess, setPermissionAccess] = useState([]);

	useEffect(() => {
		setPermissionAccess(props?.data[props?.accessName]?.rolePermissions);
	}, [props.data]);

	let a = props?.data?.[props?.accessName]?.allPermissions;


	const handleChange = (event) => {
		const {
			target: { value },
		} = event;
		const newValues = typeof value === 'string' ? value.split(',') : value;

		let updatedValues = newValues;

		if (newValues.length === 1 && newValues.includes('all_access')) {
			updatedValues = a?.map((item) => item.value);
		}

		if (newValues.length === 3 && newValues.includes('all_access')) {
			updatedValues = updatedValues.filter((item) => item !== 'all_access');
			// if(!updatedValues.includes('View')){

			//     updatedValues = data.map((item) => item.name);
			// }
		}

		if (newValues.length === 3 && !newValues.includes('all_access')) {
			updatedValues = a?.map((item) => item.value);
		}

		if (permissionAccess.length === 4 && newValues.length === 3 && !newValues.includes('all_access')) {
			updatedValues = [];
		}

		// if (newValues.length >=1 && !newValues.includes('All') && !newValues.includes('View')) {
		// 	updatedValues = [...newValues, 'View'];
		// }

		if (newValues.length >= 1 && newValues[newValues.length - 1] === 'all_access') {
			updatedValues = a?.map((item) => item.value);
		}
		if (newValues.length !==a.length && newValues.includes('all_access') && newValues[newValues.length - 1] !== 'all_access') {
			updatedValues = updatedValues.filter((item) => item !== 'all_access');
		}
		if (newValues.length ===a.length-1 && !newValues.includes('all_access') ) {
			updatedValues = a?.map((item) => item.value);
		}
		if (permissionAccess.includes('all_access') && !newValues.includes('all_access')) {
			updatedValues = []
		}

		props.onChange(updatedValues, props?.accessName);

		setPermissionAccess(updatedValues);
	};


	return Array.isArray(props?.data[props?.accessName]?.rolePermissions) ? (
		<div className="tw-py-3">
			<FormControl sx={{ width: 300 }}>
				<InputLabel id="demo-multiple-checkbox-label">Assign Access</InputLabel>
				<Select
					labelId="demo-multiple-checkbox-label"
					id="demo-multiple-checkbox"
					multiple
					value={props?.data[props?.accessName]?.rolePermissions}
					onChange={handleChange}
					input={<OutlinedInput label="Assign Access" />}
					renderValue={(selected) =>
						selected
							.map((it) => a.find((el) => el.value === it))
							.map((el) => el?.label)
							.join(',')
					}
					MenuProps={MenuProps}
				>
					{a?.map((item) => (
						<MenuItem key={item.value} value={item.value}>
							<Checkbox checked={permissionAccess?.includes(item?.value)} />
							<ListItemText primary={item.label} />
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	) : null;
}
