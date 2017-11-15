// This are just simple exampels to show the idea of writing tests
function getTerm(id) {
  return term(id);
}
function getBoilerplate(id) {
  return boilerplate(id);
}
function getAttributeValue(id) {
  return product.attributeValue(id);
}
function getAttributeValues(id) {
  return product.attributeValues(id);
}
function getContextLanguage() {
  return contextLanguage;
}
function getContextTag() {
  return contextTag;
}
// Sample Expression for showing how to test a expression using other attribute values
function calculateSquares() {
  var height = product.attributeValue('height').value();
  var length = product.attributeValue('length').value();
  return length * height;
}
// Sample Expression for showing how to test a expression using other expressions
function concatDeepthWithUoM() {
  return `${calculateSquares()} cm`;
}
// These are sample expression for showing how to test contextTag behavior
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
// This is a example for a real expression
function buildMinMaxString() {
  var between,
    min,
    max;
  if (contextLanguage === 'jp_JP') {
    between = '~';
  } else {
    between = '...';
  }
  min = calculateMinimalSuspense();
  max = calculateMaximalSuspense();
  var returnString = '';
  if (min && max) {
    returnString = `${min + between + max} DC`;
  } else if (!min) {
    returnString = `<${max}`;
  } else if (!max) {
    returnString = `>${min}`;
  }
  return returnString;
}
