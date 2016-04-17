'use strict';
(function () {
    angular.module('gantt').factory('GanttTasksDataProviderService', GanttTasksDataProviderService);

    function GanttTasksDataProviderService(GanttHttpService) {
        var service = {
            getTasks: getTasks,
            updateTask: updateTask,
            addTask: addTask,
            deleteTask: deleteTask,
            moveTaskUp: moveTaskUp,
            moveTaskDown: moveTaskDown
        };
        return service;

        function getTasks(){
            return GanttHttpService.sendRequest('GetTasks');
        }

        function addTask(task, prepend){
            console.log('adding gantt task: ', task);
            var data = { task: JSON.stringify(task), prepend: prepend};
            var promise = GanttHttpService.sendRequest('SaveTask', data);

            promise.then(function (serverData) {
                task.id = serverData.id;
                task.order = serverData.order;
                return task;
            });

            return promise;
        }

        function updateTask(task){
            console.log('updating gantt task: ', task);
            var promise = GanttHttpService.sendRequest('SaveTask', { task: JSON.stringify(task), prepend: 0});

            return promise;
        }

        function deleteTask(id){

        }

        function moveTaskUp(){
            //return GanttHttpService.sendRequest('gantt-task', task);
        }

        function moveTaskDown(){
            //return GanttHttpService.sendRequest('gantt-task', task);
        }
    }
})();

