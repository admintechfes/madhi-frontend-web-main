import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableContainer, TableHead, TableRow, TableSortLabel, Paper, CircularProgress, Pagination, Stack, TableFooter, TableCell as MuiTableCell, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { Dropdown } from '../Select';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';
import { fillPerPageNum } from '../../Users/duck/userSlice';
import { useDispatch } from 'react-redux';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';



const StyledTableCell = styled(MuiTableCell)(() => ({
	[`&.${MuiTableCell.body}`]: {
		fontSize: 15,
		fontFamily: 'roboto',
		color: '#666',
	},
}));

const StyledTableRow = styled(TableRow)(() => ({
	'&:nth-of-type(odd)': { backgroundColor: 'rgba(255, 196, 12, 0.02)' },
	'&:last-child td, &:last-child th': { border: 0 },
}));

function descendingComparator(a, b, orderBy) {
	let valueA = a[orderBy];
	let valueB = b[orderBy];

	if (valueA === null || valueA === '') valueA = undefined;
	if (valueB === null || valueB === '') valueB = undefined;

	if (typeof valueA === 'string') valueA = valueA.toLowerCase();
	if (typeof valueB === 'string') valueB = valueB.toLowerCase();

	if (valueB === undefined && valueA !== undefined) {
		return -1;
	}
	if (valueA === undefined && valueB !== undefined) {
		return 1;
	}
	if (valueB < valueA) {
		return -1;
	}
	if (valueB > valueA) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array?.map((el, index) => [el, index]);
	stabilizedThis?.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis?.map((el) => el[0]);
}

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'calories';
const DEFAULT_ROWS_PER_PAGE = 10;

function EnhancedTableHead(props) {
	const { order, orderBy, onRequestSort, columns } = props;
	const createSortHandler = (newOrderBy) => (event) => {
		onRequestSort(event, newOrderBy);
	};
	return (
		<TableHead>
			<TableRow>
				{columns.map((headCell, index) => (
					<StyledTableCell
						key={index}
						align={headCell.align ? 'right' : 'left'}
						sortDirection={orderBy === headCell.id ? order : false}
						style={headCell.width ? { minWidth: `${headCell.width}px` } : { minWidth: '150px' }}
					>
						{headCell.sort !== undefined ? (
							<TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)} sx={{ padding: '0' }}>
								{headCell.label}
								{orderBy === headCell.id ? (
									<Box component="span" sx={visuallyHidden}>
										{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
									</Box>
								) : null}
							</TableSortLabel>
						) : (
							<TableSortLabel className="tw-p-4 tw-text-xs">{headCell.label}</TableSortLabel>
						)}
					</StyledTableCell>
				))}
			</TableRow>
		</TableHead>
	);
}
EnhancedTableHead.propTypes = {
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	columns: PropTypes.array.isRequired,
};
function TableMaster(props) {
	const loader = useSelector((state) => state.loader.openTableLoader);
	const [visibleRows, setVisibleRows] = useState([]);
	const [order, setOrder] = useState(DEFAULT_ORDER);
	const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
	const [rowsPerPage, setRowsPerPage] = useState(props.limitPerPage);
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(1);
	const [data, setData] = useState(props.data);
	const dispatch = useDispatch()

	// useEffect(() => {
	// 	setData(props.data);
	// }, [props.data]);

	useEffect(() => {
		const sortedRows = stableSort(props.data, getComparator(order, orderBy));
		const paginatedRows = sortedRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
		// let rowsOnMount = stableSort(props.data, getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY));

		setVisibleRows(paginatedRows);
	}, [props.data, order, orderBy, page, rowsPerPage]);

	const onChangeFilter = (e, page) => {
		setPage(1);
		setRowsPerPage(e);
		props.setLimitPerPage(e);
		// dispatch(fillPerPageNum(e))
		props.setPage(1)
		props?.dispatchperPage && dispatch(props?.dispatchperPage(e))
	};

	const listPerPage = [
		{ name: '10 per page', page: 10 },
		{ name: '20 per page', page: 20 },
		{ name: '50 per page', page: 50 },
	];

	const handleClick = (event, row, id) => {
		const selectedIndex = selected.indexOf(row.name);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, row.name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}
		if (props.onNavigateDetails) {
			props.onNavigateDetails(id, row.status);
		}

		setSelected(newSelected);
		if (props.onRowClick) {
			props.onRowClick(id);
		}
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
		props.onPageChange(newPage);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	const handleRequestSort = useCallback(
		(event, newOrderBy) => {
			const isAsc = orderBy === newOrderBy && order === 'asc';
			const toggledOrder = isAsc ? 'desc' : 'asc';
			setOrder(toggledOrder);
			setOrderBy(newOrderBy);
		},
		[order, orderBy]
	);
	const customTooltipStyles = {
		backgroundColor: 'white',
		color: 'black',
		fontSize: '0.875rem',
		borderRadius: '0.25rem',
		padding: '0.5rem',
	};
	const customArrowStyles = {
		color: 'black',
	};


	return (
		<Box sx={{ width: '100%' }}>
			<>
				{loader ? (
					<div className="tw-text-center tw-py-5">
						<CircularProgress />
					</div>
				) : (
					<TableContainer>
						<Table
							stickyHeader
							sx={{
								width: props.tab === 1 ? '100%' : props.scrollable ? (props.columns && props.columns.length > 5 ? '100%' : '100%') : '100%',
								overflowX: 'scroll',
							}}
							aria-label="sticky table"
						>
							<EnhancedTableHead columns={props.columns} numSelected={selected.length} rowCount={visibleRows?.length} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
							<TableBody>
								{visibleRows
									? visibleRows.map((row, index) => {
										const isItemSelected = isSelected(row.name);
										return (
											<StyledTableRow key={index} hover onClick={(event) => handleClick(event, row, row.id)} aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected} sx={{ cursor: 'pointer' }}>
												{Object.values(props.columns).map((value, index) => {
													if (value.id === 'created_at') {
														return (
															<StyledTableCell key={index} align={value.align ? value.align : 'left'}>
																{MyComponent(row[value.id]) || '-'}
															</StyledTableCell>
														);
													}
													if (value.id === 'assigned_supervisors') {
														const words = row[value.id]?.split(',');
														const selectedWords = words?.slice(0, 2);
														let result = selectedWords?.join(',');
														if (words?.length > 3) {
															result += '...';
														}
														return (
															<StyledTableCell key={index} align={value?.align ? value?.align : 'left'}>
																{result || '-'}
															</StyledTableCell>
														);
													}

													if (value.id === 'assigned_village_area' || value.id === 'assigned_districts') {
														const words = row[value.id]?.split(',');
														const selectedWords = words?.slice(0, 2);
														let result = selectedWords?.join(',');
														if (words?.length > 3) {
															result += '...';
														}
														return (
															<StyledTableCell key={index} align={value.align ? value.align : 'left'}>
																{result || '-'}
															</StyledTableCell>
														);
													}

													if (value.id === 'tags') {
														const words = row[value.id]?.split(',');
														const selectedWords = words?.slice(0, 2);
														let result = selectedWords?.join(',');
														if (words?.length > 3) {
															result += '...';
														}
														return (
															<StyledTableCell key={index} align={value.align ? value?.align : 'left'}>
																{result || '-'}
															</StyledTableCell>
														);
													}

													if (value.id === 'assigned_senior_supervisors') {
														const words = row[value.id] ? row[value.id].split(',') : null;
														const selectedWords = words ? words.slice(0, 2) : null;
														let result = selectedWords ? selectedWords.join(',') : row[value.id];
														if (words) {
															if (words?.length > 3) {
																result += '...';
															}
														}

														return (
															<StyledTableCell key={index} align={value.align ? value.align : 'left'}>
																{result || '-'}
															</StyledTableCell>
														);
													}
													if (value.id === 'assigned_cews') {
														const words = row[value.id].split(',');
														const selectedWords = words.slice(0, 2);
														let result = selectedWords.join(',');
														if (words.length > 3) {
															result += '...';
														}
														return (
															<StyledTableCell key={index} align={value.align ? value.align : 'left'}>
																{result || '-'}
															</StyledTableCell>
														);
													}

													if (value.id === 'whatsappStatus') {
														let BackgroundTheme, ColorTheme;


														switch (row[value.id]?.toLowerCase()) {
															case "error":
															case 'pending':
																BackgroundTheme = '#F4E6E6';
																ColorTheme = '#EB5757';
																break;
															case 'closed':
																BackgroundTheme = 'rgba(56, 146, 255, 0.20)';
																ColorTheme = '#3892FF';
																break;
															case 'delivered':
															case 'resubmitted':
															case "initiated":
															case 'sent to glific':
															case 'sent to kalerya':
																BackgroundTheme = '#3892FF33';
																ColorTheme = '#3892FF';
																break;
															case 'not interested':
															case 'unavailable':
																BackgroundTheme = '#EB57571A';
																ColorTheme = '#EB5757';
																break;
															case 'shared':
															case 'sent':
																BackgroundTheme = '#FFC40C33';
																ColorTheme = '#F39C35';
																break;
															case 'not initiated':
																BackgroundTheme = '#DDDDDD';
																ColorTheme = '#666666';
																break;
															case 'completed':
																BackgroundTheme = '#57C79633';
																ColorTheme = '#57C796';
																break;
															case 'to be redone':
																BackgroundTheme = '#ddf4ea';
																ColorTheme = '#F39C35';
																break;
															case 'verified':
																BackgroundTheme = '#57C79633';
																ColorTheme = '##68cda1';
																break;
															default:
																BackgroundTheme = '#DDDDDD';
																ColorTheme = '#666666';
																break;
														}
														return (
															<StyledTableCell key={index} align={value.align ? value.align : 'left'}>
																<Tooltip
																	title={row[value.id]?.toLowerCase() === 'error' ? row?.whatsappErrorTitle : ''}
																	arrow
																	placement="top"
																	PopperProps={{
																		modifiers: [
																			{
																				name: 'offset',
																				options: {
																					offset: [0, 8],
																				},
																			},
																		],
																	}}
																	componentsProps={{
																		tooltip: {
																			sx: customTooltipStyles,
																		},
																		arrow: {
																			sx: customArrowStyles,
																		},
																	}}
																>
																	{row[value.id] ? <div
																		style={{
																			backgroundColor: BackgroundTheme,
																			color: ColorTheme,
																			padding: '0.25rem',
																			borderRadius: '0.25rem',
																			textAlign: 'center',
																			fontSize: '0.875rem',
																			display: 'inline-block',
																		}}
																		className="tw-py-1 tw-rounded tw-px-2 tw-text-center tw-text-sm tw-w-fit"
																	>
																		{row[value.id]}
																	</div> : "-"}
																	{row[value.id]?.toLowerCase() === 'error' && <span>{row[value.id]?.toLowerCase() === 'error' && <ErrorOutlineIcon style={{ marginRight: '0.25rem' }} />}</span>}
																</Tooltip>
															</StyledTableCell>
														);
													}

													if (value.id === 'assigned_village_area') {
														const formatText = (text) => {
															return text?.toString()?.split(",").join(", ");
														};
														return (
															<StyledTableCell key={index} align={value.align ? value.align : 'left'}>
																{row[value.id] && formatText(row[value.id]) || '-'}
															</StyledTableCell>
														);
													}
													return (
														<StyledTableCell key={index} align={value.align ? value.align : 'left'}>
															{row[value.id] || '-'}
														</StyledTableCell>
													);
												})}
											</StyledTableRow>
										);
									})
									: null}
							</TableBody>
						</Table>
					</TableContainer>
				)}
				<TableFooter className="!tw-flex tw-justify-between tw-items-center">
					<Stack spacing={2} className="tw-my-[18px] tw-mx-4 ">
						<Pagination count={props.paginate.totalPages} page={props.page} onChange={handleChangePage} defaultPage={props.paginate.page} color="primary"></Pagination>
					</Stack>
					<div className="tw-mr-10 tw-w-40  ">
						<Dropdown options={listPerPage} onChange={(e) => onChangeFilter(e, 'page')} value={props.limitPerPage} valuekey="page" labelkey="name" bgGray />
					</div>
				</TableFooter>
			</>
		</Box>
	);
}

export default TableMaster;

export const formatDate = (dateString) => {
	const date = new Date(dateString);
	const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())}, ${date.getFullYear()}`;
	return formattedDate;
};

function getMonthName(monthIndex) {
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return monthNames[monthIndex];
}

function MyComponent(inp) {
	const formattedDate = formatDate(inp);

	return formattedDate;
}
