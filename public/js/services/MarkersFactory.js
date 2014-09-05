/**
 * Map Marker Service for Agoraphinstify Map.
 *
 * Responsible for updating Map Markers. Subscriber to
 * Events service. Publishes to markers.
 * See Factory Public Functions for more.
 */

(function() {

  var module = angular.module('AgoraApp');

  module.factory('EventMarkers', [
    '$rootScope',
  function($rootScope) {

/* ==========================================================================
   Factory Variables
   ========================================================================== */

    var _markers = {};


/* ==========================================================================
   Factory Publish Functions
   ========================================================================== */

    // Eventful ng service will publish new event results
    $rootScope.$on('events:update', updateMarkers);

    /**
     * Publishes new Markers to subscribers.
     */
    function publishMarkers() {
      $rootScope.$broadcast('markers:update', _markers);
    }

    /**
     * Callback function for events:update listener. Updates Markers.
     * with new eventful data.
     *
     * @param  {object} listenEvent Angular event listener object
     * @param  {array}  data        Array of events from Eventful
     */
    function updateMarkers(listenEvent, data) {
      _markers = {};
      _.forEach(data, function(event) {
        markerId = event.venue_name.replace(/\s|\W/g, '').toLowerCase();
        if (!angular.isDefined(_markers[markerId])) {
          _markers[markerId] = {
            lat: parseFloat(event.latitude),
            lng: parseFloat(event.longitude),
            draggable: false,
            message: '<strong>' + event.venue_name + '</strong>' + ': ',
            events: []
          };
        }
        _markers[markerId].events.push(event);
      });
      setMarkersMessages(_markers);
      publishMarkers();
    }


/* ==========================================================================
   Factory Private Functions
   ========================================================================== */

    function setMarkersMessages(markers) {
      _.forEach(markers, function(marker) {
          appendPerformers(marker);
      });
    }

    function appendPerformers(marker) {
      _.forEach(marker.events, function(event, index, events) {
        if (angular.isArray(event.performers.performer)) {
          _.forEach(event.performers.performer, function(performer) {
            marker.message += linkifyPerformerName(performer, event) + ', ';
          });
        } else {
          marker.message += linkifyPerformerName(event.performers.performer, event) + ', ';
        }

        // remove ', ' in last loop
        if (index >= events.length - 1) {
          marker.message = marker.message.slice(0, -2);
        }
      });
    }

    function linkifyPerformerName(performer, event) {
      return '<a href="event/' + event.id.toLowerCase() + '/artist/' + performer.id.toLowerCase() + '">' +
        performer.name + '</a>';
    }


    return {
      markers: function() {
        return _markers;
      }
    };
  }]);

})();