'use strict';

angular.module('PReports.directives').directive('popoverHoverable', ['$timeout', '$document', function ($timeout, $document) {
    return {
        restrict: 'A',
        scope: {
            popoverHoverable: '=',
            popoverIsOpen: '='
        },
        link: function(scope, element, attrs) {
            scope.insidePopover = false;

            scope.$watch('insidePopover', function (insidePopover) {
                togglePopover(insidePopover);
            })

            scope.$watch('popoverIsOpen', function (popoverIsOpen) {
                scope.insidePopover = popoverIsOpen;
            })

            function togglePopover (isInsidePopover) {
                $timeout.cancel(togglePopover.$timer);
                togglePopover.$timer = $timeout(function () {
                    if (isInsidePopover) {
                        showPopover();
                    } else {
                        hidePopover();
                    }
                }, 100)
            }

            function showPopover () {
                if (scope.popoverIsOpen) {
                    return;
                }
                
               $(element[0]).click();
            }

            function hidePopover () {
                scope.popoverIsOpen = false;
            }

            $(document).bind('mouseover', function (e) {
                var target = e.target;
                if (inside(target)) {
                    scope.insidePopover = true;
                    scope.$digest();
                }
            });

            $(document).bind('mouseout', function (e) {
                var target = e.target;
                if (inside(target)) {
                    scope.insidePopover = false;
                    scope.$digest();
                }
            });

            scope.$on('$destroy', function () {
                $(document).unbind('mouseenter');
                $(document).unbind('mouseout');
            })

            function inside (target) {
                return insideTrigger(target) || insidePopover(target);
            }

            function insideTrigger (target) {
                return element[0].contains(target);
            }

            function insidePopover (target) {
                var isIn = false;
                var popovers = $('.popover-inner');
                for (var i = 0, len = popovers.length; i < len; i++) {
                    if (popovers[i].contains(target)) {
                        isIn = true;
                        break;
                    }
                }
                return isIn;
            }
        }
    }
}]);