/**
 * Spotify API Service (via proxy API)
 *
 * Responsible for getting track information of a particular Artist.
 * See Factory Public Functions for more.
 */

(function(_) {

  var module = angular.module('AgoraApp');

  module.factory('Music', [
    '$rootScope',
    '$resource',
    '$timeout',
    'ngAudio',
    'GeoIP',
  function($rootScope, $resource, $timeout, ngAudio, GeoIP) {

/* ==========================================================================
   Factory Variables
   ========================================================================== */

    var API = '/api/spotify',
        AUDIO_EVENTS = {
          end: 'ended'
        };

    var MusicFactory = {},
        _tracks = {},
        _country_code;


/* ==========================================================================
   Factory Public Functions
   ========================================================================== */

    // Query spotify for artist. Get their tracks, sorting from most popular
    // and then instantiate first (couple) tracks in a ngAudioObject
    MusicFactory.queueNewArtist = function(artistName) {
      resetState();
      ArtistSearch.get({
        // TODO: May need to parse for symbols > html hex codes
        q: artistName
      },
      // Success API call
      function(searchData) {
        while (GeoIP.getCountryCode() === null) {
          $timeout(200);
        }
        ArtistTopTracks.get({
          id: searchData.artists.items[0].id,
          country: _country_code
        },
        // Success API call
        function(tracksData) {
          _tracks.queued = tracksData.tracks;
          _tracks.current = _tracks.queued.pop();
        },
        // Failed API call
        function(reason) {
          console.error(reason);
        }
        );
      },
      // Failed API call
      function(reason) {
        console.error(reason);
      });
    };

    // Play queued ngAudioObject
    MusicFactory.play = function() {
      if (angular.isUndefined(_tracks.current.audio)) {
        _tracks.current.audio = ngAudio.play(_tracks.current.preview_url);
      }

      // attachListeners(_tracks.current.audio, AUDIO_EVENTS.end, this.next);
      // _tracks.current.audio.play();

      // Publish to track info listeners
      $rootScope.$broadcast('music:newtrack', _tracks.current);
    };

    // Pause queued ngAudioObject
    MusicFactory.pause = function() {
      _tracks.current.audio.pause();
    };

    MusicFactory.paused = function() {
      return _tracks.current.audio.paused();
    };

    // Next queued ngAudioObject
    MusicFactory.next = function() {
      detachListeners(_tracks.current.audio, AUDIO_EVENTS.end);
      _tracks.current.audio.stop();

      _tracks.queued.unshift(_tracks.current);
      _tracks.current = _tracks.queued.pop();

      this.play();
    };

    // Previous queued ngAudioObject
    MusicFactory.back = function() {
      detachListeners(_tracks.current.audio, AUDIO_EVENTS.end);
      _tracks.current.audio.stop();

      _tracks.queued.push(_tracks.current);
      _tracks.current = _tracks.queued.shift();

      this.play();
    };


/* ==========================================================================
   Factory Private Functions
   ========================================================================== */

    function attachListeners(audio, event, callback) {
      audio.audio.addEventListener(event, callback);
    }

    function detachListeners(audio, event) {
      audio.audio.removeEventListener(event);
    }

    $rootScope.$on('geoip:new', function(event, geoip) {
      _country_code = geoip.country_code;
    });


/* ==========================================================================
   REST Client Functions
   ========================================================================== */

    var ArtistSearch = $resource(API + '/search', {},
      {
        get: {
          method: 'GET',
          params: {
            type: 'artist'
          }
        }
      });

    var ArtistTopTracks = $resource(API + '/artists/:id/top-tracks', {},
      {
        get: {
          method: 'GET'
        }
      });

/* ==========================================================================
   Utility Functions
   ========================================================================== */

    function getCountryCode() {
      return GeoIP.getCountryCode();
    }

    function resetState() {
      _tracks = {
        current: null,
        queued: []
      };
    }


    return MusicFactory;

  }]);

})(_);