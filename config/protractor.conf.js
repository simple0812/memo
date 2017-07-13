
var helpers = require('./helper');

exports.config = {
  baseUrl: 'http://localhost:5555/',

  // use `npm run e2e`
  specs: [
    helpers.root('src/**/**.e2e.js'),
    helpers.root('src/**/*.e2e.js')
  ],
  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['show-fps-counter=true']
    }
  },
  onPrepare: function() {
    browser.ignoreSynchronization = false;
  },

  useAllAngular2AppRoots: false,
  waitForAngularEnabled: false
};