//Import and initialize
const util = require("../unitTestLibrary/util").initalize("../../example1/config.json") //you dont need to do this in your file
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
    expect(getDeepth()).to.equal(15)
  })
})
describe("You can also use other expressions for your expressions", function(){
  // This only works if all expressions of you are in the customJSFunctions file.
  it("also works if not defined earlyer", function(){ //Kommentar überarbeiten
    product.attributeValue.reset()
    //First you need to describe the behavior for the pointed expression,
    //so in this case the behavior of getDeepth()
    product.attributeValue.withArgs("height").returns({value: function(){return 8}})
    /*
    * product.attributeValue retuns a JSON with a function called value, because
    * product.attributeValue.value() is also a function in PIM
    */
    product.attributeValue.withArgs("length").returns({value: function(){return 4}})
    expect(concatDeepthWithUoM()).to.equal("32 cm")
  })
})
/*
Sachen, die Du noch unterbringen kannst:
-Eine Expression verrechnet zwei Attributwerte (Tiefe = breite x laenge)  -
-Mehrstufige Expressions: Eine Expression verwendet den Wert einer anderen Expression
Attribut 1: "cm"
Attribut 2 isExpression, breite x laenge
Attribut 3: Attribut2 + " " + Attribut1

- term() und boilerplate() in abhngigkeitvon contextLanguage
- beides in abhaengigkeit von contextTag

GRAND FINALE
MinMax-String (Sprachabhaengig)
- <1
- >2
- 1..2
- 1~2
- 1..2 $Ohm



*/
