module.exports = function(config) {
    config.set({
 
        // base path, that will be used to resolve files and exclude
        basePath: '',
 
        // frameworks to use
        frameworks: ['jasmine'],
        // list of files / patterns to load in the browser
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/lodash/lodash.js',
            'bower_components/moment/moment.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-google-maps/dist/angular-google-maps.js',
            'bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
            'bower_components/ngAutocomplete/src/ngAutocomplete.js',
            'bower_components/ng-file-upload/angular-file-upload-shim.js',
            'bower_components/ng-file-upload/angular-file-upload.js',
            'bower_components/highcharts-ng/dist/highcharts-ng.js',
            'bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'src/**/*.js',
            'src/**/*.html',
			'tests/**/*.js'
        ],
        preprocessors: {
            'src/**/*.html': ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {
            // strip this from the file path
            stripPrefix: 'src/',
            // setting this option will create only a single module that contains templates
            // from all the files, so you can load them all with module('foo')
            moduleName: 'myTemplates'
          },
        client: {
	        captureConsole: true
        },
        // list of files to exclude
        exclude: [
        ],
 
        // test results reporter to use
        reporters: ['progress'],
 
        // web server port
        port: 9876,
 
        // enable / disable colors in the output (reporters and logs)
        colors: true,
 
        // level of logging
        logLevel: config.LOG_INFO,
 
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
 
        // Start these browsers
        browsers: ['PhantomJS'],
 
        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,
 
        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};