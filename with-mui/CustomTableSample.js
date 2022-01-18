import { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Box, Paper, Typography } from '@mui/material'
 
const StyledTable = styled('table')({
  borderCollapse: 'collapse',
  width: '100%',
  border: '1px solid black'
});
const StyledTh = styled('th')({
  border: '1px solid black',
  paddingRight: '5px',
  paddingLeft: '5px'
});
const StyledTd = styled('td')({
  border: '1px solid black',
  paddingRight: '5px',
  paddingLeft: '5px'
});

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy='id') {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator, filter, filterBy) {
  const filteredArray = (filterBy && filterBy !== 'all')
   ? 
   array.filter(item => item[filter]?.toLowerCase() === filterBy) : array;
  
  const stabilizedThis = filteredArray.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

const isNumeric = (num) => {
  return !isNaN(num)
}

const isNumber = (data) => {
  if(!isNumeric(data)){
    return 'left'
  }else if(isNumeric(data)){
    return 'right'
  }else{
    return 'center'
  }
}

const THead = (props) => {
  const { headerCols, dataRows } = props;
  const [hasHeader, setHasHeader] = useState(true);

  useEffect(() => {
    (headerCols.length > 1) ? setHasHeader(true) : setHasHeader(false);
  });

  return (
    <thead>
      <tr>
      {!hasHeader ? 
        Object.keys(dataRows[dataRows.length - 1]).map((keyName, i) => (
          <StyledTh key={i}>{keyName.replace(/(_)/gi, ' ').toUpperCase()}</StyledTh>
        ))
       :
        headerCols.map((colName, indx) => {
         return (<StyledTh key={indx}>{colName}</StyledTh>)
        })}
      </tr>
    </thead>
  )
}

const TBody = (props) => {
  const { dataRows, order, orderBy, filter, filterBy, page, rowsPerPage } = props;

  return (
    <tbody>
      {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
      {stableSort(dataRows, getComparator(order, orderBy), filter, filterBy)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, RowIndx) => {
                  return (
                    <tr key={`tblRow-${RowIndx}`}>
                      {Object.keys(row).map((keyName, i) => (
                       <StyledTd sx={{ textAlign: isNumber(row[keyName]) }} key={i}>{row[keyName]}</StyledTd>
                      ))}
                    </tr>
                  )})
      }
    </tbody>
  )
}

const TFoot = (props) => {
  const { dataRows } = props;
  const [totalArr, setTotalArr] = useState([]);
  var totals = {};

  const arrTotals = (value, keyName) => {
    if(isNumeric(value[keyName])){
      if(keyName in totals){
        totals[keyName]  += parseFloat(value[keyName]);
      }else{
        totals[keyName] = parseFloat(value[keyName]);
      }
    }
    return totals;
  }

  useEffect(() => {
    dataRows.forEach((value) => {
      Object.keys(value).map((keyName, indx) => {
        arrTotals(value, keyName);
      })
    })
    setTotalArr(totals)
  }, []);


  return (
    <tfoot>
      <tr>
        {Object.keys(dataRows[dataRows.length - 1]).map((keyName, i) => (
          <StyledTd key={i} sx={{ textAlign: isNumber(totalArr[keyName]), position: "relative" }}>
            {i == 0 && <Typography display="inline" sx={{ fontWeight: 'bold', position: "absolute", left: 0, marginLeft: "0.5rem" }}>Total</Typography>}
            {` ${(totalArr[keyName] != undefined) ? totalArr[keyName] : '' }`}
          </StyledTd>
        ))}
      </tr>
    </tfoot>
  )
}

const DataTable = (props) => {
  // const { headerCols, dataRows, tableName } = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [filter, setFilter] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const tableName = "Custom Table Name"
  
  const headerCols = [
    'ACTUAL FROM DISTILLATION',
    'DESCRIPTION',
    'QUANTITY',
    'HYDROSOL',
    'PURIFIED OIL'
  ];
  const dataRows = [
  {
    actual_from_distillation: 29,
    description: "Extra",
    quantity: 1,
    hydrosol: 2,
    purified_oil: 28
  },
  {
    actual_from_distillation: 13,
    description: "First Grade",
    quantity: 3,
    hydrosol: 1,
    purified_oil: 12
  },
  {
    actual_from_distillation: 11,
    description: "Second Grade",
    quantity: 1,
    hydrosol: 4,
    purified_oil: 10
  }
  ];

  return (
    <Paper elevation={0}>
      <Box sx={{ 
        width: '100%', 
        textAlign: 'center',
        backgroundColor: '#000',
        color: '#fff'
      }}>
        <Typography sx={{ 
          fontWeight: 'bold' 
        }}>{tableName}</Typography>
      </Box>
      <StyledTable>
        <THead 
          headerCols={headerCols}
          dataRows={dataRows}
        />
        <TBody
          dataRows={dataRows}
          order={order}
          orderBy={orderBy}
          filter={filter}
          filterBy={filterBy}
          page={page}
          rowsPerPage={rowsPerPage}
        />
        <TFoot 
          dataRows={dataRows}
        />
      </StyledTable>
    </Paper>
  )
}

export default DataTable;
