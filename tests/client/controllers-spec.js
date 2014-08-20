describe('AgoroApp controllers', function() {

  describe('MapController', function() {
    var scope, ctrl;

    beforeEach(module('AgoroApp'));

    beforeEach(inject(function($controller) {
      scope = {};
      ctrl = $controller('MapController', {$scope:scope});
    }));

    it('should create a false default.zoomControl', function() {
      expect(scope.default.zoomControl).toBe(false);
    });

  });

});