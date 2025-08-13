import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableContainer, TableHead, TableRow, TableSortLabel, Paper, CircularProgress, Pagination, Stack, TableFooter, Button } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { Dropdown } from '../Select';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router';
import moment from 'moment';

const StyledTableCell = styled(TableCell)(() => ({
	[`&.${tableCellClasses.body}`]: {
		fontSize: 15,
		fontFamily: 'Roboto',
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
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
	const createSortHandler = (newOrderBy) => (event) => {
		onRequestSort(event, newOrderBy);
	};

	return (
		<TableHead>
			<TableRow>
				{props.columns.map((headCell) => {
					if (headCell.id == 'recording_url') {
						return (
							<StyledTableCell
								key={headCell.id}
								align={headCell.numeric ? 'right' : 'left'}
								padding={headCell.disablePadding ? 'none' : 'normal'}
								sortDirection={orderBy === headCell.id ? order : false}
								style={
									headCell.width
										? { minWidth: `${headCell.width}px`, position: 'sticky', right: 0, background: 'white', zIndex: 10, boxShadow: '-1px 0 10px -5px #e0e0e0' }
										: { minWidth: '150px', position: 'sticky', right: 0, background: 'white', zIndex: 10, boxShadow: '-1px 0 10px -5px #e0e0e0' }
								}
							>
								{headCell.sort !== false ? (
									<TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)}>
										{headCell.label}
										{orderBy === headCell.id ? (
											<Box component="span" sx={visuallyHidden}>
												{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
											</Box>
										) : null}
									</TableSortLabel>
								) : (
									<Box sx={{ padding: '16px', fontSize: '12px', color: '#999999' }}>{headCell.label}</Box>
								)}
							</StyledTableCell>
						);
					} else {
						return (
							<StyledTableCell
								key={headCell.id}
								align={headCell.numeric ? 'right' : 'left'}
								padding={headCell.disablePadding ? 'none' : 'normal'}
								sortDirection={orderBy === headCell.id ? order : false}
								style={headCell.width ? { minWidth: `${headCell.width}px` } : { minWidth: '150px' }}
							>
								{headCell.sort !== false ? (
									<TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)}>
										{headCell.label}
										{orderBy === headCell.id ? (
											<Box component="span" sx={visuallyHidden}>
												{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
											</Box>
										) : null}
									</TableSortLabel>
								) : (
									<Box sx={{ padding: '16px', fontSize: '12px', color: '#999999' }}>{headCell.label}</Box>
								)}
							</StyledTableCell>
						);
					}
				})}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

function EnhancedTable(props) {
	const loader = useSelector((state) => state.loader.openTableLoader);
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(1);
	const [visibleRows, setVisibleRows] = React.useState(null);
	const [order, setOrder] = React.useState(DEFAULT_ORDER);
	const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
	const [paddingHeight, setPaddingHeight] = React.useState(0);
	const [permissions, setPermissions] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		setPermissions(JSON.parse(window.localStorage.getItem('permissions')));
	}, []);

	useEffect(() => {
		setPage(props.page);
	}, [props.page]);

	const onChangeFilter = (e, page) => {
		props.setLimitPerPage(e);
		setPage(1);
		props.onPageChange(1);
	};

	const listPerPage = [
		{
			name: '10 per page',
			page: 10,
		},
		{
			name: '20 per page',
			page: 20,
		},
		{
			name: '50 per page',
			page: 50,
		},
	];

	React.useEffect(() => {
		let rowsOnMount = stableSort(props.data, getComparator(order, orderBy));
		setVisibleRows(rowsOnMount);
	}, [props.data, order, orderBy]);

	const handleRequestSort = React.useCallback(
		(event, newOrderBy) => {
			const isAsc = orderBy === newOrderBy && order === 'asc';
			const toggledOrder = isAsc ? 'desc' : 'asc';
			setOrder(toggledOrder);
			setOrderBy(newOrderBy);
			const sortedRows = stableSort(props.data, getComparator(toggledOrder, newOrderBy));
			// const updatedRows = sortedRows.slice(
			//   page * rowsPerPage,
			//   page * rowsPerPage + rowsPerPage,
			// );
			setVisibleRows(sortedRows);
		},
		[order, orderBy, page, rowsPerPage]
	);

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = props.data.map((n) => n.name);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

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

	return (
		<Box sx={{ width: '100%' }}>
			<Paper elevation={0} className="tw-w-full tw-mb-2 tw-mt-3">
				{loader ? (
					<div className="tw-text-center tw-py-5">
						<CircularProgress />
					</div>
				) : (
					<TableContainer>
						<Table
							className="table-scroll"
							stickyHeader
							sx={{
								width: props.tab === 1 ? '100%' : props.scrollable ? (props.columns && props.columns.length > 5 ? '100%' : '100%') : '100%',
								overflowX: 'scroll',
							}}
							aria-label="sticky table"
						>
							<EnhancedTableHead
								columns={props.columns}
								numSelected={selected.length}
								order={order}
								orderBy={orderBy}
								onSelectAllClick={handleSelectAllClick}
								onRequestSort={handleRequestSort}
								rowCount={props.data.length}
							/>
							<TableBody>
								{visibleRows
									? visibleRows.map((row, rowIndex) => (
											<StyledTableRow key={rowIndex} aria-checked={isSelected(row.name)} tabIndex={-1} selected={isSelected(row.name)}>
												{props.columns.map((value, colIndex) => {
													if (value.id === 'status') {
														let BackgroundTheme =
															row[value.id]?.toLowerCase() == 'answer' || row[value.id]?.toLowerCase() == 'accepted'
																? 'rgba(56, 146, 255, 0.20)'
																: row[value.id]?.toLowerCase() == 'no answer'
																? 'rgba(255, 196, 12, 0.24)'
																: row[value.id]?.toLowerCase() == 'cancelled'
																? '#DDDDDD'
																: 'rgba(254, 13, 13, 0.10)';
														let ColorTheme =
															row[value.id]?.toLowerCase() == 'answer' || row[value.id]?.toLowerCase() == 'accepted'
																? '#3892FF'
																: row[value.id]?.toLowerCase() === 'no answer'
																? '#F39C35'
																: row[value.id]?.toLowerCase() == 'no answer'
																? 'rgba(255, 196, 12, 0.24)'
																: row[value.id]?.toLowerCase() == 'cancelled'
																? '#666666'
																: '#FE0D0D';

														return (
															<StyledTableCell key={colIndex} className="!tw-flex">
																<div style={{ backgroundColor: BackgroundTheme, color: ColorTheme }} className={`tw-py-1 tw-rounded tw-px-2 tw-text-center tw-w-[120px] tw-text-sm`}>
																	{row[value.id].charAt(0).toUpperCase() + row[value.id].slice(1).toLowerCase() || '-'}
																</div>
															</StyledTableCell>
														);
													}
													if (value.id === 'calling_date') {
														return (
															<StyledTableCell key={colIndex}>
																<div>{moment(row[value.id]).format('DD MMM YYYY')}</div>
															</StyledTableCell>
														);
													}
													if (value.id === 'duration') {
														return (
															<StyledTableCell key={colIndex}>
																<div>{`${row[value.id]} sec` || '-'}</div>
															</StyledTableCell>
														);
													}
													if (value.id === 'recording_url') {
														return (
															<StyledTableCell
																align={value.align ? value.align : 'center'}
																className={value.id === 'action' ? 'last-column-cell' : ''}
																style={
																	value.id === 'recording_url'
																		? {
																				position: 'sticky',
																				right: 0,
																				backgroundColor: rowIndex % 2 !== 0 ? 'white' : 'rgb(255,254,250)',
																				'&:last-child td, &:last-child th': { border: 0 },
																				zIndex: 1,
																				boxShadow: '-1px 0 10px -5px #e0e0e0',
																		  }
																		: {}
																}
																key={colIndex}
															>
																<Button
																	variant="outlined"
																	disabled={row[value.id] === ''}
																	className={`${row[value.id] === '' ? 'tw-border-gray-400 tw-text-gray-400 tw-cursor-not-allowed' : 'tw-border-primary tw-text-primary'}`}
																>
																	<a href={row[value.id]} target="_blank" rel="noopener noreferrer" className={`${row[value.id] === '' ? 'tw-pointer-events-none' : ''}`}>
																		Play
																	</a>
																</Button>
															</StyledTableCell>
														);
													}
													return (
														<StyledTableCell
															key={colIndex}
															align={value.align ? value.align : 'left'}
															className={value.id === 'action' ? 'last-column-cell' : ''}
															style={
																value.id === 'action'
																	? {
																			position: 'sticky',
																			right: 0,
																			backgroundColor: rowIndex % 2 !== 0 ? 'white' : 'rgb(255,254,250)',
																			'&:last-child td, &:last-child th': { border: 0 },
																			zIndex: 1,
																			boxShadow: '-1px 0 10px -5px #e0e0e0',
																	  }
																	: {}
															}
														>
															{value.id === 'status' ? (
																<div style={{ backgroundColor: BackgroundTheme, color: ColorTheme }} className="tw-py-1 tw-rounded tw-px-2 tw-text-center tw-w-[120px] tw-text-sm">
																	{row[value.id].charAt(0).toUpperCase() + row[value.id].slice(1) || '-'}
																</div>
															) : value.id === 'action' ? (
																<div className="tw-flex tw-gap-4 tw-items-center">
																	<Button
																		disableElevation
																		variant="text"
																		onClick={(e) => {
																			e.stopPropagation();
																			props.handleManage(row.id);
																		}}
																	>
																		Manage
																	</Button>
																	<Button onClick={() => navigate(`/progress/${row.id}`)} disabled={row['status']?.toLowerCase() === 'yet to start'} disableElevation variant="outlined">
																		View Progress
																	</Button>
																</div>
															) : (
																<div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row[value.id] || '-'}</div>
															)}
														</StyledTableCell>
													);
												})}
											</StyledTableRow>
									  ))
									: null}
							</TableBody>
						</Table>
					</TableContainer>
				)}
				{props.paginate && props.paginate.totalPages > 1 && (
					<TableFooter className="!tw-flex tw-justify-between tw-items-center">
						<Stack spacing={2} className="tw-my-[18px] tw-mx-4">
							<Pagination count={props.paginate.totalPages} page={page} onChange={handleChangePage} defaultPage={props.paginate.page} color="primary"></Pagination>
						</Stack>
						<div className="tw-mr-10 tw-w-40  ">
							<Dropdown options={listPerPage} onChange={(e) => onChangeFilter(e, 'page')} value={props.limitPerPage} valuekey="page" labelkey="name" bgGray />
						</div>
					</TableFooter>
				)}
			</Paper>
		</Box>
	);
}

export default EnhancedTable;
