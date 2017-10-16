/** @module utils */
/**
* O(n) function to get the key from a value
* returns the first key that has the value
* @param {object} object the object to use
* @param {string} value an ISO6392 language code
* @return {string} an _ language code string
*/
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

/**
* merge two objects
* not associative mergeobjects(x,v) !== mergeobjects(v,x)
* @param {object} f first object
* @param {object} s second object
* @return {object} the result of merging the two objects
*/
function mergeObjects(f, s) {
  // to do: make associative
  return {...f, ...s};
}

/**
* @param {object} object
* @param {*} value a value the object holds/can hold
* @return {Bool} Whether or not the value is in the object
*/
function isValueInObject(object, value) {
  return Object.values(object).includes(value);
}

/**
* O(n*2) function to get an object holding a value from an array of objects
* returns the first object that has the value or an empty object if all fails
* @param {array} array an array of objects
* @param {string} value an ISO6392 language code
* @return {string} an _ language code string
*/
function getObjectFromObjectArray(array, value) {
  // to do: stop at first not last object
  return array.reduce(
    (accum, object) =>
      mergeObjects(accum, isValueInObject(object, value) ? object : {}),
    {});
}


module.exports = {
  getKeyByValue,
  mergeObjects,
  getObjectFromObjectArray,
  isValueInObject,
};
