/**
 * Agorophinstify Services module.
 */

(function() {

  var module = angular.module('AgoroApp.services', [
    'ngResource'
    ]);

  var api = {
    eventful: {
      url: '/api/eventful'
    }
  };

  /**
   * Eventful API Service (via proxy API).
   * @return {object}  Exposes two service properties, startGet and results.
   *
   *   @results  {array}
   *       Collection of events as described by Eventful
   *
   *   @startGet {function}
   *       Starts querying all 'pages' for a given set of Eventful parameters
   */
  module.factory('Eventful', [
    '$resource',
    '$rootScope',
  function($resource, $rootScope){
    var _searchResults, _pages, _page, _request = {id: 0};
    resetState();

    var EventSearch = $resource(api.eventful.url + '/events/search', {}, {
      get: {
        method: 'GET',
        params: {
          category: 'music',
          units: 'km',
          page_size: 100
        }
      }
    });

    function getEvents(params, currentReq) {
      EventSearch.get(params,
        function(results) {
          if (currentReq !== _request.id) {
            // drops this request if a newer request chain is active
            return;
          } else if (results.events === null) {
            if (_request.timeout >= 5) {
              return;
            }
            // repeat query if eventful returns with no events
            _request.timeout++;
            getEvents(params, currentReq);
          } else {
            _request.timeout = 0;
            _pages = parseInt(results.page_count);
            _page = parseInt(results.page_number);
            _searchResults = _searchResults.concat(filterForPerformers(results));
            $rootScope.$emit('eventful:update', _searchResults);

            getNextEventsPage(params);
          }
        }, function(reason) {
          console.error(reason);
          return; // TODO recover from ajax fail
        });
    }

    function getNextEventsPage(params, currentReq) {
      if (_pages > 0 && _page <= _pages) {
        params.page_number = _page + 1;
        getEvents(params, currentReq);
      } else {
        return;
      }
    }

    /**
     * Starts getting Eventful data from with new api parameters.
     * @param  {object} params Eventful API parameters
     */
    function getNewEvents(params) {
      // incase this is called more than once, the latest
      // Eventful params are stored
      _request.queue.push(params);
      status.request = true;

      // only the latest call to this method will start querying for pages
      var latestParams = _request.queue[_request.queue.length - 1];
      if (params === latestParams) {
        resetState();
        getEvents(latestParams, ++_request.id);
      }
    }

    /**
     * Resets the current state of the Eventful service.
     */
    function resetState() {
      _searchResults = [];
      _pages = 0;
      _page = 0;
      _request.queue = [];
      _request.timeout = 0;
    }

    /**
     * Removes Eventful entries that do not have enough information.
     * for Agorophinstify.
     * @param  {array} results Array of single events from Eventful
     * @return {array}         New array of filtered events from Eventful
     */
    function filterForPerformers(events) {
      return events.events.event.filter(function(event) {
        return (event.performers && event.performers.performer);
      });
    }

    // see Service comments
    return {
      startGet: getNewEvents,
      results: _searchResults
    };
  }]);

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
    $rootScope.$on('eventful:update', eventUpdateMarkers);

    /**
     * Callback function for eventful:update listener. Updates EventMarkers
     * with new eventful data. Broadcasts update of markers.
     * @param  {object} listenEvent Angular event listener object
     * @param  {array}  data        Array of events from Eventful
     */
    function eventUpdateMarkers(listenEvent, data) {
      _markers = {};
      data.forEach(function(event) {
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
      for (var marker in markers) {
        if (markers.hasOwnProperty(marker)) {
          appendPerformers(markers[marker]);
        }
      }
    }

    function appendPerformers(marker) {
      marker.events.forEach(function(event, index, events) {
        if (angular.isArray(event.performers.performer)) {
          event.performers.performer.forEach(function(performer) {
            marker.message += performer.name + ', ';
          });
        } else {
          marker.message += event.performers.performer.name + ', ';
        }

        // remove ', ' in last loop
        if (index >= events.length - 1) {
          marker.message = marker.message.slice(0, -2);
        }
      });
    }

    return {
      markers: _markers
    };
  }]);

})();
