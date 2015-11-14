var angularJSMetroNorthServices = angular.module('angularJSMetroNorthServices', ['ngResource']);

/**
* Get Train Stations
*/
angularJSMetroNorthServices.factory('MTATrainStationService',['$http', function ($http) {
	var doRequest = function (data) {
	
    var url = 'assets/data/train-stations.json';
    window.log('service', 'MTATrainStationService: calling service \'' + url + '\'');
    var promise = $http({
            method: 'GET',
            url: url,
            data: data, // pass in data as strings
            headers: {
                'Content-Type': 'application/json'
            } // set the headers so angular passing info as form data (not request payload)
        })
        .success(function (data) {
            if (data && data.status == 200) {
                window.log('service', 'MTATrainStationService: successfully retrieved MTA data.');
            } else {
                window.log('service', 'MTATrainStationService: could not retrieve MTA data.');
            }

        });
        return promise;
    };
    
    return {
        getTrainStations: function (data) {
            return doRequest(data);
        },
    };

}]);

/**
* Get Train Schedule
*/
angularJSMetroNorthServices.factory('MTATrainScheduleService',['$http', function ($http) {
	var doRequest = function (data) {

        //MTA Service URL https://mnorth.prod.acquia-sites.com/wse/gtfsrtwebapi/v1/gtfsrt/<KEY HERE>/getfeed
        var url =  'assets/data/train-schedule.json';
        window.log('service', 'MTATrainScheduleService: calling service \'' + url + '\'');
        
        var promise = $http.get(url)
        .success(function (data) {
            if (data && data.status == 200) {
                window.log('service', 'MTATrainScheduleService: successfully retrieved MTA data.');
            } else {
                window.log('service', 'MTATrainScheduleService: could not retrieve MTA data.');
            }

        });
        return promise;
    };
    
    return {
        getTrainSchedule: function (data) {
            return doRequest(data);
        },
    };

}]);

/**
* Data Sharing Service (Singleton Service to share data between two controllers)
*/
angularJSMetroNorthServices.factory('DataShareService',function($rootScope,$timeout){
  var service = {};
  service.data = false;
  service.setData = function(data){
      this.data = data;
      $timeout(function(){
         $rootScope.$broadcast('data_shared');
      },1);
  };
  service.getData = function(){
    return this.data;
  };
  return service;
});
