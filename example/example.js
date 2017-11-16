// Import and initialize
// you dont need to change something here in your test files
const util = require('../unitTestLibrary/util').initalize('../../example/config.json');

eval(util.unparsedExpressions);

// Prepare for expression evaluation
const term = util.term;
const boilerplate = util.boilerplate;
const product = util.product;
let contextLanguage = util.contextLanguage;
let contextTag = util.contextTag;
const expect = require('chai').expect;
/*
* describe is a function provided by the test framework used for this library, [mocha]([https://mochajs.org/).
* However, you can use any test library you want.
*
*/

describe('You can use built-in functions in your expressions. This test library...', () => {
  /*
    * Call simple expressions which in turn call built-in functions.
    * We will define a more sophisticated scenario later.
    */
  it('...supports term()', () => {
    getRedTerm();
  });
  it('...supports boilerplate()', () => {
    getBoilerplate();
  });
  it('...supports product.attributeValue()', () => {
    getAttributeValue();
  });
  it('...supports product.attributeValues()', () => {
    getAttributeValues();
  });
  it('...supports contextLanguage', () => {
    getContextLanguage();
  });
  it('...supports contextTag', () => {
    getContextTag();
  });
});

describe('You can define the behavior of the internal functions', () => {
  it('You can define the return value in relation to the input value', () => {
    it('Calling term("$red") returns "red"', () => {
      /*
      * term, boilerplate, product.attributeValue and product.attributeValues are sinon stubs.
      * You can define their behavior and can analyze there behavior like every other sinon stub.
      * See the documentation of sinon for more informations how to do it `http://sinonjs.org/`
      */
      term.withArgs('$red').returnsArg('red');

      expect(getRedTerm()).to.equal('red');
      boilerplate.withArgs('legal').returns('My legal text');
      expect(boilerplate('legal')).to.equal('My legal text');

      it('Without configuration, the built in functions always return undefined', () => {
        expect(getBlueTerm()).to.equal(undefined);
      });
    });
  });
});


describe('You can use your expressions referencing other attributes', () => {
  it('For instance, calculate the surface by multiplying the attribtues for height and length', () => {
    /*
    * product.attributeValue.value() is a function in PIM, therefore we have to set up the
    * productAttributeValue to return a function, which then returns the value.
    */
    product.attributeValue.withArgs('height').returns({ value() { return 5; } });
    product.attributeValue.withArgs('length').returns({ value() { return 3; } });
    expect(calculateSquares()).to.equal(15);
  });
});
describe('You can also use other expressions for your expressions', () => {
  /*
  * This only works if all expressions of you are in the customJSFunctions file.
  * It does not work if you are referencing an expression which has been added in-line in PIM.
  * In that case, should can directly define the return value of that expression, the same way
  * you set up the return value for other function calls
  */
  it('For example, concatenating a unit of measure to an expression result ', () => {
    product.attributeValue.reset();
    /*
    * First we need to set up the attribute values used by the nested expression
    */
    product.attributeValue.withArgs('height').returns({ value() { return 8; } });
    product.attributeValue.withArgs('length').returns({ value() { return 4; } });

    /*
    * This expression calls another attribute, which in turn uses the attribute values for height and length.
    */
    expect(concatDeepthWithUoM()).to.equal('32 cm');
  });
});
describe('You can also use term() and boilerplate() in relation to contextLanguage', () => {
  it('Returns term in relation to the contextLanguage', () => {
    /*
    * First you need to set up a function for the right behavior of the term
    * in different Languages
    */
    function rightBehaviorOfTermBlue() {
      if (contextLanguage === 'de_DE') {
        return 'blau';
      } else if (contextLanguage === 'en_EN') {
        return 'blue';
      } else if (contextLanguage === 'es_ES') {
        return 'azul';
      }
      return 'bleu';
    }
    term.reset();
    term.withArgs('$blue').callsFake(rightBehaviorOfTermBlue);
    contextLanguage = '';
    expect(getBlueTerm()).to.equal('bleu');
    contextLanguage = 'es_ES';
    expect(getBlueTerm()).to.equal('azul');
    contextLanguage = 'de_DE';
    expect(getBlueTerm()).to.equal('blau');
    contextLanguage = 'en_EN';
    expect(getBlueTerm()).to.equal('blue');
  });
  it('Returns boilerplate in relation to the contextLanguage', () => {
    function rightBehaviorOfBoilerplateDanger() { // first you need to create a function for different contextLanguages
      if (contextLanguage === 'de_DE') {
        return 'Das Produkt ist gefaehrlich';
      } else if (contextLanguage === 'en_EN') {
        return 'This product is dangerous';
      }
      /*
      * This if your fallback, so it will return blue_fallback if no if statemant
      * above is true
      */
      return 'This product is harmless';
    }
    boilerplate.reset();
    boilerplate.withArgs('dangerous').callsFake(rightBehaviorOfBoilerplateDanger);
    contextLanguage = '';
    expect(getBoilerplate('dangerous')).to.equal('This product is harmless');
    contextLanguage = 'de_DE';
    expect(getBoilerplate('dangerous')).to.equal('Das Produkt ist gefaehrlich');
    contextLanguage = 'en_EN';
    expect(getBoilerplate('dangerous')).to.equal('This product is dangerous');
  });
});
describe('You can also use contextTag in your expressions', () => {
  contextTag = '2_wire_connector';
  expect(calculateMinimalSuspense()).to.equal(20);
  contextTag = '3_wire_connector';
  expect(calculateMinimalSuspense()).to.equal(18);
});

describe('More complex expressions and testing', () => {
  /*
  * In this expression, we make a string, which is related to contextTag and contextLanguage.
  * I called it min...max String, because it builds a string which shows the minimal and the
  * maximal suspense.
  * If the contextLanguage is japanese, he makes a min~max string.
  * If the minimal suspense is undefined, it will return <maximal suspense.
  * If the maximal suspense is undefined, it will return >minimal suspense.
  */
  it('Creates a min...max String in relation to contextTag, contextLanguage and other Attributes/Expressions', () => {
    contextTag = '2_wire_connector';
    contextLanguage = 'de_DE';
    expect(buildMinMaxString()).to.equal('20...32 DC');
    contextTag = '3_wire_connector';
    expect(buildMinMaxString()).to.equal('18...32 DC');
    contextLanguage = 'jp_JP';
    expect(buildMinMaxString()).to.equal('18~32 DC');
    contextTag = '4_wire_connector';
    expect(buildMinMaxString()).to.equal('<30');
  });
});
