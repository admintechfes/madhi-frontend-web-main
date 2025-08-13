import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableContainer, TableHead, TableRow, TableSortLabel, Paper, CircularProgress, Pagination, Stack, TableFooter, Checkbox, Tooltip, Button } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { Dropdown } from '../../components/Select';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    fontFamily: 'Roboto',
    color: '#666',
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
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

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };


  return (
    <TableHead>
      <TableRow>
        {props?.columns?.map((headCell) => {
          if (headCell.id == 'action') {
            return (
              <StyledTableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
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
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    setPage(props.page);
  }, [props.page]);

  const onChangeFilter = (e, page) => {
    setPage(1)
    props.setLimitPerPage(e)
    props?.dispatchperPage && dispatch(props?.dispatchperPage(e))
  }

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
      setVisibleRows(sortedRows);
    },
    [order, orderBy, page]
  );

  const handleRowClick = (id, index) => {
    if (props.onNavigateDetails) {
      props.onNavigateDetails(id, index);
    }
    if (props.onRowClick) {
      props.onRowClick(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = props.data.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    props.onPageChange(newPage);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <div elevation={0} className="tw-w-full tw-mb-2">
        {loader ? (
          <div className="tw-text-center tw-py-5">
            <CircularProgress />
          </div>
        ) : (
          <TableContainer>
            <Table
              sx={{
                width: props.tab === 1 ? '100%' : props.scrollable ? (props.columns && props.columns.length > 5 ? '100%' : '100%') : '100%',
                overflowX: 'scroll'
              }} aria-label="table">
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
                  ? visibleRows?.map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    return (
                      <StyledTableRow key={index}
                        aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected}
                        onClick={(e) => {
                          handleRowClick(row.id, index + 1)
                        }}>
                        {Object.values(props.columns).map((value, index) => {
                          if (value.id === 'action') {
                            return (
                              <StyledTableCell key={index} align={value.align ? value.align : 'left'}>
                                <div className="tw-flex tw-gap-4 tw-items-center">
                                  <Button disabled={row.log_data ? false : true} onClick={() => navigate(`/programs-unit/past-engagement-rule`, { state: { PastDetails: row.log_data} })}
                                    variant="outlined" className="tw-text-nowrap">
                                    View Score Rule
                                  </Button>

                                </div>
                              </StyledTableCell>
                            );
                          }
                          return <StyledTableCell key={index} align={value.align ? value.align : 'left'}>{row[value.id] || "-"}</StyledTableCell>;
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
              page={page}
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
      </div>
    </Box>
  );
}

export default EnhancedTable;
