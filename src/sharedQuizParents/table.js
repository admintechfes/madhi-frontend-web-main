import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableContainer, TableHead, TableRow, TableSortLabel, Paper, CircularProgress, Pagination, Stack, TableFooter, Checkbox } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { Dropdown } from '../components/Select';

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
const DEFAULT_ROWS_PER_PAGE = 5;


function SharedQuizParentTable(props) {
  const loader = useSelector((state) => state.loader.openTableLoader);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [visibleRows, setVisibleRows] = React.useState(null);
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = React.useState(0);
  const [headerCheckboxState, setHeaderCheckboxState] = useState({ checked: false, indeterminate: false });

  const navigate = useNavigate();
  const dispatch = useDispatch()



  useEffect(() => {
    setPage(props.page);
  }, [props.page]);


  // Modified by Arjun for accomplishing Manual Whatsapp feature
  useEffect(() => {
    setSelected(props?.selectedData)
  }, [props?.selectedData])

  useEffect(() => {
    const allSelected = props.data.length > 0 && props.data.every(item => selected?.some(sel => sel.id === item.id));
    const someSelected = props.data.some(item => selected?.some(sel => sel.id === item.id));
    setHeaderCheckboxState({ checked: allSelected, indeterminate: !allSelected && someSelected });
  }, [props.data, selected, props.page]);


  const onChangeFilter = (e, page) => {
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
    [order, orderBy, page, rowsPerPage]
  );


  const handleSelectAllClick = (event) => {
    const currentRows = props.data;
    if (event.target.checked) {
      props.setIsSelectAll(true)
      const newSelecteds = [...selected, ...currentRows.filter(row => !selected?.some(sel => sel.id === row.id))];
      setSelected(newSelecteds);
      props.handleSelected(newSelecteds);
    } else {
      props.setIsSelectAll(false)
      props.setIsSelectedAll(false)
      const newSelected = selected?.filter(sel => !currentRows.some(row => row.id === sel.id));
      setSelected(newSelected);
      props.handleSelected(newSelected);
    }
  };


  const handleClick = (event, row) => {
    const selectedIndex = selected?.findIndex((item) => item.id === row.id);
    let newSelected = [];
    props.setIsSelectAll(false)
    props.setIsSelectedAll(false)
    if (selectedIndex === -1) {
      newSelected = [...selected, row];
    } else {
      newSelected = selected?.filter((item) => item.id !== row.id);
    }

    setSelected(newSelected);
    props.handleSelected(newSelected);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    props.onPageChange(newPage);
  };

  const isSelected = (id) => selected?.findIndex((item) => item.id === id) !== -1;


  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={0} className="tw-w-full tw-mb-2 tw-mt-3">
        {loader ? (
          <div className="tw-text-center tw-py-5">
            <CircularProgress />
          </div>
        ) : (
          <TableContainer>
            <Table stickyHeader
              sx={{
                width: props.tab === 1 ? '100%' : props.scrollable ? (props.columns && props.columns.length > 5 ? '100%' : '100%') : '100%',
                overflowX: 'scroll'
              }} aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell padding="checkbox">
                    <Checkbox
                      indeterminate={headerCheckboxState.indeterminate}
                      checked={headerCheckboxState.checked}
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
              <TableBody>
                {visibleRows
                  ? visibleRows?.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    return (
                      <StyledTableRow key={index} hover
                        aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected}
                        onClick={(e) => {

                          handleClick(e, row, row.id)

                        }
                        }
                        sx={{ cursor: 'pointer' }}>

                        <StyledTableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} />
                        </StyledTableCell>

                        {Object.values(props.columns).map((value, index) => {
                          let BackgroundTheme =
                            (typeof row[value?.id] === 'string' && (row[value.id]?.toLowerCase() === 'submitted' || row[value.id]?.toLowerCase() === 'delivered' || row[value.id]?.toLowerCase() === "sent to glific" || row[value.id]?.toLowerCase() === "sent to kalerya")) ? '#3892FF33' :
                              (typeof row[value?.id] === 'string' && (row[value.id]?.toLowerCase() === 'not interested' || row[value.id]?.toLowerCase() === 'unavailable' || row[value.id]?.toLowerCase() === 'error' || row[value.id]?.toLowerCase() === 'pending')) ? '#EB57571A' :
                                (typeof row[value?.id] === 'string' && (row[value.id]?.toLowerCase() === 'shared')) ? '#FFC40C33' :
                                  (typeof row[value?.id] === 'string' && row[value.id]?.toLowerCase() === 'not initiated') ? '#DDDDDD' : "";

                          let ColorTheme =
                            (typeof row[value?.id] === 'string' && (row[value.id]?.toLowerCase() === 'submitted' || row[value.id]?.toLowerCase() === 'delivered' || row[value.id]?.toLowerCase() === "sent to glific" || row[value.id]?.toLowerCase() === "sent to kalerya")) ? '#3892FF' :
                              (typeof row[value?.id] === 'string' && (row[value.id]?.toLowerCase() === 'not interested' || row[value.id]?.toLowerCase() === 'unavailable' || row[value.id]?.toLowerCase() === 'error' || row[value.id]?.toLowerCase() === 'pending')) ? '#EB5757' :
                                (typeof row[value?.id] === 'string' && (row[value.id]?.toLowerCase() === 'shared' || row[value.id]?.toLowerCase() === "sent")) ? '#F39C35' :
                                  (typeof row[value?.id] === 'string' && row[value.id]?.toLowerCase() === 'not initiated') ? '#666666' : "";

                          if (value.id === 'whatsAppSharedStatus') {
                            return (
                              <StyledTableCell key={index}>
                                <div style={{ backgroundColor: BackgroundTheme, color: ColorTheme }} className="tw-py-1 tw-rounded tw-px-2 tw-text-center tw-w-fit tw-text-sm">
                                  {row[value.id]}
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

export default SharedQuizParentTable;
