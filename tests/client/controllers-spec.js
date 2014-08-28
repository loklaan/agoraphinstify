describe('AgoroApp controllers', function() {

  describe('MapController', function() {
    var scope, ctrl;

    beforeEach(module('AgoroApp'));

    beforeEach(inject(function($controller) {
      scope = {};
      ctrl = $controller('MapController', {$scope:scope});
    }));

    // FIX: high maintenance test
    it('should create a default map values', function() {
      expect(scope.default).toBeDefined();
      expect(scope.center).toBeDefined();
      expect(scope.tiles).toBeDefined();
      expect(scope.markers).toBeDefined();
    });

    xit('should update markers on markers:update event', function() {
    });

  });

});