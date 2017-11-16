/*
* These are simple expressions to show how to test expressions which rely on internal functions
*/
function getRedTerm() {
  return term('$red');
}
function getBlueTerm() {
  return term('$blue');
}
function getBoilerplate() {
  return boilerplate('dangerous');
}
function getAttributeValue() {
  return product.attributeValue(3);
}
function getAttributeValues() {
  return product.attributeValues(3);
}
function getContextLanguage() {
  return contextLanguage;
}
function getContextTag() {
  return contextTag;
}
/*
* Calculates the surface of a product by combining the attribute values for height and length.
*/
function calculateSurface() {
  var height = product.attributeValue('height').value();
  var length = product.attributeValue('length').value();
  return length * height;
}
/*
* Example for a nested expression: Calculates the surface and adds 'cm'
*/
function calculateSurfaceString() {
  //TODO
  return calculateSquares() + "cm";
}
/*
* Example to show how the contextTag can be pre-defined
*/
function calculateMinimalSuspense() {
  if (contextTag === '2_wire_connector') {
    return 20;
  } else if (contextTag === '3_wire_connector') {
    return 18;
  }
}
function calculateMaximalSuspense() {
  if (contextTag === '2_wire_connector') {
    return 32;
  } else if (contextTag === '3_wire_connector') {
    return 32;
  }
  return 30;
}
/*
* This expression wants to build a so called "Min Max" string. It accesses 
* two attributes, one MIN and one MAX value. If only MIN is there, display >MIN,
* If only MAX is there, display <MAX
* If both are there, display for all languages except Japanese MIN...MAX, and for Japanese MIN~MAX
* Additionally, we add a term to the end of the string which tells us about the unit of measure
*/
function buildMinMaxString() {
  var between,
    min,
    max;
  if (contextLanguage === 'jp_JP') {
    between = '~';
  } else {
    between = '...';
  }
  min = calculateMinimalSuspense(); //TODO muss ein anderes attribut aufrufen
  max = calculateMaximalSuspense(); //TODO same here
  var returnString = '';
  if (min && max) {
    returnString = `${min + between + max} DC`; //TODO DC is a term, and should always be appended
  } else if (!min) {
    returnString = `<${max}`; //TODO ES6
  } else if (!max) {
    returnString = `>${min}`; //TODO ES6
  }
  return returnString;
}
