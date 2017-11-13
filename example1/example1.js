//Import and initialize
const util = require("../unitTestLibrary/util").initalize("../../example1/config.json") //you dont need to do this in your file
eval(util.unparsedExpressions)

//Prepare for expression evaluation
let term = util.term
let boilerplate = util.boilerplate
let product = util.product
let contextLanguage = util.contextLanguage
let expect = require("chai").expect //required chai, but you can use anything you want


/*
* At this point, your expressions are available. You can call them either
* directly, or from within your test cases. contextLanguage is a simple
* variable, which you can change. In expressions it is used for example with:
* "en_EN","de_DE" or "es_ES".
* term, boilerplate and product.getAttributeValue are sinon-stubs, and can be
* configured like any other sinon stub. You can read the sinon documentation
* here: http://sinonjs.org/
* You can look up many examples at our example repo:
* https://github.com/OpusCapita/stprj-expression-unit-test-examples
* Happy testing!
*/

describe("It will not throw errors if you are using the expression functions", function(){
  it("calling term()",function(){
    getTerm(3)
  })
  it("calling boilerplate()",function(){
    getBoilerplate(3)
  })
  it("calling product.attributeValue()",function(){
    getAttributeValue(3)
  })
  it("calling product.attributeValues()",function(){
    getAttributeValues(3)
  })
  it("calling contextLanguage",function(){
    getContextLanguage()
  })
})
