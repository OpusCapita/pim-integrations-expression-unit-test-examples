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
function getContextTag(){
  return contextTag
}
function getSquares(){
  var height = product.attributeValue("height").value()
  var length = product.attributeValue("length").value()
  return length*height
}
function concatDeepthWithUoM(){
  return getSquares() + " cm"
}
function getMinimalSuspense(){
  if(contextTag=="2_wire_connector"){
    return 20
  } else if (contextTag=="3_wire_connector") {
    return 18
  }
}
function getMaximalSuspense(){
  if(contextTag=="2_wire_connector"){
    return 32
  } else if (contextTag=="3_wire_connector") {
    return 32
  } else {
    return 30
  }

}
function getMinMaxString(){
  var between, min, max
  if(contextLanguage=="jp_JP")
  {
    between = "~"
  } else {
    between = "..."
  }
  min = getMinimalSuspense()
  max = getMaximalSuspense()
  var returnString = ""
  if(min && max)
  {
    returnString = min+between+max+" DC"
  } else if(!min){
    returnString = "<"+max
  }else if(!max){
    returnString = ">"+min
  }
  return returnString
}
