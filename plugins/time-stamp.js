import moment from "moment";

function TimeStamp(time, type) {
  if (time) {
    let format = type === "short" ? "YYYY-MM-DD" : "MMMM D, YYYY HH:mm";
    let timeFormatted = `${moment(time).format(format)}`;
    return timeFormatted;
  }
  return "";
}

export default TimeStamp;
