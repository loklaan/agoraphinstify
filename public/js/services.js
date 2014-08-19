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
   * Eventful API
   */

   module.factory('EventSearch', ['$resource', function($resource){
    return $resource(api.eventful.url + '/events/search', {}, {
      get: {
        method: 'GET',
        params: {
          category: 'music',
          units: 'km',
          page_size: 100
        }
      }
    });
  }]);

})();