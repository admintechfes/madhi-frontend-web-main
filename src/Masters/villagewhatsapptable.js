import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableContainer, Button, TableHead, TableRow, TableSortLabel, Paper, CircularProgress, Pagination, Stack, TableFooter } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { Dropdown } from '../Select';
import { visuallyHidden } from '@mui/utils';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';


const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    fontFamily: 'Roboto',
    color: '#666',
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': { border: 0 },
  "&.Mui-selected": {
    background: "white",
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'calories';
const DEFAULT_ROWS_PER_PAGE = 5;

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
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
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTable(props) {
  const loader = useSelector((state) => state.loader.openTableLoader);
  const [page, setPage] = useState(1);
  const [visibleRows, setVisibleRows] = React.useState(null);
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);


  useEffect(() => {
    setPage(props.page);
  }, [props.page]);

  const onChangeFilter = (e, page) => {
    props?.setPage(1)
    props?.setLimitPerPage(e)
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
      // const updatedRows = sortedRows.slice(
      //   page * rowsPerPage,
      //   page * rowsPerPage + rowsPerPage,
      // );
      setVisibleRows(sortedRows);
    },
    [order, orderBy, page, rowsPerPage]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    props?.onPageChange(newPage);
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
            <Table stickyHeader
              sx={{
                width: props.tab === 1 ? '100%' : props.scrollable ? (props.columns && props.columns.length > 5 ? '100%' : '100%') : '100%',
                overflowX: 'scroll'
              }} aria-label="sticky table">
              <EnhancedTableHead
                columns={props.columns}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={props.data.length}
              />
              <TableBody>
                {visibleRows
                  ? visibleRows.map((row, index) => {
                    return (
                      <StyledTableRow key={index}>
                        {Object?.values(props.columns).map((value, index) => {
                          let BackgroundTheme =
                            (typeof row[value?.id] === 'string' && (row[value.id]?.toLowerCase() === 'group admin')) ? '#57C79633' :
                              (typeof row[value?.id] === 'string' && (row[value.id]?.toLowerCase() === 'not available')) ? '#EB57571A' : "#FFC40C33"

                          let ColorTheme =
                            (typeof row[value?.id] === 'string' && (row[value.id]?.toLowerCase() === 'group admin')) ? '#57C796' :
                              (typeof row[value?.id] === 'string' && (row[value.id]?.toLowerCase() === 'not available')) ? '#EB5757' : "#F39C35";

                          if (value.id === 'status') {
                            return (
                              <StyledTableCell key={index}>
                                <div style={{ backgroundColor: BackgroundTheme, color: ColorTheme }} className="tw-py-1 tw-rounded tw-px-2 tw-text-center tw-w-fit tw-text-sm">
                                  {row[value.id]}
                                </div>
                              </StyledTableCell>
                            );
                          }
                          if (value.id === 'action') {
                            return (
                              <Button variant='outlined' onClick={() => props.onAction(row?.status?.toLowerCase() === "group admin" ? "Are you sure, you want to demote the member from admin?" : row?.status?.toLowerCase() === "not admin" ? "Are you sure, you want to promote the member as admin?" : "Are you sure, you want to resend group link?", row.user_id, row.name)}>{row?.status?.toLowerCase() === "group admin" ? "Remove Group Admin" : row?.status?.toLowerCase() === "not admin" ? "Make Group Admin" : "Resend link"}</Button>
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
          <div className='tw-mr-10 tw-w-40'>
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
      </>
    </Box>
  );
}

export default EnhancedTable;
