
var angularJSMetroNorthControllers = angular.module('angularJSMetroNorthControllers', []);

/*
 * Train Station / Homepage Controller
 */
angularJSMetroNorthControllers.controller('TrainStationCtrl', ['$scope', '$rootScope', 'MTATrainStationService', 'DataShareService', '$location',
    function ($scope, $rootScope, MTADataService, DataShareService, $location) {
        window.log('controller', 'TrainStationCtrl: init..');

        //set the page title
        $rootScope.page_title = "Stations";

        //call the web service
        MTADataService.getTrainStations().then(function (response) {
        		if (response && response.data && response.data.entity) {
                    window.log('controller', 'TrainStationCtrl: Processing MTA data. Total records: ' + response.data.entity.length);
                    $scope.train_stations = response.data.entity;

                    //process JSON data and create a simple hashtable that we can pass to the next container
                    var stationMap = {};
                    angular.forEach($scope.train_stations, function(entity, key) {
                        stationMap[entity.station.id] = { "name" : entity.station.name, "thumbnail": entity.station.thumbnail };
                    });

                    DataShareService.setData(stationMap);
                }

                $scope.navigateToSchedule =  function (id) {
                    window.log('controller', 'TrainStationCtrl: Selected Station ID  \'' + id + '\'');

                    $location.path('/schedule/' + id);
                };
            });
    }
]);

/**
* Train Schedule
*/
angularJSMetroNorthControllers.controller('TrainScheduleCtrl', ['$scope', '$rootScope', 'MTATrainScheduleService',  'DataShareService', '$routeParams', '$location',
    function ($scope, $rootScope, MTATrainScheduleService, DataShareService, $routeParams, $location) {

        var stationID = $routeParams.id;

        window.log('controller', 'TrainScheduleCtrl: init. Station ID: ' + stationID);

        //get data from the station service
        var stationContainer = DataShareService.getData();

        //get the name of the station from the station container
        $rootScope.page_title = (stationContainer[stationID]) ? stationContainer[stationID].name : 'Schedule';
        
        //call the web service
        MTATrainScheduleService.getTrainSchedule({ trainStationId: $routeParams.id }).then(function (response) {
        		if (response && response.data && response.data.entity) {
                    window.log('controller', 'MTATrainScheduleService: Processing MTA data. Total records: ' + response.data.entity.length);
                    
                    $scope.train_schedule = [];
                    for (var i in response.data.entity)
					{
						var trainNum = response.data.entity[i].id;
						var trainTripUpdateContainer = response.data.entity[i].trip_update.stop_time_update;
						
                        for (var j in trainTripUpdateContainer)
                        {
                            if (trainTripUpdateContainer[j].stop_id == stationID)
                            {
                                //get the final destination (last element in the array)
                                var finalStopID = trainTripUpdateContainer[trainTripUpdateContainer.length-1].stop_id;

                                //now lookup stop ID in the station container
                                var finalStop = stationContainer[finalStopID];

                                if (finalStop && finalStop.name)
                                {
                                    var schedule = { "destination_name" : finalStop.name, 
                                                      "destination_thumbnail" : finalStop.thumbnail, 
                                                      "departure_time" :  trainTripUpdateContainer[j].departure.time
                                                    };
                                    $scope.train_schedule.push(schedule);
                                }

                            }
                        }
						
						
					}
                }
            });


        $scope.navigateToSearch =  function (id) {
                window.log('controller', 'TrainScheduleCtrl: Redirecting back to Station List');

                $location.path('/');
            };
    }
]);