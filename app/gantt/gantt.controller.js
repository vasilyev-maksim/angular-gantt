(function(){
    angular.module('gantt').controller('GanttController', GanttController);

    function GanttController (GanttTasksService, GanttOptionsService, $scope,
                              $q, $rootScope, TimelineService, GanttBaselinesService) {
        var ganttCtrl = this;
        var dataDefer = $q.defer();

        ganttCtrl.isEmpty = true;
        ganttCtrl.zoom = GanttOptionsService.zoomOptions;
        ganttCtrl.isZoomed = isZoomed;
        ganttCtrl.isMasterMode = GanttOptionsService.isMasterMode;
        ganttCtrl.getTodayLineLeft = TimelineService.getTodayLineWidth;
        ganttCtrl.getCurrentBaselineName = GanttBaselinesService.getCurrentBaselineName;
        ganttCtrl.getProjectName = GanttOptionsService.getProjectName;
        ganttCtrl.leftBlockWidth = GanttOptionsService.LEFT_BLOCK_MIN_WIDTH;
        ganttCtrl.leftBlockMinWidth = GanttOptionsService.LEFT_BLOCK_MIN_WIDTH;
        ganttCtrl.leftBlockMaxWidth = GanttOptionsService.LEFT_BLOCK_MAX_WIDTH;
        ganttCtrl.onScroll = onScroll;
        ganttCtrl.scrollPosition = 0;

        $scope.$on('tasks-changed', TasksDataChangesHandler);
        $rootScope.$broadcast('notify-fade', 'Loading tasks ...', dataDefer.promise);

        $scope.$on('angular-resizable.resizing', function (event, info) {
            $scope.$apply(function () {
                ganttCtrl.leftBlockWidth = info.width;
            });
        });

        function onScroll(e) {
            ganttCtrl.scrollPositionLeft = e.target.scrollLeft;
            ganttCtrl.scrollPositionTop = e.target.scrollTop;
        }

        function TasksDataChangesHandler(){
            ganttCtrl.tasks = GanttTasksService.getAll();
            ganttCtrl.isEmpty = GanttTasksService.isEmpty();
            dataDefer.resolve();
        }

        function getZoom(){
            return GanttOptionsService.getZoom();
        }

        function isZoomed(){
            var zoom = GanttOptionsService.zoomOptions.getValue();
            return  100 < zoom;
        }
    }
})();