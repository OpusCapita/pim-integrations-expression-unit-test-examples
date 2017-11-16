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

describe('It will not throw errors if you are using the predefined expression functions', () => {
  it('supports term()', () => {
    getTerm(3);
  });
  it('supports boilerplate()', () => {
    getBoilerplate(3);
  });
  it('supports product.attributeValue()', () => {
    getAttributeValue(3);
  });
  it('supports product.attributeValues()', () => {
    getAttributeValues(3);
  });
  it('supports contextLanguage', () => {
    getContextLanguage();
  });
  it('supports contextTag', () => {
    getContextTag();
  });
});

describe('You can define the behavior of the stubs', () => {
  it('The returnvalue can be set for specified input', () => {
    it('will return the behavior You set for term in getTerm()', () => {
      /*
      * This sets the behavior of term if it is called with $red.
      * It will return red than:
      * term("$red") => "red"
      */
      term.withArgs('$red').returnsArg('red'); // term will return red if it gets called with argument $red
      /*
      * term, boilerplate, product.attributeValue and product.attributeValues are sinon stubs.
      * You can define their behavior and can analyze there behavior like every other sinon stub.
      * See the documentation of sinon for more informations how to do it `http://sinonjs.org/`
      */
      expect(getTerm('$red')).to.equal('red');
      boilerplate.withArgs('legal').returns('My legal text');
      expect(boilerplate('legal')).to.equal('My legal text');

      it('will return undefined if the term is not defined', () => {
        expect(getTerm('$blue')).to.equal(undefined);
      });
    });
  });
});

describe('You can also set the behavior more complex:', () => {
  it('can be set in relation of other variables', () => {
    /*
    * First you have to reset the stub, in this case term, because
    * if you dont to it, it is possible that the behavior of term was set
    * before and this may cause unwanted behavior
    */
    term.reset();


    // A function is created which declares a more complex behavior for the term
    function rightBehaviorOfTermRed() {
      if (contextLanguage === 'de_DE') {
        return 'rot';
      } else if (contextLanguage === 'en_EN') {
        return 'red';
      }
      // Your fallback if none of them is true
      return 'red_fallback';
    }
    /*
    *   The function gets linked with the sinon-stub term.
    *   Now the function gets called every time when term gets called with argument $red
    */
    term.withArgs('$red').callsFake(rightBehaviorOfTermRed);
    /*
    * contextLanguage is just a variable, so if you need to reset is,
    * just type the following
    */
    contextLanguage = '';

    expect(getTerm('$red')).to.equal('red_fallback');
    contextLanguage = 'de_DE';
    expect(getTerm('$red')).to.equal('rot');
    contextLanguage = 'en_EN';
    expect(getTerm('$red')).to.equal('red');
  });

  it('will not do the same for $blue or other not specified arguments', () => {
    expect(getTerm('$blue')).to.equal(undefined);
    expect(getTerm('$green')).to.equal(undefined);
  });
});
describe('You can use your expressions pointing on one or more other attributes', () => {
  it('Two attributes are called', () => {
    /*
    * product.attributeValue retuns a JSON with a function called value, because
    * product.attributeValue.value() is also a function in PIM
    */
    product.attributeValue.withArgs('height').returns({ value() { return 5; } });
    product.attributeValue.withArgs('length').returns({ value() { return 3; } });
    expect(calculateSquares()).to.equal(15);
  });
});
describe('You can also use other expressions for your expressions', () => {
  // This only works if all expressions of you are in the customJSFunctions file.
  it('also works if not defined earlyer', () => {
    product.attributeValue.reset();
    /*
    * First you need to describe the behavior for the pointed expression,
    * so in this case the behavior of calculateSquares()
    */
    product.attributeValue.withArgs('height').returns({ value() { return 8; } });
    /*
    * product.attributeValue retuns a JSON with a function called 'value', because
    * product.attributeValue.value() is also a function in PIM
    */
    product.attributeValue.withArgs('length').returns({ value() { return 4; } });
    expect(concatDeepthWithUoM()).to.equal('32 cm');
  });
});
describe('You can also use term() and boilerplate() in relation to contextLanguage', () => {
  it('Returns term in relation to the contextLanguage', () => {
    /*
    * First you need to set up a function for the right behavior of the term
    * in differen Languages
    */
    function rightBehaviorOfTermBlue() {
      if (contextLanguage === 'de_DE') {
        return 'blau';
      } else if (contextLanguage === 'en_EN') {
        return 'blue';
      } else if (contextLanguage === 'es_ES') {
        return 'azul';
      }
      /*
      * This if your fallback, so it will return blue_fallback if no if statemant
      * above is true
      */
      return 'blue_fallback';
    }
    term.reset();
    term.withArgs('$blue').callsFake(rightBehaviorOfTermBlue);
    contextLanguage = '';
    expect(getTerm('$blue')).to.equal('blue_fallback');
    contextLanguage = 'es_ES';
    expect(getTerm('$blue')).to.equal('azul');
    contextLanguage = 'de_DE';
    expect(getTerm('$blue')).to.equal('blau');
    contextLanguage = 'en_EN';
    expect(getTerm('$blue')).to.equal('blue');
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
      return 'This product is dangerous_fallback';
    }
    boilerplate.reset();
    boilerplate.withArgs('dangerous').callsFake(rightBehaviorOfBoilerplateDanger);
    contextLanguage = '';
    expect(getBoilerplate('dangerous')).to.equal('This product is dangerous_fallback');
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
