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
describe("You can set the behavior of the stubs", function() {
  it("can be setted for specified input", function(){
    it("will return the behavior You set for term in getTerm()", function(){
      term.withArgs("$red").returnsArg("red")  //term will return the first argument given in
      expect(getTerm("$red")).to.equal("red")  //to see what is possible with sinon see the documentation of sinon
    it("will return undefined if behavior is not described")
      expect(getTerm("$blue")).to.equal(undefined)
    })
  })
  it("can also set the behavior of every input", function(){
    it("will return the first argument i used to call the function getTerm()", function(){
      boilerplate.returnsArg(0)
      expect(getBoilerplate("legal")).to.equal("legal")
      expect(getBoilerplate("statement")).to.equal("statement")
      expect(getBoilerplate("anything")).to.equal("anything")
    })
  })
})
/*
* To see what is possible with the sinon-stubs, look at the documentation of
* sinon: http://sinonjs.org/
*/
describe("You can also set the behavior more complex:", function(){
  it("can be set in relation of other variables", function(){
    term.reset()  //because of this the stub is cleared and has its initial behavior
    function rightBehaviorOfTermRed(){
      if(contextLanguage=="de_DE"){
        return "rot"
      } else if(contextLanguage=="en_EN"){
        return "red"
      } else {
        // Your fallback if none of them is true
        return "red_fallback"
      }
    }
    term.withArgs("$red").callsFake(rightBehaviorOfTermRed)// this function is called everytime term gets called with Argument ("$red")
    expect(getTerm("$red")).to.equal("red_fallback")
    contextLanguage = "de_DE"
    expect(getTerm("$red")).to.equal("rot")
    contextLanguage = "en_EN"
    expect(getTerm("$red")).to.equal("red")
  })
})
