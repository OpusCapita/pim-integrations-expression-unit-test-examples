// Import and initialize
const util = require('../unitTestLibrary/util').initalize('../../example/config.json');
// you dont need to do this in your file
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
      term.withArgs('$red').returnsArg('red'); // term will return red if it gets called with argument $red
      /*
      * term, boilerplate, product.attributeValue and product.attributeValues are sinon stubs.
      * You can define their behavior and can analyze there behavior like every other sinon stub.
      * See the documentation of sinon for more informations how to do it `http://sinonjs.org/`
      */
      expect(getTerm('$red')).to.equal('red');
      boilerplate.withArgs('legal').returns('My legal text');
      expect(boilerplate('legal')).to.equal('My legal text');
      it('will return undefined if the term is not defined');
      expect(getTerm('$blue')).to.equal(undefined);
    });
  });
});

describe('You can also set the behavior more complex:', () => {
  it('can be set in relation of other variables', () => {
    term.reset(); // because of this the stub is cleared and has its initial behavior
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
    /* The function gets linked with the sinon-stub term.
    *   Now the function gets called every time when term gets called with argument $red
    */
    term.withArgs('$red').callsFake(rightBehaviorOfTermRed);
    contextLanguage = ''; // contextLanguage is variable so if you want to reset it just do this
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
    function rightBehaviorOfTermBlue() { // first you need to create a function for different contextLanguages
      if (contextLanguage === 'de_DE') {
        return 'blau';
      } else if (contextLanguage === 'en_EN') {
        return 'blue';
      } else if (contextLanguage === 'es_ES') {
        return 'azul';
      }
      // your fallback
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
        return 'Das Produkt ist gefaerlich';
      } else if (contextLanguage === 'en_EN') {
        return 'This product is dangerous';
      }
      // your fallback
      return 'This product is dangerous_fallback';
    }
    boilerplate.reset();
    boilerplate.withArgs('dangerous').callsFake(rightBehaviorOfBoilerplateDanger);
    contextLanguage = '';
    expect(getBoilerplate('dangerous')).to.equal('This product is dangerous_fallback');
    contextLanguage = 'de_DE';
    expect(getBoilerplate('dangerous')).to.equal('Das Produkt ist gefaerlich');
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
