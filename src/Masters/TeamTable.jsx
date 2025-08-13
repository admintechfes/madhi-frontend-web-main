import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableContainer, TableHead, TableRow, TableSortLabel, Paper, CircularProgress, Pagination, Stack, TableFooter } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import UsePagination from './Usepagination';
import { Dropdown } from '../Select';


const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    fontFamily: 'roboto',
    color: '#666',
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': { backgroundColor: "rgba(255, 196, 12, 0.02)" },
  '&:last-child td, &:last-child th': { border: 0 },
}));



function EnhancedTableHead(props) {
  return (
    <TableHead>
      <TableRow>
        {props.columns.map((headCell, index) => (
          <StyledTableCell key={index} align={headCell.align ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            style={headCell.width ? { minWidth: `${headCell.width}px` } : { minWidth: '150px' }}>
            <TableSortLabel className="tw-p-4 tw-text-xs">{headCell.label}</TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function TeamTable(props) {


  const loader = useSelector((state) => state.loader.openTableLoader);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);


  useEffect(() => {
    setPage(props.page);
  }, [props.page]);

  const onChangeFilter = (e, page) => {
    props.setPage(1);
    props.setLimitPerPage(e)

  }

  const listPerPage = [
    {
      name: "10 per page",
      page: 10
    },
    {
      name: "20 per page",
      page: 20
    },
    {
      name: "50 per page",
      page: 50
    },
  ]

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
            <Table stickyHeader
              sx={{
                width: props.tab === 1 ? '100%' : props.scrollable ? (props.columns && props.columns.length > 5 ? '100%' : '100%') : '100%',
                overflowX: 'scroll',
              }} aria-label="sticky table">
              <EnhancedTableHead columns={props.columns} numSelected={selected.length} rowCount={props.data?.length} />
              <TableBody>
                {props.data
                  ? props.data.map((row, index) => {

                    const isItemSelected = isSelected(row.name);
                    return (
                      <StyledTableRow key={index} hover
                        onClick={(event) => handleClick(event, row, row.id)}
                        aria-checked={isItemSelected} tabIndex={-1} selected={isItemSelected} sx={{ cursor: 'pointer' }}>
                        {Object.values(props.columns).map((value, index) => {
                  
                          if (value.id === "created_at") {

                            return <StyledTableCell key={index} align={value.align ? value.align : 'left'}>{MyComponent(row[value.id]) || "-"}</StyledTableCell>
                          }
                          if (value.id === "assigned_supervisors") {
                          

                            const words = row[value.id].split(',');
                            const selectedWords = words.slice(0, 2);
                            let result = selectedWords.join(',');
                            if (words.length > 3) {
                              result += "...";
                            }
                            return <StyledTableCell key={index} align={value.align ? value.align : 'left'}>{result|| "-"}</StyledTableCell>
                          }
                          if (value.id === "assigned_senior_supervisors") {
                          

                            const words = row[value.id].split(',');
                            const selectedWords = words.slice(0, 2);
                            let result = selectedWords.join(',');
                            if (words.length > 3) {
                              result += "...";
                            }
                            return <StyledTableCell key={index} align={value.align ? value.align : 'left'}>{result|| "-"}</StyledTableCell>
                          }
                          if (value.id === "assigned_cews") {
                          

                            const words = row[value.id].split(',');
                            const selectedWords = words.slice(0, 2);
                            let result = selectedWords.join(',');
                            if (words.length > 3) {
                              result += "...";
                            }
                            return <StyledTableCell key={index} align={value.align ? value.align : 'left'}>{result|| "-"}</StyledTableCell>
                          }
                         
                          
                          return <StyledTableCell key={index} align={value.align ? value.align : 'left'}>{row[value.id] || "-"}</StyledTableCell>;
                        })

                        }

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

export default TeamTable;




export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())}, ${date.getFullYear()}`;
  return formattedDate;
}


function getMonthName(monthIndex) {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return monthNames[monthIndex];
}

function MyComponent(inp) {
  const formattedDate = formatDate(inp);

  return formattedDate
}

