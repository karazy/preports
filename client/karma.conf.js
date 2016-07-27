// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:
      'app/bower_components/jquery/jquery.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/json3/lib/json3.min.js',
      'app/bower_components/es5-shim/es5-shim.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-file-upload/dist/angular-file-upload.min.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/jquery-ui/jquery-ui.js',
      'app/bower_components/angular-ui-sortable/sortable.js',
      'app/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
      'app/bower_components/rangy/rangy-core.js',
      'app/bower_components/rangy/rangy-classapplier.js',
      'app/bower_components/rangy/rangy-highlighter.js',
      'app/bower_components/rangy/rangy-selectionsaverestore.js',
      'app/bower_components/rangy/rangy-serializer.js',
      'app/bower_components/rangy/rangy-textrange.js',
      'app/bower_components/textAngular/dist/textAngular.js',
      'app/bower_components/textAngular/dist/textAngular-sanitize.js',
      'app/bower_components/textAngular/dist/textAngularSetup.js',
      'app/bower_components/angular-hotkeys/build/hotkeys.js',
      // endbower
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 9876,
    
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },
    
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],
    
    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
