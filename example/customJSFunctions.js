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
function getContextLanguage() {
  return contextLanguage;
}
function getContextTag() {
  return contextTag;
}
function getLegalBoilerplate() {
  return boilerplate('legal');
}
function getDangerousBoilerplate() {
  return boilerplate('dangerous');
}
/*
* Calculates the surface of a product by combining the attribute values for height and length.
*/
function calculateSurface() {
  var height = product.attributeValue('height');
  var length = product.attributeValue('length');
  return length * height;
}
/*
* Example for a nested expression: Calculates the surface and adds 'cm'
*/
function calculateSurfaceString() {
  return product.attributeValue('surface') + ' cm';
}
/*
* Example to show how the contextTag can be pre-defined
*/
function calculateMinimalSuspense() {
  if (contextTag === '2_wire_connector') {
    return 20;
  }
  if (contextTag === '3_wire_connector') {
    return 18;
  }
}
function calculateMaximalSuspense() {
  if (contextTag === '2_wire_connector' || contextTag === '3_wire_connector') {
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

  min = product.attributeValue('minimalSuspense');
  max = product.attributeValue('maximalSuspense');
  var returnString = '';
  if (min && max) {
    returnString = min + between + max + ' ' + term('UoM_suspense');
  } else if (!min) {
    returnString = '<' + max;
  } else if (!max) {
    returnString = '>' + min;
  }
  return returnString;
}
