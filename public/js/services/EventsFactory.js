/**
 * Eventful API Service (via proxy API).
 *
 * Responsible for getting data about Events surrounding
 * a location. See Factory Public Functions for more.
 */

(function() {

  var module = angular.module('AgoraApp');

  module.factory('Events', [
    '$resource',
    '$rootScope',
  function($resource, $rootScope) {

/* ==========================================================================
   Factory Variables
   ========================================================================== */

    var API = '/api/eventful';

    var EventsFactory = {},
        _events,
        _pages,
        _request = {
          id: 0,
          queue: []
        };

/* ==========================================================================
   Factory Public Functions
   ========================================================================== */

    /**
     * Starts getting Eventful data. Chain of queries will continue
     * until there are no pages left or stopGet() is called.
     *
     * @param  {object} params  Eventful API parameters
     */
    EventsFactory.startGet = function(params) {
      // Incase this is called more than once, the latest
      // Eventful params are stored
      _request.queue.push(params);
      status.request = true;

      // Only the latest call to this method will start querying for pages
      var latestParams = _request.queue[_request.queue.length - 1];
      if (params === latestParams) {
        resetState();
        getEvents(latestParams, ++_request.id);
      }
    };

    /**
     * Stops active queries from finishing and breaks the query
     * chain from continuing.
     */
    EventsFactory.stopGet = function() {
      _request.id++;
    };

    /**
     * Get a single Event from Eventful. Callback for success will
     * have query results in first argument.
     *
     * @param  {string}   eventId          Eventful Event ID
     * @param  {function} successCallback  Callback on successful query
     */
    EventsFactory.getEvent = function(eventId, successCallback) {
      SingleEvent.get({
        id: eventId
      },
      successCallback,
      // Failed API call
      function(reason) {
        console.error(reason);
      });
    };

    /**
     * Get a seng Performer from Eventful. Callback for success will
     * have query results in first aurgument.
     *
     * @param  {string}   performerId     Eventful Performer ID
     * @param  {function} successCallback Callback on successful query
     */
    EventsFactory.getPerformer = function(performerId, successCallback) {
      SinglePerformer.get({
        id: performerId
      },
      // Success API call
      successCallback,
      // Failed API call
      function(reason) {
        console.error(reason);
      }
      );
    };


/* ==========================================================================
   Factory Private Functions
   ========================================================================== */

    /**
     * Recursive function that gets new Events and updates
     * the Services events data.
     *
     * @param  {object} params      Eventful API parameters
     * @param  {Number} currentReq  Request instance id of the Service
     */
    function getEvents(params, currentReq) {
      EventSearch.get(params,
        // Success API call
        function(results) {

          if (currentReq !== _request.id) {

            // New or stopRequest() called
            return;

          } else if (results.events === null) {

            // Repeat after bad query response or timeout
            if (_request.timeout >= 5) {
              return;
            } else {
              _request.timeout++;
              getEvents(params, currentReq);
            }

          } else {
            // Reset timeout
            _request.timeout = 0;

            // Eventful sometimes discovers for events in later pages
            _pages.total = parseInt(results.page_count);
            _pages.current = parseInt(results.page_number);
            _events = _events.concat(filterForPerformers(results));

            // Publish new events to subscribers
            $rootScope.$emit('events:update', _events);

            // Continues
            getNextEvents(params, currentReq);
          }
        },
        // Failed API call
        function(reason) {
          console.error(reason);
          return;
        }
      );
    }

    /**
     * Continues query chain if their are available pages.
     *
     * @param  {object} params      Eventful API parameters
     * @param  {Number} currentReq  Request instance id of the Service
     */
    function getNextEvents(params, currentReq) {
      if (_pages.total > 0 && _pages.current <= _pages.total) {
        params.page_number = _pages.current + 1;
        getEvents(params, currentReq);
      } else {
        return;
      }
    }

    /**
     * Removes Eventful entries that do not have enough information.
     * for the Service.
     *
     * @param  {array} results Array of single events from Eventful
     * @return {array}         New array of filtered events from Eventful
     */
    function filterForPerformers(events) {
      return events.events.event.filter(function(event) {
        return (event.performers && event.performers.performer);
      });
    }


/* ==========================================================================
   REST Client Functions
   ========================================================================== */

    var EventSearch = $resource(API + '/events/search', {}, {
      get: {
        method: 'GET',
        params: {
          category: 'music',
          units: 'km',
          page_size: 20
        }
      }
    });

    var SingleEvent = $resource(API + '/events/get', {}, {
      get: {
        method: 'GET'
      }
    });

    var SinglePerformer= $resource(API + '/performers/get', {}, {
      get: {
        method: 'GET'
      }
    });

/* ==========================================================================
   Utility Functions
   ========================================================================== */

    function resetState() {
      _events = [];
      _pages = {
        total: 0,
        current: 0
      };
      _request.queue = [];
      _request.timeout = 0;
    }


    return EventsFactory;
  }]);

})();
