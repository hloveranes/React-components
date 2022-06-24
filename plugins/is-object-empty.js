// return truthy or falsy if object is empty
function IsObjEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object 
  // _.isEmpty(obj)
};

export default IsObjEmpty;
