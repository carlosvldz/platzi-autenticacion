// check an object if its empty or not
const isEmptyObject = obj =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

  export default isEmptyObject;