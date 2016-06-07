'use strict';
(function () {
    angular.module('gantt').service('GanttResourcesService', GanttResourcesService);

    function GanttResourcesService($q, GanttProjectsService, GanttOptionsService, GanttResourcesDataProviderService) {
        var service = this;
        var _IDToResourceDictionary = null;
        var _ProjectToResourceDictionary = null;
        var _TaskToResourceDictionary = null;

        service.getResource = getResource;
        service.getResources = getResources;
        service.getAvailableForTaskResources = getAvailableForTaskResources;
        service.getProjectResources = getProjectResources;
        service.getTaskResources = getTaskResources;
        service.assignResourceToTask = assignResourceToTask;
        service.unassignResourceFromTask = unassignResourceFromTask;

        service.initialized = $q.all([
            GanttResourcesDataProviderService.getResources(),
            GanttProjectsService.initialized
        ])
        .then(function(arr){
            initDictionaries(arr[0]);
        });

        function initDictionaries(data){
            _IDToResourceDictionary = new Dictionary(data);

            _ProjectToResourceDictionary = new Dictionary(
                _IDToResourceDictionary.getValues(),
                (resource) => resource.assignedToProjects
            );

            _TaskToResourceDictionary = new Dictionary(
                _IDToResourceDictionary.getValues(),
                (resource) => resource.assignedToTasks.map(task => task.id),
                (resource, taskID) => ({
                    resource: resource,
                    hours: resource.assignedToTasks.filter(task => task.id == taskID)[0].hours
                })
            );

            _IDToResourceDictionary.getValues().forEach(function (resource) {
                resource.projects = resource.assignedToProjects.map(
                    projectID => GanttProjectsService.getProject(projectID)
                );
            });
        }
        function getResource(id) {
            return _IDToResourceDictionary.get(id)[0];
        }
        function getResources() {
            return _IDToResourceDictionary.getValues();
        }
        function getAvailableForTaskResources(taskID) {
            return getResources().filter(function(resource){
                return resource.assignedToTasks.map(task => task.id).indexOf(taskID) === -1;
            });
        }
        function getProjectResources(projectID) {
            return _ProjectToResourceDictionary.get(projectID);
        }
        function getTaskResources(taskID) {
            return _TaskToResourceDictionary.get(taskID);
        }
        function assignResourceToTask(resourceID, taskID, hoursEmployed) {
            return GanttResourcesDataProviderService.assignResourceToTask(resourceID, taskID, hoursEmployed)
                .then(function(){
                    var resource = _IDToResourceDictionary.get(resourceID)[0];
                    resource.assignedToTasks.push({id: taskID, hours: hoursEmployed});
                    resource.assignedToProjects.push(GanttOptionsService.getProjectID());
                    initDictionaries(_IDToResourceDictionary.getValues());
                });
        }
        function unassignResourceFromTask(resourceID, taskID){
            return GanttResourcesDataProviderService.unassignResourceFromTask(resourceID, taskID)
                .then(function(){
                    var resource = _IDToResourceDictionary.get(resourceID)[0];
                    var index = resource.assignedToTasks.map(task => task.id).indexOf(parseInt(taskID));
                    if(index > -1) {
                        resource.assignedToTasks.splice(index, 1);
                    }
                    initDictionaries(_IDToResourceDictionary.getValues());
                });
        }
    }
})();