import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableContainer, Button, TableHead, TableRow, TableSortLabel, Paper, CircularProgress, Pagination, Stack, TableFooter, Tooltip } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import UsePagination from '../Masters/Usepagination';
import { Dropdown } from '../Select';
import { useNavigate } from 'react-router-dom';
import { visuallyHidden } from '@mui/utils';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';



const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    fontFamily: 'Roboto',
    color: '#666',
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': { border: 0 }
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

function EnhancedTable(props) {
  const loader = useSelector((state) => state.loader.openTableLoader);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [visibleRows, setVisibleRows] = React.useState(null);
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);


  useEffect(() => {
    setPage(props.page);
  }, [props.page]);

  const onChangeFilter = (e, page) => {
    props.setPage(1)
    props.setLimitPerPage(e)
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
            <Table stickyHeader
              sx={{
                width: props.tab === 1 ? '100%' : props.scrollable ? (props.columns && props.columns.length > 5 ? '100%' : '100%') : '100%',
                overflowX: 'scroll'
              }} aria-label="sticky table">
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
                  ? visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    return (
                      <StyledTableRow key={index} hover
                        aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected}>
                        {Object?.values(props.columns).map((value, index) => {
                          if (value.id === 'status') {
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
                              case "initiated":
                                BackgroundTheme = '#FFC40C33';
                                ColorTheme = '#F39C35';
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
                                  title={row[value.id]?.toLowerCase() === 'error' ? row?.errorTitle : ''}
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
                          else if (value.id === 'clickStatus') {
                            let BackgroundTheme, ColorTheme;
                            switch (row[value.id]?.toLowerCase()) {
                              case 'clicked':
                                BackgroundTheme = '#57C79633';
                                ColorTheme = '#57C796';
                                break;
                              case 'absent':
                                BackgroundTheme = '#EB57571A';
                                ColorTheme = '#EB5757';
                              default:
                                BackgroundTheme = '#DDDDDD';
                                ColorTheme = '#666666';
                                break;
                            }
                            return (
                              <StyledTableCell key={index} align={value.align ? value.align : 'left'}>
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
                              </StyledTableCell>
                            )
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
