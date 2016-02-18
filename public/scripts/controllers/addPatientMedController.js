/** Pillsy
*  @author  Chuks Onwuneme
*  @version 1.0
*  @package AddPatientMedController AngularJS module  
*/

var app = angular.module('AddPatientMedController', []);     //instantiates AddPatientMedController module
app.controller('addPatientMedController', function ($scope, $filter, $location, $rootScope, apiService, stateService, configService) {
	'use strict';

    console.log('addPatientMedController');

    //patient
    var pillsy = stateService.getPillsy();
    
    if ( (!pillsy.active_patient) || (!pillsy.active_group) ){
        $location.path('/');
    }
    else{
        
        $scope.group   = pillsy.active_group;
        $scope.patient = pillsy.active_patient;
    }

    $scope.drug_search_url = "/v1/n/ndcdrug?query=";
    
    $scope.integerval  = /^\d*$/;

    $scope.dateOptions = {
        changeYear:  true,
        changeMonth: true,
        changeDay:   true,
        yearRange:   '2016:-0'
    };

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
        var reminder           = moment(startDateMoment);
        reminder.hour( reminderTimeMoment.hour() );
        reminder.minute( reminderTimeMoment.minute() );
        reminder.second( 0 );
        reminder.millisecond(0);

        return reminder;
    }

    //$scope.submit = function(drug){
    $scope.submit_create_drug_form = function(){

        if (!$scope.drug.name){
            alert('Drug name required');
        }
        else if(!$scope.drug.quantity){
            alert('Drug quantity required');
        }
        else if (!$scope.drug.start_date){
            alert('Start date required');
        }
        else if (!$scope.drug.pills_dose){
            alert('Number of pills per dose required');
        }
        else if (!$scope.drug.doses_day){
            alert('Doses per day required');
        }
        else if($scope.drug.doses_day){
            if ($scope.drug.doses_day == 1){
                if (!$scope.drug.reminder1_time){
                    alert('Reminder 1 time required');
                }
            }
            if ($scope.drug.doses_day == 2){
                if (!$scope.drug.reminder1_time){
                    alert('Reminder 1 time required');
                }
                if (!$scope.drug.reminder2_time){
                    alert('Reminder 2 time required');
                }
            }
            if ($scope.drug.doses_day == 3){
                if (!$scope.drug.reminder1_time){
                    alert('Reminder 1 time required');
                }
                if (!$scope.drug.reminder2_time){
                    alert('Reminder 2 time required');
                }
                if (!$scope.drug.reminder3_time){
                    alert('Reminder 3 time required');
                }
            }
            if ($scope.drug.doses_day == 4){
                if (!$scope.drug.reminder1_time){
                    alert('Reminder 1 time required');
                }
                if (!$scope.drug.reminder2_time){
                    alert('Reminder 2 time required');
                }
                if (!$scope.drug.reminder3_time){
                    alert('Reminder 3 time required');
                }
                if (!$scope.drug.reminder4_time){
                    alert('Reminder 4 time required');
                }
            }
        }
        else if (!$scope.drug.days_therapy){
            alert('Days of therapy required');
        }
        else if (!$scope.drug.end_date){
            alert('End date required');
        }
        else if (!$scope.drug.pillsyCapId){
            alert('PillsyCap identifier required');
        }
        else{
            console.log('Passwords match, proceed with registration...');

            var initScheduleTimes = [];

            for (var i=0; i<$scope.drug.doses_day; i++){

                switch(i){
                    case 0:
                        initScheduleTimes.push( getReminderTime($scope.drug.reminder1_time) );
                        break;
                    case 1:
                        initScheduleTimes.push( getReminderTime($scope.drug.reminder1_time) );
                        initScheduleTimes.push( getReminderTime($scope.drug.reminder2_time) );
                        break;
                    case 2:
                        initScheduleTimes.push( getReminderTime($scope.drug.reminder1_time) );
                        initScheduleTimes.push( getReminderTime($scope.drug.reminder2_time) );
                        initScheduleTimes.push( getReminderTime($scope.drug.reminder3_time) );
                        break;
                    case 3:
                        initScheduleTimes.push( getReminderTime($scope.drug.reminder1_time) );
                        initScheduleTimes.push( getReminderTime($scope.drug.reminder2_time) );
                        initScheduleTimes.push( getReminderTime($scope.drug.reminder3_time) );
                        initScheduleTimes.push( getReminderTime($scope.drug.reminder4_time) );
                        break;

                }
                
            }

            // Trigger validation flag.
            $scope.submitted = true;

            var dataObj = {
                'name':              $scope.drug.name,
                'source':            'PillsyCap',
                'pillsyCapId':       $scope.drug.pillsyCapId,
                'initScheduleTimes': initScheduleTimes,   //reminders
                'quantityPerDose':   $scope.drug.pills_dose,
                'quantity':          $scope.drug.quantity
            }; 

            /*if (drug.name instanceof Object){

                if ( Object.prototype.hasOwnProperty.call(drug.name, 'originalObject') ){

                    name               = drug.name.originalObject.pillsyName;
                    var compound       = drug.name.originalObject.chemicalName;
                    var dose           = drug.name.originalObject.strengthNumber;
                    var doseUnits      = drug.name.originalObject.strengthUnit;
                    var formFactor     = drug.name.originalObject.dosageDisplay;
                    var nDCCode        = drug.name.originalObject.nDCCode;
                    var nDCCode11Digit = drug.name.originalObject.nDCCode11Digit;

                    if (name){
                        dataObj.name = name;
                    }
                    if (compound){
                        dataObj.compound = compound;
                    }
                    if (dose){
                        dataObj.dose = dose;
                    }
                    if (doseUnits){
                        dataObj.doseUnits = doseUnits;
                    }
                    if (formFactor){
                        dataObj.formFactor = formFactor;
                    }
                    if (nDCCode){
                        dataObj.nDCCode = nDCCode;
                    }
                    if (nDCCode11Digit){
                        dataObj.nDCCode11Digit = nDCCode11Digit;
                    }
                }
            }*/
                
            if ($scope.drug.pillsyHubId){
                dataObj.pillsyHubId = $scope.drug.pillsyHubId;
            }

            if ( ($scope.drug.quantity != null) && ($scope.drug.quantity != undefined) ){
                dataObj.quantity = $scope.drug.quantity;
            }

            var groupId   = $scope.group.id;
            var patientId = $scope.patient.id;
        
            var api = '/v1/a/organization/group/'+groupId+'/patient/'+patientId+'/drug'
            console.log('apiService.post - api is: '+api);

            $scope.createDrugLoading = true;

            alert('posting to: '+api);
            apiService.post(api,dataObj).then(function(result){
                $scope.createDrugLoading = false;
                if (result){
                    alert('apiService.post - result is: '+JSON.stringify(result));

                    if (result.msg == 'success'){
                        console.log('apiService.post - success');

                        var patient = result.data;
                        $rootScope.active_patient = patient;
                        $location.path('/group/patient/data');

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
    }
});

app.filter('fromNow', function() {
    return function(dateString) {
      	return moment(dateString).fromNow()
    };
});