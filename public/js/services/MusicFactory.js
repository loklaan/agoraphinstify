/**
 * Spotify API Service (via proxy API)
 *
 * Responsible for getting track information of a particular Artist
 * and playing preview mp3's.
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
        _country_code = null;
        _blocked_queue = null;


/* ==========================================================================
   Factory Public Functions
   ========================================================================== */

    /**
     * Starts a new track queue for a particular artist. Tracks are
     * orded by popularity, limited to 10. Tracks are managed on a stack.
     *
     * @param  {string} artistName Name of artist
     */
    MusicFactory.queueNewArtist = function(artistName) {
      resetState();
      searchArtistId(artistName, queueTopTracks);
    };

    /**
     * Plays the next Audio object on the tracks queue stack. Will create
     * a new Audio object from a Spotify preview mp3 if no Audio is cached.
     *
     * Information about the playing track will be published to listeners.
     */
    MusicFactory.play = function() {
      if (angular.isUndefined(_tracks.current.audio)) {
        _tracks.current.audio = ngAudio.play(_tracks.current.preview_url);

        $timeout(function() {
          return angular.isUndefined(_tracks.current.audio.audio);
        }, 2000)
        .then(function() {
          attachListeners(_tracks.current.audio, AUDIO_EVENTS.end, MusicFactory.next);
        });
      } else {
        _tracks.current.audio.play();
      }

      // Publish to track info listeners
      $rootScope.$broadcast('music:playing', _tracks.current);
    };

    /**
     * Pauses the current Audio object on tracks queue stack.
     */
    MusicFactory.pause = function() {
      if (angular.isDefined(_tracks.current.audio)) {
        _tracks.current.audio.pause();
        $rootScope.$broadcast('music:paused');
      }
    };

    /**
     * Check if current Audio object is paused.
     */
    MusicFactory.paused = function() {
      if (angular.isDefined(_tracks.current.audio)) {
        return _tracks.current.audio.paused();
      } else {
        // No audio.. Yeah, it is paused! >_>
        return false;
      }
    };

    /**
     * Plays the next Audio object on tracks queue stack. Presently
     * playing Audio gets shifted to bottom of queue.
     */
    MusicFactory.next = function() {
      if (angular.isDefined(_tracks.current.audio)) {
        stopTrack(_tracks.current.audio);

        _tracks.queued.unshift(_tracks.current);
        _tracks.current = _tracks.queued.pop();

        $rootScope.$broadcast('music:newtrack', _tracks.current);
        MusicFactory.play();
      }
    };

    /**
     * Plays the previous Audio object on tracks queue stack. Presently
     * playing Audio gets pushed to top of queue.
     */
    MusicFactory.back = function() {
      if (angular.isDefined(_tracks.current.audio)) {
        stopTrack(_tracks.current.audio);

        _tracks.queued.push(_tracks.current);
        _tracks.current = _tracks.queued.shift();

        $rootScope.$broadcast('music:newtrack', _tracks.current);
        MusicFactory.play();
      }
    };


/* ==========================================================================
   Factory Private Functions
   ========================================================================== */

    /**
     * Searchs Spotify for an Artist ID from an Artists name. Callbacks
     * first paramter is the Artist ID.
     *
     * @param  {string}   artistName  Name of the artist
     * @param  {Function} callback    Callback
     */
    function searchArtistId(artistName, callback) {
      ArtistSearch.get({
          q: artistName
        },
        // Success API call
        function(searchData) {
          // Skim for the first artist
          callback(searchData.artists.items[0].id);
        },
        // Failed API call
        function(reason) {
          console.error(reason);
        }
      );
    }

    /**
     * Gets the TopTracks of an artist and queues on a new
     * tracks queue stack.
     *
     * @param  {string} artistId Spotify Artist ID
     */
    function queueTopTracks(artistId) {
      if (_country_code === null) {
        _blocked_queue = artistId;
      } else {
        ArtistTopTracks.get({
            id: artistId,
            country: _country_code
          },
          // Success API call
          function(tracksData) {
            // skim first tracks artists uri
            _tracks.uri = tracksData.tracks[0].artists[0].uri;
            $rootScope.$broadcast('music:newuri', _tracks.uri);

            _tracks.queued = tracksData.tracks;
            _tracks.current = _tracks.queued.pop();
            $rootScope.$broadcast('music:newtrack', _tracks.current);
          },
          // Failed API call
          function(reason) {
            console.error(reason);
          }
        );
      }
    }

    function stopTrack(track) {
      detachListeners(track, AUDIO_EVENTS.end);
      track.stop();
      $rootScope.$broadcast('music:paused');
    }

    function attachListeners(audio, event, callback) {
      audio.audio.addEventListener(event, callback);
    }

    function detachListeners(audio, event) {
      audio.audio.removeEventListener(event);
    }

    $rootScope.$on('geoip:new', function(event, geoip) {
      _country_code = geoip.country_code;
      if (_blocked_queue !== null) {
        queueTopTracks(_blocked_queue);
        _blocked_queue = null;
      }
    });


/* ==========================================================================
   REST Client Functions
   ========================================================================== */

    var ArtistSearch = $resource(API + '/search', {}, {
      get: {
        method: 'GET',
        params: {
          type: 'artist'
        }
      }
    });

    var ArtistTopTracks = $resource(API + '/artists/:id/top-tracks', {}, {
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
        queued: [],
        uri: ''
      };
    }


    return MusicFactory;

  }]);

})(_);