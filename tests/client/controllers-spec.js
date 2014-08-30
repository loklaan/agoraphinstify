describe('AgoraApp controllers', function() {

  describe('MapController', function() {
    var scope, rootScope, ctrl, leaflet, Event, EventReq;

    beforeEach(module('AgoraApp'));

    beforeEach(inject(function($controller, _$rootScope_, leafletData) {
      scope = {};
      rootScope = _$rootScope_;
      Event = {
        startGet: function(req) {
          EventReq = req;
        }
      };
      spyOn(Event, 'startGet');
      ctrl = $controller('MapController', {$scope:scope, Eventful: Event});
      leaflet = leafletData;
    }));

    it('should create a default map values', function() {
      expect(scope.default).toBeDefined();
      expect(scope.center).toBeDefined();
      expect(scope.tiles).toBeDefined();
      expect(scope.markers).toBeDefined();
    });

    it('should update markers on markers:update event', function() {
      rootScope.$broadcast('markers:update', {this: 1});
      expect(scope.markers.this).toBe(1);
    });

    it('should update map on scope.center change', function() {
      var newCenter = {zoom: 14, lat: 51.505, lng: -0.09};
      scope.center = newCenter;
      var mapCenter;
      leaflet.getMap().then(function(map) {
        mapCenter = map.getCenter();
        expect(mapCenter.lat).toBe(scope.center.lat);
        scope.center.lat = 55;
        mapCenter = map.getCenter();
        expect(mapCenter.lat).toBe(scope.center.lat);
      });
    });

    // not showing in coverage report
    it('should call for eventful data on map scrub', function() {
      var newCenter = {zoom: 14, lat: 40, lng: 2};
      scope.center = newCenter;
      leaflet.getMap().then(function(map) {
        map.fireEvent('moveend');
        expect(Event.startGet).toHaveBeenCalled();
        expect(EventReq.where).toBe(scope.center.lat + ',' + scope.center.lng);
      });
    });

  });

});