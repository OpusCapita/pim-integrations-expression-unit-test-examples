function getTerm(id){
  return term(id)
}
function getBoilerplate(id){
  return boilerplate(id)
}
function getAttributeValue(id){
  return product.attributeValue(id)
}
function getAttributeValues(id){
  return product.attributeValues(id)
}
function getContextLanguage(){
  return contextLanguage
}
function getDeepth(){
  var height = product.attributeValue("height").value()
  var length = product.attributeValue("length").value()
  return length*height
}
function concatDeepthWithUoM(){
  return getDeepth() + " cm"
}
