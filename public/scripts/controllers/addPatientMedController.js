/** Pillsy
*  @author  Chuks Onwuneme
*  @version 1.0
*  @package AddPatientMedController AngularJS module  
*/

var app = angular.module('AddPatientMedController', []);     //instantiates AddPatientMedController module
app.controller('addPatientMedController', function ($scope, $filter, $location, $rootScope, apiService, stateService, configService) {
	'use strict';

    console.log('addPatientMedController');

    //patient cache data
    $scope.activeGroup   = stateService.getActiveGroup();
    $scope.activePatient = stateService.getActivePatient();

    if ( !$scope.activeGroup || !$scope.activePatient){
        $location.path('/');
    }
   
    $scope.drug_search_url = "/v1/n/ndcdrug?query=";
    
    $scope.integerval  = /^\d*$/;
    
    $scope.dateOptions = { 
        dateFormat: 'mm-dd-yy',
        minDate:    null 
    } 

    $scope.drug = {
        doses_day: 1
    };

    $scope.numDoses = $scope.drug.doses_day;

    $scope.$watch('drug', function() {
        console.log('form model has been changed');

        $scope.numDoses = $scope.drug.doses_day;
    }, true);

    function getReminderTime(reminderTime){

        var startDateMoment    = moment($scope.drug.start_date);
        var reminderTimeMoment = moment(reminderTime);

        let reminder = {
            'hours':   reminderTimeMoment.get('hours'),
            'minutes': reminderTimeMoment.get('minutes')
        };

        return reminder;
    }

    function getStartTime(startTime){

        let startTimeMoment = moment(startTime);
        var now             = moment();

        if (startTimeMoment.isSameOrBefore(now, 'day')){
            //use current time if now, time will be the start of a future day 00:00:00
            startTimeMoment = moment(startTimeMoment).set({
                'hours':        now.get('hours'),
                'minutes':      now.get('minutes'),
                'seconds':      now.get('seconds'),
                'milliseconds': now.get('milliseconds')
            });
        }

        startTime = {
            'year':         startTimeMoment.get('year'),
            'month':        startTimeMoment.get('month'),
            'date':         startTimeMoment.get('date'),
            'hours':        startTimeMoment.get('hours'),
            'minutes':      startTimeMoment.get('minutes'),
            'seconds':      startTimeMoment.get('seconds'),
            'milliseconds': startTimeMoment.get('milliseconds')
        };
   
        return startTime
    }

    //$scope.submit = function(drug){
    $scope.submit_create_drug_form = function(){

        if (!$scope.drug.name){
            alert('Drug name required');
            return false;
        }
        else if(!$scope.drug.quantity){
            alert('Drug quantity required');
        }
        else if (!$scope.drug.start_date){
            alert('Start date required');
        }
        else if (!$scope.drug.deviceId){
            alert('PillsyCap identifier required');
        }
        else{
            console.log('Got fields, proceed - $scope.drug.doses_day: '+ $scope.drug.doses_day);

            if ($scope.drug.doses_day === 1){
                processAddDrug();
            }
            else if ($scope.drug.doses_day === 2){
                if (!$scope.drug.reminder1_time){
                    alert('Reminder 1 time required');
                }
                else if (!$scope.drug.reminder2_time){
                    alert('Reminder 2 time required');
                }
                else{
                    processAddDrug();
                }
            }
            else if ($scope.drug.doses_day === 3){
                if (!$scope.drug.reminder1_time){
                    alert('Reminder 1 time required');
                }
                else if (!$scope.drug.reminder2_time){
                    alert('Reminder 2 time required');
                }
                else if (!$scope.drug.reminder3_time){
                    alert('Reminder 3 time required');
                }
                else {
                    processAddDrug();
                }
            }
            else if ($scope.drug.doses_day === 4){
                if (!$scope.drug.reminder1_time){
                    alert('Reminder 1 time required');
                }
                else if (!$scope.drug.reminder2_time){
                    alert('Reminder 2 time required');
                }
                else if (!$scope.drug.reminder3_time){
                    alert('Reminder 3 time required');
                }
                else if (!$scope.drug.reminder4_time){
                    alert('Reminder 4 time required');
                }
                else {
                    processAddDrug();
                }
            }
            else{
                console.log('Got everything, now proceed...');

                processAddDrug();
            }
        }
    }

    function processAddDrug(){
      
        var numDoses = $scope.drug.doses_day;
        var initScheduleTimes = [];

        console.log('Got everything, numDoses: '+numDoses);
 
        switch(numDoses){
            case 1:
                initScheduleTimes.push( getReminderTime($scope.drug.reminder1_time) );
                break;
            case 2:
                initScheduleTimes.push( getReminderTime($scope.drug.reminder1_time) );
                initScheduleTimes.push( getReminderTime($scope.drug.reminder2_time) );
                break;
            case 3:
                initScheduleTimes.push( getReminderTime($scope.drug.reminder1_time) );
                initScheduleTimes.push( getReminderTime($scope.drug.reminder2_time) );
                initScheduleTimes.push( getReminderTime($scope.drug.reminder3_time) );
                break;
            case 4:
                initScheduleTimes.push( getReminderTime($scope.drug.reminder1_time) );
                initScheduleTimes.push( getReminderTime($scope.drug.reminder2_time) );
                initScheduleTimes.push( getReminderTime($scope.drug.reminder3_time) );
                initScheduleTimes.push( getReminderTime($scope.drug.reminder4_time) );
                break;
        }          

        // Trigger validation flag.
        $scope.submitted = true;

        var dataObj = {
            'name':                    $scope.drug.name,
            'rxNumber':                $scope.drug.rxNumber,
            'deviceId':                $scope.drug.deviceId,
            'initScheduleTimes':       initScheduleTimes,   //reminders
            'quantityPerDose':         $scope.drug.pills_dose,
            'quantity':                $scope.drug.quantity,
            'startTime':               getStartTime($scope.drug.start_date),
            'locked':                  true,
            'enableSMSReminders':      true,
            'enableIVRReminders':      true,
            'enablePushNoteReminders': true
        }; 
                    
        if ($scope.drug.pillsyHubId){
            dataObj.pillsyHubId = $scope.drug.pillsyHubId;
        }

        if ( ($scope.drug.quantity != null) && ($scope.drug.quantity != undefined) ){
            dataObj.quantity = $scope.drug.quantity;
        }

        var groupId   = $scope.activeGroup.id;
        var patientId = $scope.activePatient.id;
            
        console.log('apiService.post - dataObj: '+JSON.stringify(dataObj));
       
        var api = '/v1/a/organization/group/'+groupId+'/patient/'+patientId+'/drug';
        console.log('apiService.post - api is: '+api);

        $scope.createDrugLoading = true;

        apiService.post(api,dataObj).then(function(result){
            $scope.createDrugLoading = false;

            if (result){
                console.log('apiService.post - result is: '+JSON.stringify(result));

                if (result.msg == 'success'){
                    console.log('apiService.post - success');

                    var drug          = result.data;
                    var activePatient = stateService.getActivePatient();  
                    var drugs         = activePatient.drugs;
                    drugs.push(drug);

                    activePatient.drugs = drugs;

                    var drugNames = [];

                    drugs.map(function(iDrug){
                        drugNames.push(iDrug.name);
                    });

                    drugNames = drugNames.join(', ');
                    
                    activePatient.drugNames = drugNames;

                    stateService.addNewDrugToPatient(drug, activePatient.id);
                    stateService.setActivePatient(activePatient);
                    $location.path('/patients/patient/data');
                }
                else{
                    console.log('apiService.post - error');

                    alert(result.msg);
                }
            }
            else{
                alert('Server error');
            }
        });
    }

});

app.filter('fromNow', function() {
    return function(dateString) {
      	return moment(dateString).fromNow()
    };
});