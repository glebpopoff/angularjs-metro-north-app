var angularJSMetroNorth = angular.module('angularJSMetroNorth', [
														'ngRoute',
														'angularJSMetroNorthControllers',
                                                        'angularJSMetroNorthServices',
                                                        'angularJSMetroNorthDirectives'
	                                                 ]);
	                                                 
//setup routing
angularJSMetroNorth.config(['$routeProvider', '$locationProvider', '$resourceProvider',
  function ($routeProvider, $locationProvider,$resourceProvider) {
        $routeProvider.
        when('/', {
            title: 'AngularJS Metro-North | Train Stations',
            templateUrl: 'assets/ngapp/partials/train-stations.html?' + APP_CACHE_SID,
            controller: 'TrainStationCtrl'
        }).
        when('/schedule/:id', {
            title: 'AngularJS Metro-North | Train Schedule',
            templateUrl: 'assets/ngapp/partials/train-schedule.html?' + APP_CACHE_SID,
            controller: 'TrainScheduleCtrl'
        }).
        //this is important to avoid infinite loop redirect (other NG apps redirect back here on NG 404)
        otherwise({
            redirectTo: '/'
        });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
}]);

//caching id
var APP_CACHE_SID = (new Date()).getTime();
//set to false to disable console.log
var APP_DEBUG = true; 

//console.log wrapper (disabled in older browsers)
window.log = function () {
    if (!APP_DEBUG) return;
    log.history = log.history || [];
    log.history.push(arguments);
    if (this.console) {
        console.log(Array.prototype.slice.call(arguments))
    }
};