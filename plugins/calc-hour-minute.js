// import moment library
import moment from "moment";

// use case
const HourTime = (time) => convert12To24Hour(timeValidate(time));

// validate time format
function timeValidate(time) {
  let res = time.match(/((1[0-2]|0?[1-9]):([0-5][0-9])\s?([AaPp][Mm]))/);
  if (res) return res[2] + ":" + res[3] + " " + res[4];
  if (!res) return "00:00 am";
}

// accepted time format (--:-- am/pm or AM/PM)
function convert12To24Hour(time) {
  var hours = Number(time.match(/^(\d+)/)[1]);
  var minutes = Number(time.match(/:(\d+)/)[1]);
  var AMPM = time.match(/\s(.*)$/)[1];
  if ((AMPM == "PM" || AMPM == "pm") && hours < 12) hours = hours + 12;
  if ((AMPM == "AM" || AMPM == "am") && hours == 12) hours = hours - 12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if (hours < 10) sHours = "0" + sHours;
  if (minutes < 10) sMinutes = "0" + sMinutes;
  // return sHours + ":" + sMinutes;
  return calcDecimalHour(sHours, sMinutes);
}

// convert (5:30) hour minute into decimal format
function calcDecimalHour(hours, minutes) {
  if (isNaN(hours) && isNaN(minutes)) {
    return;
  }
  if (isNaN(hours)) {
    hours = 0;
  }
  if (isNaN(minutes)) {
    minutes = 0;
  }
  var decimalHours = moment.duration(hours + ":" + minutes).asHours();
  decimalHours = Math.round(decimalHours * 100) / 100;
  return decimalHours;
}

// convert (5.5) decimal time into hour minute format
function calcHoursMinutes(hours) {
  var decimalHours = parseFloat(hours);
  if (isNaN(decimalHours)) {
    return;
  }
  var hrs = parseInt(Number(decimalHours));
  var min = (Number(decimalHours) - hrs) * 60;
  min = Math.round(min);
  return hrs + ":" + min;
}

export default HourTime;
