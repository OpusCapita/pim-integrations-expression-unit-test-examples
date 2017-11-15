module.exports = {
    "extends": "airbnb-base",
    'rules': {
    "no-plusplus":["error", { "allowForLoopAfterthoughts": true }],
    "consistent-return": ["error", { "treatUndefinedAsUnspecified": false }],
    "no-console": ["error", {allow: ["log"]}],
    "no-var": 0,
    "one-var": 0,
    "no-unused-vars": 0,
    "no-undef": 0,
    "no-eval": 0,
    "consistent-return": 0,
    "vars-on-top": 0,
    "max-len": 0
  },
    'env': {
        "mocha": true,
        "es6": false
    }

};
