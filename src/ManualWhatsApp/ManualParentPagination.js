import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableContainer, Button, TableHead, TableRow, TableSortLabel, Paper, CircularProgress, Pagination, Stack, TableFooter } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { Dropdown } from '../../Select';
import { visuallyHidden } from '@mui/utils';
import { Dropdown } from '../components/Select';


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

	// Handle null or empty string cases
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
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
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
          if (headCell.id == 'action') {
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

function ManualParentPagination(props) {
  const loader = useSelector((state) => state.loader.openTableLoader);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [visibleRows, setVisibleRows] = React.useState(null);
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);


  // useEffect(() => {
  //   setPage(1); 
  // }, [props.data]);


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
    let rowsOnMount = stableSort(props.data, getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY));
    setVisibleRows(rowsOnMount);
  }, [props.data]);

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
    [order, orderBy, page, rowsPerPage, visibleRows]
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = props.data.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };


  const onChangeFilter = (e) => {

    const newRowsPerPage = parseInt(e, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const handleClick = (event, row, id, moderatedById, programUnitContentId, conductedById, managedById) => {
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
      props.onNavigateDetails(id, moderatedById, programUnitContentId, conductedById, managedById);
    }


    setSelected(newSelected);
    if (props.onRowClick) {
      props.onRowClick(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // props.onPageChange(newPage);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;


  const totalPages = Math.ceil(visibleRows?.length / rowsPerPage);
  const currentData = visibleRows?.slice((page - 1) * rowsPerPage, page * rowsPerPage);


  return (
    <Box sx={{ width: '100%' }}>
      <div className="tw-w-full tw-mb-2 tw-mt-3">
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
              <EnhancedTableHead
                columns={props.columns}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={props?.data?.length}
              />
              <TableBody>
                {currentData?.map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  return (
                    <StyledTableRow
                      key={index}
                      hover
                      onClick={(event) => handleClick(event, row, row.id, row.moderatedById, row.programUnitContentId, row.conductedById, row.managedById)}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      {Object.values(props.columns).map((value, index) => {
                        if (value.id === 'action') {
                          return (
                            <StyledTableCell key={index} align={value.align ? value.align : 'left'}>
                              <div className="tw-flex tw-gap-4 tw-items-center">
                                <Button
                                  disableElevation
                                  variant="outlined"
                                  className="tw-text-nowrap"
                                  disabled={row.unitId ? false : true}
                                  onClick={() =>
                                    navigate(`/progress/village/${row.id}/unitId/${row.unitId}/programId/${props.programId}`, {
                                      state: { serialNumber: row.serialNumber, status: row.status, updatedOn: row.updatedOn, progressName: props.progressName, name: row.name },
                                    })
                                  }
                                >
                                  View Village Progress
                                </Button>
                                <Button onClick={() => navigate(`/progress/village-users/${row.id}?programId=${props.programId}`)} disableElevation variant="text" className="tw-text-nowrap">
                                  View Users
                                </Button>
                              </div>
                            </StyledTableCell>
                          );
                        }
                        if (value.id === 'status') {
                          let BackgroundTheme = row[value.id]?.toLowerCase() === 'completed' ? '#57C79633' : row[value.id]?.toLowerCase() === 'to be redone' ? '#FFC40C33' : '--';
                          let ColorTheme = row[value.id]?.toLowerCase() === 'completed' ? '#57C796' : row[value.id]?.toLowerCase() === 'to be redone' ? '#F39C35' : '--';
                          return (
                            <StyledTableCell key={index} className="!tw-flex">
                              <div style={{ backgroundColor: BackgroundTheme, color: ColorTheme }} className="tw-py-1 tw-rounded tw-px-2 tw-text-center tw-text-sm">
                                {row[value.id] || "--"}
                              </div>
                            </StyledTableCell>
                          );
                        }
                        return <StyledTableCell key={index} align={value.align ? value.align : 'left'}>{row[value.id] || '-'}</StyledTableCell>;
                      })}
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TableFooter className="!tw-flex tw-justify-between tw-items-center">
          <Stack spacing={2} className="tw-my-[18px] tw-mx-4 ">
            <Pagination count={totalPages} page={page} onChange={handleChangePage} color="primary" />
          </Stack>
          <div className="tw-mr-10 tw-w-40">
            <Dropdown options={listPerPage} onChange={onChangeFilter} value={rowsPerPage} valuekey="page" labelkey="name" bgGray />
          </div>
        </TableFooter>
      </div>
    </Box>
  );
}

export default ManualParentPagination;
