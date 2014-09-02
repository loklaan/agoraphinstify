/**
 * Agoraphinstify EventMarkers Service module.
 */

(function() {

  var module = angular.module('AgoraApp');

  /**
   * Map Marker Service for updating a collection of markers.
   * @return {Object}  Exposes a single service property, markers
   *
   *     @markers  {object}
   *         Collection of marker objects
   */
  module.factory('EventMarkers', [
    '$rootScope',
  function($rootScope) {
    var _markers = {};

    // Eventful ng service will publish new event results
    $rootScope.$on('events:update', eventUpdateMarkers);

    /**
     * Callback function for events:update listener. Updates EventMarkers
     * with new eventful data. Broadcasts update of markers.
     * @param  {object} listenEvent Angular event listener object
     * @param  {array}  data        Array of events from Eventful
     */
    function eventUpdateMarkers(listenEvent, data) {
      _markers = {};
      _.forEach(data, function(event) {
        markerId = event.venue_name.replace(/\s|\W/g, '').toLowerCase();
        if (!angular.isDefined(_markers[markerId])) {
          _markers[markerId] = {
            lat: parseFloat(event.latitude),
            lng: parseFloat(event.longitude),
            draggable: false,
            message: event.venue_name + ': ',
            events: []
          };
        }
        _markers[markerId].events.push(event);
      });
      setMarkersPerformers(_markers);
      $rootScope.$broadcast('markers:update', _markers);
    }

    function setMarkersPerformers(markers) {
      _.forEach(markers, function(marker) {
          appendPerformers(marker);
      });
    }

    function appendPerformers(marker) {
      _.forEach(marker.events, function(event, index, events) {
        if (angular.isArray(event.performers.performer)) {
          _.forEach(event.performers.performer, function(performer) {
            marker.message += linkifyPerformer(performer, event) + ', ';
          });
        } else {
          marker.message += linkifyPerformer(event.performers.performer, event) + ', ';
        }

        // remove ', ' in last loop
        if (index >= events.length - 1) {
          marker.message = marker.message.slice(0, -2);
        }
      });
    }

    function linkifyPerformer(performer, event) {
      return '<a href="e/' + event.id.toLowerCase() + '/' + performer.id.toLowerCase() + '">' +
             performer.name + '</a>';
    }

    return {
      markers: function() {
        return _markers;
      }
    };
  }]);

})();