/**
 * Agoraphinstify Events Service module.
 */

(function() {

  var module = angular.module('AgoraApp');

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
  module.factory('Events', [
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
          page_size: 20
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
            $rootScope.$emit('events:update', _searchResults);

            getNextEventsPage(params, currentReq);
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
     * for Agoraphinstify.
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

})();
