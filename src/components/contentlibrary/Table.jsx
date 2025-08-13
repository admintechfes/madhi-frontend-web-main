import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableContainer, TableHead, TableRow, TableSortLabel, Paper, CircularProgress, Pagination, Stack, TableFooter, Checkbox, TableCell as MuiTableCell } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import UsePagination from '../Masters/Usepagination';
import { Dropdown } from '../Select';
import { visuallyHidden } from '@mui/utils';
import { useDispatch } from 'react-redux';
import { clearSelectedQuestion, fillTabSucess } from '../../contentlibrary/duck/contentlibrarySlice';

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

function EnhancedTable(props) {

	const loader = useSelector((state) => state.loader.openTableLoader);
	const [visibleRows, setVisibleRows] = useState([]);
	const [order, setOrder] = useState(DEFAULT_ORDER);
	const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
	const [rowsPerPage, setRowsPerPage] = useState(props.limitPerPage);
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(1);
	const dispatch = useDispatch();


	useEffect(() => {
		const sortedRows = stableSort(props.data, getComparator(order, orderBy));
		const paginatedRows = sortedRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
		setVisibleRows(paginatedRows);
	}, [props.data, order, orderBy, page, rowsPerPage]);

	useEffect(() => {
		setSelected(props?.selectedData)
	}, [props?.selectedData])

	const onChangeFilter = (e, page) => {
		setRowsPerPage(e);
		setPage(1);
		props.setLimitPerPage(e);
		props.setPage(1)
		props?.dispatchperPage && dispatch(props?.dispatchperPage(e))
		dispatch(fillTabSucess(""))
	};
	// Modified by nayan for accomplishing unit content feature
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			let newData = [];
			const selectedData = [...selected, ...visibleRows.filter(row => !selected.some(selectedRow => selectedRow.uuid === row.uuid))];
			newData.push(selectedData);
			setSelected(selectedData);
			props.handleSelected(selectedData)
		}
		else {
			let delectedRowIds = visibleRows.map(row => row.uuid)
			let selectedData = selected.filter(item => !delectedRowIds.includes(item.uuid));
			setSelected(selectedData);
			props.handleSelected(selectedData)
		}
	};

	const listPerPage = [
		{ name: '10 per page', page: 10 },
		{ name: '20 per page', page: 20 },
		{ name: '50 per page', page: 50 },
	];

	const handleClick = (event, row, id, index) => {
		const selectedIndex = selected.findIndex((item) => item.uuid === id);
		let newSelected = [];
		let uuid = ''

		if (selectedIndex === -1) {
			const selectedItem = props.data.find((item) => item.uuid === id);
			newSelected = [...selected, selectedItem];
		} else {
			uuid = id
			newSelected = selected.slice(selectedIndex + 1);
		}
		props.handleSelected(newSelected, uuid)
		setSelected(newSelected);

		/* Modified by nayan for accomplishing unit content feature */
		if (props.redirectFrom == 'unitContent') {
			return
		}

	};

	const handleRowClick = (id, index) => {
		if (props.onNavigateDetails) {
			props.onNavigateDetails(id, index);
		}
		if (props.onRowClick) {
			props.onRowClick(id);
		}
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
		props.onPageChange(newPage);
	};

	const isSelected = (id) => selected.findIndex((item) => item.uuid === id) !== -1;

	const handleRequestSort = useCallback(
		(event, newOrderBy) => {
			const isAsc = orderBy === newOrderBy && order === 'asc';
			const toggledOrder = isAsc ? 'desc' : 'asc';
			setOrder(toggledOrder);
			setOrderBy(newOrderBy);
		},
		[order, orderBy]
	);

	const handleDefaultChecked = (uuid) => {
		const filterData = Array.isArray(props?.selectedData) && props?.selectedData?.filter((item) => {
			return item.uuid == uuid
		})
		if (filterData?.length >= 1) return true
		return false
	}

	// Condition to check if all visible rows are selected
	const allRowsSelected = visibleRows.length > 0 && visibleRows.every((row) => selected.some((selectedRow) => selectedRow.uuid === row.uuid));

	// Condition to check if some (but not all) rows are selected
	const someRowsSelected = visibleRows.some((row) => selected.some((selectedRow) => selectedRow.uuid === row.uuid)) && !allRowsSelected;


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
							stickyHeader
							sx={{
								width: props.tab === 1 ? '100%' : props.scrollable ? (props.columns && props.columns.length > 5 ? '100%' : '100%') : '100%',
								overflowX: 'scroll',
							}}
							aria-label="sticky table"
						>
							{/* Modified by nayan for accomplishing unit content feature */}
							{props.redirectFrom == 'unitContent' ? (
								<TableHead>
									<TableRow>
										<StyledTableCell padding="checkbox">
											<Checkbox
												indeterminate={selected.length > 0 && selected.length < props.data.length}
												checked={selected.length === props.data.length}
												onChange={handleSelectAllClick}
												inputProps={{ 'aria-label': 'select all items' }}
											/>
										</StyledTableCell>
										{props.columns.map((headCell, index) => (
											<StyledTableCell
												key={index}
												align={headCell.align ? 'right' : 'left'}
												padding={headCell.disablePadding ? 'none' : 'normal'}
												style={headCell.width ? { minWidth: `${headCell.width}px` } : { minWidth: '150px' }}
											>
												<TableSortLabel className="tw-p-4 tw-text-xs">{headCell.label}</TableSortLabel>
											</StyledTableCell>
										))}
									</TableRow>
								</TableHead>
							) : (
								<TableHead>
									<TableRow>
										<StyledTableCell padding="checkbox">
											<Checkbox
												indeterminate={someRowsSelected}
												checked={allRowsSelected}
												onChange={handleSelectAllClick}
												inputProps={{ 'aria-label': 'select all items' }}
											/>
										</StyledTableCell>
										{props.columns.map((headCell, index) => (
											<StyledTableCell
												key={index}
												align={headCell.align ? 'right' : 'left'}
												sortDirection={orderBy === headCell.id ? order : false}
												style={headCell.width ? { minWidth: `${headCell.width}px` } : { minWidth: '150px' }}
											>
												{headCell.sort !== undefined ? (
													<TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={(e) => handleRequestSort(e, headCell.id)} sx={{ padding: '0' }}>
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
							)}
							{/* <EnhancedTableHead columns={props.columns} numSelected={selected.length} rowCount={visibleRows?.length} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} /> */}
							<TableBody>
								{visibleRows
									? visibleRows.map((row, index) => {
										const isItemSelected = isSelected(row.uuid);
										return (
											<StyledTableRow
												key={index}
												hover
												onClick={(e) => {
													if (props.redirectFrom === "unitContent") {
														handleClick(e, row, row.uuid)
													}
													else {
														handleRowClick(row.uuid, index + 1)
													}
												}
												}
												aria-checked={isItemSelected}
												tabIndex={-1}
												selected={isItemSelected}
												sx={{ cursor: 'pointer' }}
											>
												{/* Modified by nayan for accomplishing unit content feature */}
												{props.redirectFrom == "unitContent" ?
													<StyledTableCell padding="checkbox">
														<Checkbox checked={isItemSelected} />
													</StyledTableCell>
													:
													<StyledTableCell padding="checkbox" onClick={(e) => {
														e.stopPropagation();
														handleClick(e, row, row.uuid)
													}}>
														<Checkbox checked={isItemSelected} />
													</StyledTableCell>
												}
												{Object.values(props.columns).map((value, index) => {
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
						<Pagination
							count={props.paginate.totalPages}
							page={props.page}
							onChange={handleChangePage}
							defaultPage={props.paginate.page}
							color="primary"
						></Pagination>
					</Stack>
					<div className='tw-mr-10 tw-w-40  '>
						<Dropdown
							options={listPerPage}
							onChange={(e) => onChangeFilter(e, 'page')}
							value={props.limitPerPage}
							valuekey="page"
							labelkey="name"
							bgGray
						/>
					</div>
				</TableFooter>
			</Paper>
		</Box>
	);
}

EnhancedTable.propTypes = {
	columns: PropTypes.array.isRequired,
	data: PropTypes.array.isRequired,
	limitPerPage: PropTypes.number.isRequired,
	setLimitPerPage: PropTypes.func.isRequired,
	handleSelected: PropTypes.func.isRequired,
	onNavigateDetails: PropTypes.func,
	onRowClick: PropTypes.func,
	paginate: PropTypes.object.isRequired,
	onPageChange: PropTypes.func.isRequired,
	tab: PropTypes.number,
	scrollable: PropTypes.bool,
	redirectFrom: PropTypes.string,
};

export default EnhancedTable;
