# Karma configuration
module.exports = (config) ->
  config.set
    basePath: "../"

    frameworks: [
      "mocha"
      "chai"
    ]

    # list of files / patterns to load in the browser
    files: [
      "bower_components/jquery/jquery.js"

      "bower_components/sinon/lib/sinon.js"
      "bower_components/sinon/lib/sinon/spy.js"
      "bower_components/sinon/lib/sinon/call.js"
      "bower_components/sinon/lib/sinon/stub.js"
      "bower_components/sinon/lib/sinon/mock.js"
      "bower_components/sinon/lib/sinon/assert.js"

      "bower_components/mustache/mustache.js"
      "bower_components/jquery-Mustache/jquery.mustache.js"
      "bower_components/sammy/lib/sammy.js"
      "bower_components/jquery.couch/jquery.couch.js"

      "attachments/**.js"

      "pattern": "templates/**.html", "included": false

      # "test/unit/helpers/**/*.coffee"
      # "test/unit/**/*_spec.coffee"
      "test/unit/**/*_spec.js"
    ]

    preprocessors:
      "**/*.coffee": ["coffee"]

    ngHtml2JsPreprocessor:
      stripPrefix: "app/"
      moduleName: "myApp.templates"

    reporters: ["dots"]

    # web server port
    port: 8080

    # cli runner port
    runnerPort: 9100

    # enable / disable watching file and executing tests whenever any file changes
    autoWatch: true

    # Start these browsers, currently available:
    # - Chrome
    # - ChromeCanary
    # - Firefox
    # - Opera
    # - Safari (only Mac)
    # - PhantomJS
    # - IE (only Windows)
    browsers: ["PhantomJS"]

    # Continuous Integration mode
    # if true, it capture browsers, run tests and exit
    singleRun: false

    # level of logging
    # possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_WARN

    plugins: [
      "karma-coffee-preprocessor"
      "karma-ng-html2js-preprocessor"

      "karma-mocha"
      "karma-chai-plugins"
      "karma-spec-reporter"
      "karma-coverage"

      "karma-phantomjs-launcher"
      "karma-chrome-launcher"
      "karma-firefox-launcher"
      "karma-opera-launcher"
    ]
