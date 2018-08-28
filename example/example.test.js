// Specifies where to look for your expressions. Change this if your expressions are stored in a different location.
const filePath = './example/customJSFunctions.js';


// Do not change the following code block

// Import and initialize
jest.unmock('pim-integrations-expression-unit-test');
const util = require('pim-integrations-expression-unit-test').initalize({ filePath: filePath });

eval(util.unparsedExpressions);

// Prepare for expression evaluation
const term = util.term;
const boilerplate = util.boilerplate;
const product = util.product;
let contextLanguage = util.contextLanguage;
let contextTag = util.contextTag;


/*
* At this point, your expressions are available. You can call them either
* directly, or from within your test cases. contextLanguage is a simple
* variable, which you can change. In expressions it is used for example with:
* "en_EN","de_DE" or "es_ES".
* term, boilerplate and product.getAttributeValue are jest mocks, and can be
* configured like any other jest mock. You can read the jest-mock documentation
* here: https://jestjs.io/docs/en/mock-functions
*
* Happy testing!
*/

/*
* These blocks are run before and after each test. you can add your own code here.
*/

beforeEach(() => {
  // Reset context language and tag. Usually, you do not want to change this here.
  contextLanguage = '';
  contextTag = '';
});
afterEach(() => {
  jest.resetAllMocks(); // make sure mocks are resetted. Usually, you also do not want to delete this.
});


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
  it('...supports contextLanguage', () => {
    getContextLanguage();
  });
  it('...supports contextTag', () => {
    getContextTag();
  });
});

describe('You can define the behavior of the internal functions', () => {
  describe('You can define the return value in relation to the input value', () => {
    it('Calling term("$red") returns "red"', () => {
      /*
      * term, boilerplate and product.attributeValue are jest stubs.
      * You can define their behavior and can analyze there behavior like every other jest-mock.
      * See the documentation of jest for more informations how to do it `https://jest-bot.github.io/jest/docs/getting-started.html`
      */
      term.mockImplementation((arg) => {
        if (arg === '$red') {
          return 'red';
        }
        return 'blue';
      });


      expect(getRedTerm()).toBe('red');
      boilerplate.mockImplementation((arg) => {
        if (arg === 'legal') {
          return 'My legal text';
        }
      });
      expect(getLegalBoilerplate()).toBe('My legal text');
    });
    it('Without configuration, the built in functions always return undefined', () => {
      expect(getBlueTerm()).toBe(undefined);
    });
  });
});


describe('You can use your expressions referencing other attributes', () => {
  it('For instance, calculate the surface by multiplying the attribtues for height and length', () => {
    product.attributeValue.mockImplementation((arg) => {
      if (arg === 'height') {
        return 5;
      }
      if (arg === 'length') {
        return 3;
      }
    });
    expect(calculateSurface()).toBe(15);
  });
});
describe('You can also use other expressions for your expressions', () => {
  /*
  * This only works if all your expressions  are in the customJSFunctions file.
  * It does not work if you are referencing an expression which has been added in-line in PIM.
  * In that case, you should  directly define the return value of that expression, the same way
  * you set up the return value for other function calls
  */
  it('For example, concatenating a unit of measure to an expression result ', () => {
    /*
    * First we need to set up the attribute values used by the nested expression
    */
    product.attributeValue.mockImplementation((arg) => {
      if (arg === 'surface') {
        return 32;
      }
    });

    /*
    * This expression calls another attribute, which in turn uses the attribute values for height and length.
    */
    expect(calculateSurfaceString()).toBe('32 cm');
  });
});
describe('You can also use term() and boilerplate() in relation to contextLanguage', () => {
  it('Returns term in relation to the contextLanguage', () => {
    /*
    * First you need to set up a function for the right behavior of the term
    * in different Languages
    */
    term.mockImplementation((arg) => {
      if (arg === '$blue') {
        if (contextLanguage === 'de_DE') {
          return 'blau';
        } if (contextLanguage === 'en_EN') {
          return 'blue';
        } if (contextLanguage === 'es_ES') {
          return 'azul';
        }
        return 'bleu';
      }
    });
    contextLanguage = '';
    expect(getBlueTerm()).toBe('bleu');
    contextLanguage = 'es_ES';
    expect(getBlueTerm()).toBe('azul');
    contextLanguage = 'de_DE';
    expect(getBlueTerm()).toBe('blau');
    contextLanguage = 'en_EN';
    expect(getBlueTerm()).toBe('blue');
  });
  it('Returns boilerplate in relation to the contextLanguage', () => {
    /*
     * Define a function which returns different boilerplates based on the contextLanguage
     */
    boilerplate.mockImplementation((arg) => {
      if (arg === 'dangerous') {
        if (contextLanguage === 'de_DE') {
          return 'Das Produkt ist gefaehrlich';
        } if (contextLanguage === 'en_EN') {
          return 'This product is dangerous';
        }
        /*
            * This if your fallback, so it will return blue_fallback if no if statemant
            * above is true
            */
        return 'This product is harmless';
      }
    });
    contextLanguage = '';
    expect(getDangerousBoilerplate()).toBe('This product is harmless');
    contextLanguage = 'de_DE';
    expect(getDangerousBoilerplate()).toBe('Das Produkt ist gefaehrlich');
    contextLanguage = 'en_EN';
    expect(getDangerousBoilerplate()).toBe('This product is dangerous');
  });
});
describe('You can also use contextTag in your expressions', () => {
  contextTag = '2_wire_connector';
  expect(calculateMinimalSuspense()).toBe(20);
  contextTag = '3_wire_connector';
  expect(calculateMinimalSuspense()).toBe(18);
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
    product.attributeValue.mockImplementation((arg) => {
      if (arg === 'minimalSuspense') {
        return calculateMinimalSuspense();
      }
      if (arg === 'maximalSuspense') {
        return calculateMaximalSuspense();
      }
    });
    term.mockImplementation((arg) => {
      if (arg === 'UoM_suspense') {
        return 'DC';
      }
    });
    expect(buildMinMaxString()).toBe('20...32 DC');
    contextTag = '3_wire_connector';
    expect(buildMinMaxString()).toBe('18...32 DC');
    contextLanguage = 'jp_JP';
    expect(buildMinMaxString()).toBe('18~32 DC');
    contextTag = '4_wire_connector';
    expect(buildMinMaxString()).toBe('<30');
  });
});
