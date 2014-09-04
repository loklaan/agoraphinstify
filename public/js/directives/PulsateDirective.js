/**
 * Pulsate Animation
 *
 * Attribute
 */

(function(_) {

  var module = angular.module('AgoraApp');

  module.directive('pulsator', [
    '$animate',
  function($animate) {

    return {

      restrict: 'A',

      link: function(scope, element, attributes) {
        scope.$watch('pulseCounter', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            $animate.addClass(element, 'animate pulse', function() {
              $animate.removeClass(element, 'animate pulse');
            });
          }
        });
      }

    };

  }]);

})(_);