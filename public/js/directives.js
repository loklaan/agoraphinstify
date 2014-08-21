/**
 * Agorophinstify Directives module.
 */

(function() {

  var module = angular.module('AgoroApp.directives', []);

  module.directive('agoroLoading', ['$http', function($http){
    return {
      restrict: 'E',
      templateUrl: '/partials/loading',
      link: function($scope, elm, attrs) {
        $scope.isLoading = function() {
          return $http.pendingRequests.length > 0;
        };
        $scope.$watch($scope.isLoading, function(loading) {
          if (loading) {
            elm.removeClass('ng-hide');
          } else {
            elm.addClass('ng-hide');
          }
        });
      }
    };
  }]);

})();