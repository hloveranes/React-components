function TimeNow(date) {
  var today = new Date();
  var dtime = `${date} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  return dtime;
};

export default TimeNow;
