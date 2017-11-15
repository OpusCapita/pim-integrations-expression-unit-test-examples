//Import and initialize
const util = require("../unitTestLibrary/util").initalize("../../example/config.json") //you dont need to do this in your file
eval(util.unparsedExpressions)

//Prepare for expression evaluation
let term = util.term
let boilerplate = util.boilerplate
let product = util.product
let contextLanguage = util.contextLanguage
let contextTag = util.contextTag
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
  it("calling contextTag",function(){
    getContextTag()
  })
})
describe("You can set the behavior of the stubs", function() {
  it("can be setted for specified input", function(){
    it("will return the behavior You set for term in getTerm()", function(){
      term.withArgs("$red").returnsArg("red")  //term will return the first argument given in
      expect(getTerm("$red")).to.equal("red")  //to see what is possible with sinon see the documentation of sinon
      boilerplate.withArgs("legal").returns("My legal text")
      expect(boilerplate("legal")).to.equal("My legal text")
    it("will return undefined if the term is not defined")
      expect(getTerm("$blue")).to.equal(undefined)
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
    contextLanguage = "" //contextLanguage is variable so if you want to reset it just do this
    expect(getTerm("$red")).to.equal("red_fallback")
    contextLanguage = "de_DE"
    expect(getTerm("$red")).to.equal("rot")
    contextLanguage = "en_EN"
    expect(getTerm("$red")).to.equal("red")
  })
  it("will not do the same for $blue or other not specified arguments", function(){
    expect(getTerm("$blue")).to.equal(undefined)
    expect(getTerm("$green")).to.equal(undefined)
  })
})
describe("You can use your expressions pointing on one or more other attributes", function(){
  it("LATER", function(){  //TODO better name
    //Commment why value has to be a function
    product.attributeValue.withArgs("height").returns({value: function(){return 5}})
    product.attributeValue.withArgs("length").returns({value: function(){return 3}})
    expect(getSquares()).to.equal(15)
  })
})
describe("You can also use other expressions for your expressions", function(){
  // This only works if all expressions of you are in the customJSFunctions file.
  it("also works if not defined earlyer", function(){ //Kommentar überarbeiten
    product.attributeValue.reset()
    //First you need to describe the behavior for the pointed expression,
    //so in this case the behavior of getSquares()
    product.attributeValue.withArgs("height").returns({value: function(){return 8}})
    /*
    * product.attributeValue retuns a JSON with a function called value, because
    * product.attributeValue.value() is also a function in PIM
    */
    product.attributeValue.withArgs("length").returns({value: function(){return 4}})
    expect(concatDeepthWithUoM()).to.equal("32 cm")
  })
})
describe("You can also use term() and boilerplate() in relation to contextLanguage", function(){
  it("Returns term in relation to the contextLanguage", function(){
    function rightBehaviorOfTermBlue(){ //first you need to create a function for different contextLanguages
      if(contextLanguage == "de_DE"){
        return "blau";
      } else if(contextLanguage == "en_EN"){
        return "blue"
      } else if(contextLanguage == "es_ES"){
        return "azul"
      } else {
        //your fallback
        return "blue_fallback"
      }
    }
    term.reset()
    term.withArgs("$blue").callsFake(rightBehaviorOfTermBlue)
    contextLanguage = ""
    expect(getTerm("$blue")).to.equal("blue_fallback")
    contextLanguage = "es_ES"
    expect(getTerm("$blue")).to.equal("azul")
    contextLanguage = "de_DE"
    expect(getTerm("$blue")).to.equal("blau")
    contextLanguage = "en_EN"
    expect(getTerm("$blue")).to.equal("blue")
  })
  it("Returns boilerplate in relation to the contextLanguage", function(){
    function rightBehaviorOfBoilerplateDanger(){ //first you need to create a function for different contextLanguages
      if(contextLanguage == "de_DE"){
        return "Das Produkt ist gefaerlich";
      } else if(contextLanguage == "en_EN"){
        return "This product is dangerous"
      } else {
        //your fallback
        return "This product is dangerous_fallback"
      }
    }
    boilerplate.reset()
    boilerplate.withArgs("dangerous").callsFake(rightBehaviorOfBoilerplateDanger)
    contextLanguage = ""
    expect(getBoilerplate("dangerous")).to.equal("This product is dangerous_fallback")
    contextLanguage = "de_DE"
    expect(getBoilerplate("dangerous")).to.equal("Das Produkt ist gefaerlich")
    contextLanguage = "en_EN"
    expect(getBoilerplate("dangerous")).to.equal("This product is dangerous")
  })
})
describe("You can also use contextTag in your expressions", function(){
  contextTag = "2_wire_connector"
  expect(getMinimalSuspense()).to.equal(20)
  contextTag = "3_wire_connector"
  expect(getMinimalSuspense()).to.equal(18)
})

describe("More complex expressions and testing", function() {
  it("Creates a min...max String in relation to contextTag, contextLanguage and other Attributes/Expressions", function(){
    contextTag = "2_wire_connector"
    contextLanguage = "de_DE"
    expect(getMinMaxString()).to.equal("20...32 DC")
    contextTag = "3_wire_connector"
    expect(getMinMaxString()).to.equal("18...32 DC")
    contextLanguage = "jp_JP"
    expect(getMinMaxString()).to.equal("18~32 DC")
    contextTag = "4_wire_connector"
    expect(getMinMaxString()).to.equal("<30")
  })
})
