import BrowserStorage from "./storage";

function objCSVConstructor(colNames, fields, Objs) {
  if (fields.length < 1) return "field name(s) can not be empty";
  if (Objs.length < 1) return "object(s) not found";
  let newArr = colNames.toString() + "\r\n";
  Objs.forEach((objItm) => {
    let line = "";
    fields.forEach((item) => {
      if (line !== "") line += ",";
      if (item === "userId") line += BrowserStorage.FoundUser(objItm[item]);
      if (item !== "userId") line += objItm[item];
    });
    newArr += line + "\r\n";
  });
  return newArr;
}

function arrayToCSV(data) {
  var lineArray = [];
  data.forEach(function (infoArray, index) {
    var line = infoArray.join(",");
    lineArray.push(index === 0 ? line : line);
  });
  var csvContent = lineArray.join("\n");

  return csvContent;
}

// colNames.... labels for column
// fields.... fields that will show on csv
// objArr.... array of object to use
// label.... use to name the file
// rmb... convert array into string
function ObjToCSV(colNames = [], fields = [], objArr, label = "", rmb = false) {
  let csv = rmb
    ? arrayToCSV(objArr)
    : objCSVConstructor(colNames, fields, objArr);

  const url = window.URL.createObjectURL(new Blob([csv]));
  const link = document.createElement("a");
  link.setAttribute("download", `${label}.csv`);
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
}

export default ObjToCSV;
