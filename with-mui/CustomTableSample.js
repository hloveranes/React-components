import { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { Box, Paper, Typography } from "@mui/material";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Swal from "sweetalert2";

const StyledTable = styled("table")({
  borderCollapse: "collapse",
  width: "100%",
  border: "1px solid black",
});
const StyledTh = styled("th")({
  border: "1px solid black",
  paddingRight: "5px",
  paddingLeft: "5px",
});
const StyledTd = styled("td")({
  border: "1px solid black",
  paddingRight: "5px",
  paddingLeft: "5px",
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

function getComparator(order, orderBy = "id") {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator, filter, filterBy) {
  const filteredArray =
    filterBy && filterBy !== "all"
      ? array.filter((item) => item[filter]?.toLowerCase() === filterBy)
      : array;

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
  return !isNaN(num);
};

const isNumber = (data) => {
  if (data === "isCenter") {
    return "center";
  } else if (!isNumeric(data)) {
    return "left";
  } else if (isNumeric(data)) {
    return "right";
  }
};

const THead = (props) => {
  const { headerCols, dataRows } = props;

  return (
    <thead>
      <tr>
        {headerCols.length > 0
          ? headerCols.map((colName, indx) => {
              return <StyledTh key={indx}>{colName.toUpperCase()}</StyledTh>;
            })
          : Object.keys(dataRows[dataRows.length - 1]).map((keyName, i) => (
              <StyledTh key={i}>
                {keyName.replace(/(_)|(?=[A-Z])/g, " ").toUpperCase()}
              </StyledTh>
            ))}
      </tr>
    </thead>
  );
};

const TBody = (props) => {
  const {
    dataRows,
    order,
    orderBy,
    filter,
    filterBy,
    page,
    rowsPerPage,
    onRequestEdit,
    onRequestDelete,
  } = props;

  const createEditHandler = (event, data) => {
    onRequestEdit(data);
  };

  const createDeleteHandler = (event, entry_id) => {
    Swal.fire({
      title: "Are you sure you want to delete?",
      icon: "question",
      showDenyButton: true,
      confirmButtonColor: "#4299e1",
      denyButtonColor: "#a0aec0",
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        onRequestDelete(entry_id);
        // theAccountingInquiryContext.deleteAccountingInquiry(entry_id);
      }
    });
  };

  return (
    <tbody>
      {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
      {dataRows &&
        stableSort(dataRows, getComparator(order, orderBy), filter, filterBy)
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, rowIndx) => {
            return (
              <tr key={`tblRow-${rowIndx}`}>
                {Object.keys(row).map((keyName, i) => (
                  <StyledTd sx={{ textAlign: isNumber(row[keyName]) }} key={i}>
                    {keyName !== "actions" && row[keyName]}
                    {keyName === "actions" && (
                      <ModeIcon
                        onClick={(e) => createEditHandler(e, row)}
                        sx={{ cursor: "pointer" }}
                      />
                    )}
                    {keyName === "actions" && (
                      <DeleteForeverIcon
                        onClick={(e) => createDeleteHandler(e, row.id)}
                        sx={{ cursor: "pointer" }}
                      />
                    )}
                  </StyledTd>
                ))}
              </tr>
            );
          })}
    </tbody>
  );
};

const TFoot = (props) => {
  const { dataRows } = props;
  const [totalArr, setTotalArr] = useState([]);
  var totals = {};

  const arrTotals = (value, keyName) => {
    if (isNumeric(value[keyName])) {
      if (keyName in totals) {
        totals[keyName] += parseFloat(value[keyName]);
      } else {
        totals[keyName] = parseFloat(value[keyName]);
      }
    }
    return totals;
  };

  useEffect(() => {
    dataRows.forEach((value) => {
      Object.keys(value).map((keyName, indx) => {
        arrTotals(value, keyName);
      });
    });
    setTotalArr(totals);
  }, []);

  return (
    <tfoot>
      <tr>
        {Object.keys(dataRows[dataRows.length - 1]).map((keyName, i) => (
          <StyledTd
            key={i}
            sx={{
              textAlign: isNumber(totalArr[keyName]),
              position: "relative",
            }}
          >
            {i == 0 && (
              <Typography
                sx={{
                  fontWeight: "bold",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  marginLeft: "0.5rem",
                  marginTop: "0.1rem",
                }}
              >
                Total
              </Typography>
            )}
            {`${
              totalArr[keyName] != undefined && isNumeric(totalArr[keyName])
            }` && (
              <Typography
                display="inline"
                sx={{
                  fontWeight: "bold",
                  right: 0,
                  top: 0,
                }}
              >
                {totalArr[keyName] ? totalArr[keyName] : ""}
              </Typography>
            )}
          </StyledTd>
        ))}
      </tr>
    </tfoot>
  );
};

const DataTable = (props) => {
  const {
    headerCols = [],
    dataRows = [],
    tableName = "",
    showTotal = false,
    editRequest,
    deleteRequest,
  } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [hasActions, setHasActions] = useState(false);
  const [newHeader, setNewHeader] = useState(false);
  const [newRow, setNewRow] = useState([]);

  useEffect(() => {
    if (headerCols.length > 0) {
      setNewHeader([...headerCols, "actionss"]);
      setHasActions(true);
    }
    if (dataRows.length > 0) {
      let b = dataRows.map((item) => {
        item["actions"] = "isCenter";
        return item;
      });
      setNewRow(b);
    }
  }, [hasActions]);

  useEffect(() => {
    if (newRow.length > 0) {
      setHasActions(true);
    }
  }, [newRow]);

  return (
    <Paper elevation={0}>
      {tableName && (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            backgroundColor: "#000",
            color: "#fff",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
            }}
          >
            {tableName}
          </Typography>
        </Box>
      )}
      <StyledTable>
        {hasActions && <THead headerCols={newHeader} dataRows={newRow} />}
        <TBody
          dataRows={newRow}
          order={order}
          orderBy={orderBy}
          filter={filter}
          filterBy={filterBy}
          page={page}
          rowsPerPage={rowsPerPage}
          onRequestEdit={editRequest}
          onRequestDelete={deleteRequest}
        />
        {showTotal && <TFoot dataRows={dataRows} />}
      </StyledTable>
    </Paper>
  );
};

export default DataTable;
