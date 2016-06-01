'use strict';

(function () {
    angular.module('gantt').component('ganttResourcesList', {
        template: `
            <div class="list-group">
                <a ng-controller="GanttTaskResourceController as resourceCtrl"
                   ng-init="resourceCtrl.init(resource)"
                   ng-repeat="resource in $ctrl.resources | orderBy: '-isAssignedToThisProject'"
                   class="list-group-item"
                   id="task-resources-list">
                
                    <div class="left-block">
                        <h5 class="list-group-item-heading nowrap-ellipsis-text">{{resourceCtrl.name}}</h5>
                        <div class="list-group-item-text">
                            <div ng-show="resourceCtrl.projects.length > 0" class="nowrap-ellipsis-text">
                                <i>Projects :</i> {{resourceCtrl.projectsString}}
                            </div>
                            <div ng-hide="resourceCtrl.projects.length > 0" class="nowrap-ellipsis-text">
                                This resource is fully available.
                            </div>
                        </div>
                    </div>
                    <div class="right-block">
                        <h5 class="list-group-item-heading">Employment:</h5>
                        <div class="employment-block">
                            <b>{{resourceCtrl.employmentHours}}</b> hrs. &nbsp; <b>{{resourceCtrl.employmentPercentage}}%</b>
                        </div>
                    </div>
                </a> 
            </div>
        `,
        controller: GanttResourcesListController,
        bindings: {
            taskId: '@'
        }
    });

    function GanttResourcesListController($rootScope, $scope, GanttResourcesService, GanttTasksService){
        var ctrl = this;
        ctrl.resources = [];

        if(GanttResourcesService.ready){
            initResources();
        }
        $rootScope.$on('gantt.resources.changed', initResources);
        $scope.$watch('$ctrl.taskId', initResources);

        function initResources() {
            if(!GanttResourcesService.ready) return;
            ctrl.resources = GanttTasksService.getTask(ctrl.taskId).resourcesAssigned.map(function(resID) {
                return GanttResourcesService.getResource(resID);
            });
        }
    }
}());