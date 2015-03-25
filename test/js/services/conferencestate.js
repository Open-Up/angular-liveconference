'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The ConferenceState module', function() {
  beforeEach(angular.mock.module('op.live-conference'));

  describe('ConferenceState service', function() {
    var ConferenceState, conference, conferenceState, $rootScope, apply, newImage;

    beforeEach(function() {
      apply = false;
      newImage = {};

      module(function ($provide) {
        $provide.value('newImage', function() {
          return newImage;
        });
      });

      inject(function($injector, _$rootScope_) {
        ConferenceState = $injector.get('ConferenceState');

        $rootScope = _$rootScope_;
        $rootScope.$applyAsync = function() { apply = true; };
      });

      conference = { name: 'name' };
      conferenceState = new ConferenceState(conference);
    });

    it('should store conference, attendees, localVideoId and videoIds', function() {
      expect(conferenceState.conference).to.deep.equal({ name: 'name' });
      expect(conferenceState.attendees).to.deep.equal([]);
      expect(conferenceState.localVideoId).to.equal('video-thumb0');
      expect(conferenceState.videoIds).to.deep.equal([
        'video-thumb0',
        'video-thumb1',
        'video-thumb2',
        'video-thumb3',
        'video-thumb4',
        'video-thumb5',
        'video-thumb6',
        'video-thumb7',
        'video-thumb8'
      ]);
    });

    describe('getAttendeeByEasyrtcid method', function() {
      it('should return the correct attendee', function() {
        conferenceState.attendees = [{ easyrtcid: 'easyrtcid' }, { easyrtcid: 'easyrtcid2' }, null];
        expect(conferenceState.getAttendeeByEasyrtcid('easyrtcid')).to.deep.equal({ easyrtcid: 'easyrtcid' });
        expect(conferenceState.getAttendeeByEasyrtcid('easyrtcid3')).to.be.null;
      });
    });

    describe('getAttendeeByVideoId method', function() {
      it('should return the correct attendee', function() {
        conferenceState.attendees = [{ videoId: 'video1' }, { videoId: 'video2' }, null];

        expect(conferenceState.getAttendeeByVideoId('video1')).to.deep.equal({ videoId: 'video1' });
        expect(conferenceState.getAttendeeByVideoId('idontexist')).to.be.null;
      });
    });

    describe('updateAttendee method', function() {
      it('should update the good attendee, $rootScope.$applyAsync() and $rootScope.$broadcast', function(done) {
        $rootScope.$on('conferencestate:attendees:update', function (event, attendee) {
          var expected = {
            easyrtcid: 'easyrtcid',
            id: 'id',
            displayName: 'displayName'
          };

          expect(attendee).to.deep.equal(expected);
          expect(conferenceState.attendees[0]).to.deep.equal(expected);
          expect(apply).to.be.true;

          done();
        });

        conferenceState.attendees = [{ easyrtcid: 'easyrtcid' }, { easyrtcid: 'easyrtcid2' }];
        conferenceState.updateAttendeeByEasyrtcid('easyrtcid', {
          id: 'id',
          displayName: 'displayName'
        });
      });
    });

    describe('updateAttendee method', function() {
      it('should $rootScope.$broadcast when the speaking property changes', function(done) {
        $rootScope.$on('conferencestate:speaking', function (event, attendee) {
          expect(attendee).to.deep.equal({
            id: 'easyrtcid',
            speaking: true
          });

          done();
        });

        conferenceState.pushAttendee(0, 'easyrtcid');
        conferenceState.updateAttendeeByEasyrtcid('easyrtcid', {
          easyrtcid: 'easyrtcid',
          speaking: true
        });
      });
    });

    describe('updateAttendee method', function() {
      it('should not $rootScope.$broadcast when the speaking property does not change', function(done) {
        $rootScope.$on('conferencestate:speaking', function () {
          done(new Error('This test should not call $rootScope.$broadcast(conferencestate:speaking)'));
        });

        conferenceState.attendees = [{
          easyrtcid: 'easyrtcid',
          speaking: true
        }];
        conferenceState.updateAttendeeByEasyrtcid('easyrtcid', {
          easyrtcid: 'easyrtcid',
          speaking: true
        });

        done();
      });
    });

    describe('updateAttendee method', function() {
      it('should $rootScope.$broadcast when the mute property changes', function(done) {
        $rootScope.$on('conferencestate:mute', function (event, attendee) {
          expect(attendee).to.deep.equal({
            id: 'easyrtcid',
            mute: true
          });

          done();
        });

        conferenceState.pushAttendee(0, 'easyrtcid');
        conferenceState.updateAttendeeByEasyrtcid('easyrtcid', {
          easyrtcid: 'easyrtcid',
          mute: true
        });
      });
    });

    describe('updateAttendee method', function() {
      it('should not $rootScope.$broadcast when the mute property does not change', function(done) {
        $rootScope.$on('conferencestate:mute', function () {
          done(new Error('This test should not call $rootScope.$broadcast(conferencestate:mute)'));
        });

        conferenceState.attendees = [{
          easyrtcid: 'easyrtcid',
          mute: true
        }];
        conferenceState.updateAttendeeByEasyrtcid('easyrtcid', {
          easyrtcid: 'easyrtcid',
          mute: true
        });

        done();
      });
    });

    describe('updateAttendee method', function() {
      it('should $rootScope.$broadcast when the muteVideo property changes', function(done) {
        $rootScope.$on('conferencestate:muteVideo', function (event, attendee) {
          expect(attendee).to.deep.equal({
            id: 'easyrtcid',
            muteVideo: true
          });

          done();
        });

        conferenceState.pushAttendee(0, 'easyrtcid');
        conferenceState.updateAttendeeByEasyrtcid('easyrtcid', {
          easyrtcid: 'easyrtcid',
          muteVideo: true
        });
      });
    });

    describe('updateAttendee method', function() {
      it('should not $rootScope.$broadcast when the muteVideo property does not change', function(done) {
        $rootScope.$on('conferencestate:muteVideo', function () {
          done(new Error('This test should not call $rootScope.$broadcast(conferencestate:muteVideo)'));
        });

        conferenceState.attendees = [{
          easyrtcid: 'easyrtcid',
          muteVideo: true
        }];
        conferenceState.updateAttendeeByEasyrtcid('easyrtcid', {
          easyrtcid: 'easyrtcid',
          muteVideo: true
        });

        done();
      });
    });

    describe('pushAttendee method', function() {
      it('should push the good attendee and $rootScope.$broadcast', function(done) {
        $rootScope.$on('conferencestate:attendees:push', function (event, attendee) {
          var expected = {
            index: 0,
            videoId: 'video-thumb0',
            easyrtcid: 'easyrtcid',
            id: 'id',
            displayName: 'displayName',
            avatar: '/images/avatar/default.png'
          };

          expect(attendee).to.deep.equal(expected);
          expect(conferenceState.attendees[0]).to.deep.equal(expected);
          done();
        });

        conferenceState.attendees = [];
        conferenceState.pushAttendee(0, 'easyrtcid', 'id', 'displayName');
      });
    });

    describe('removeAttendee method', function() {
      it('should remove the good attendee and $rootScope.$broadcast', function(done) {
        $rootScope.$on('conferencestate:attendees:remove', function (event, attendee) {
          expect(attendee).to.deep.equal({ easyrtcid: 'easyrtcid2' });
          expect(conferenceState.attendees[1]).to.be.null;
          done();
        });

        conferenceState.attendees = [{ easyrtcid: 'easyrtcid' }, { easyrtcid: 'easyrtcid2' }];
        conferenceState.removeAttendee(1);
      });
    });

    describe('updateLocalVideoId method', function() {
      it('should update local video id and $rootScope.$broadcast', function(done) {
        $rootScope.$on('conferencestate:localVideoId:update', function (event, videoid) {
          expect(videoid).to.deep.equal('newlocalvideo');
          expect(conferenceState.localVideoId).to.deep.equal('newlocalvideo');
          done();
        });

        conferenceState.updateLocalVideoId('newlocalvideo');
      });
    });

    describe('updateLocalVideoIdToIndex method', function() {
      it('should update local video id by index and $rootScope.$broadcast', function(done) {
        $rootScope.$on('conferencestate:localVideoId:update', function (event, videoid) {
          expect(videoid).to.deep.equal('video-thumb2');
          expect(conferenceState.localVideoId).to.deep.equal('video-thumb2');
          done();
        });

        conferenceState.updateLocalVideoIdToIndex(2);
      });
    });

    describe('updateSpeaking method', function() {
      it('should do nothing if the attendee is not found', function() {
        $rootScope.$on('conferencestate:speaking', function () {
          throw new Error('should not be here');
        });

        conferenceState.attendees.push({
          easyrtcid: 'easyrtcid',
          id: 'id',
          displayName: 'displayName'
        });
        conferenceState.updateSpeaking('easyrtcid2', true);
      });

      it('should update speaking,  $rootScope.$applyAsync and $rootScope.$broadcast', function(done) {
        $rootScope.$on('conferencestate:speaking', function (event, data) {
          expect(data).to.deep.equal({id: 'easyrtcid2', speaking: true});
          expect(conferenceState.attendees[1].speaking).to.be.true;
          done();
        });

        conferenceState.attendees.push({
          easyrtcid: 'easyrtcid',
          id: 'id',
          displayName: 'displayName'
        });
        conferenceState.attendees.push({
          easyrtcid: 'easyrtcid2',
          id: 'id2',
          displayName: 'displayName'
        });
        conferenceState.updateSpeaking('easyrtcid2', true);
      });
    });

    describe('updateMuteFromEasyrtcid method', function() {
      it('should update mute property of attendee and $rootScope.$broadcast', function(done) {
        $rootScope.$on('conferencestate:mute', function (event, data) {
          expect(data).to.deep.equal({id: 'easyrtcid', mute: true});
          expect(conferenceState.attendees).to.deep.equal([{ easyrtcid: 'easyrtcid', videoId: 'videoId', mute: true}]);
          done();
        });

        conferenceState.attendees = [{ easyrtcid: 'easyrtcid', videoId: 'videoId'}];
        conferenceState.updateMuteFromEasyrtcid('easyrtcid', true);
      });
    });

    describe('updateMuteFromIndex method', function() {
      it('should update mute property of attendee and $rootScope.$broadcast', function(done) {
        $rootScope.$on('conferencestate:mute', function (event, data) {
          expect(data).to.deep.equal({id: 'easyrtcid', mute: true});
          expect(conferenceState.attendees).to.deep.equal([{easyrtcid: 'user1'}, { easyrtcid: 'easyrtcid', videoId: 'videoId', mute: true}]);
          done();
        });

        conferenceState.attendees = [{easyrtcid: 'user1'}, { easyrtcid: 'easyrtcid', videoId: 'videoId'}];
        conferenceState.updateMuteFromIndex(1, true);
      });
    });

    describe('updateMuteVideoFromEasyrtcid method', function() {
      it('should update muteVideo property of attendee and $rootScope.$broadcast', function(done) {
        $rootScope.$on('conferencestate:muteVideo', function (event, data) {
          expect(data).to.deep.equal({id: 'easyrtcid', muteVideo: true});
          expect(conferenceState.attendees).to.deep.equal([{ easyrtcid: 'easyrtcid', videoId: 'videoId', muteVideo: true}]);
          done();
        });

        conferenceState.attendees = [{ easyrtcid: 'easyrtcid', videoId: 'videoId'}];
        conferenceState.updateMuteVideoFromEasyrtcid('easyrtcid', true);
      });
    });

    describe('updateMuteVideoFromIndex method', function() {
      it('should update muteVideo property of attendee and $rootScope.$broadcast', function(done) {
        $rootScope.$on('conferencestate:muteVideo', function (event, data) {
          expect(data).to.deep.equal({id: 'easyrtcid', muteVideo: true});
          expect(conferenceState.attendees).to.deep.equal([{easyrtcid: 'user1'}, { easyrtcid: 'easyrtcid', videoId: 'videoId', muteVideo: true}]);
          done();
        });

        conferenceState.attendees = [{easyrtcid: 'user1'}, { easyrtcid: 'easyrtcid', videoId: 'videoId'}];
        conferenceState.updateMuteVideoFromIndex(1, true);
      });
    });

    describe('getAvatarImageByIndex method', function() {

      it('should send back an error if attendee at given index does not exist', function(done) {
        conferenceState.getAvatarImageByIndex(0, function(err) {
          expect(err).to.exist;

          done();
        });
      });

      it('should send back the cached image if available', function(done) {
        conferenceState.avatarCache[0] = { image: 'loaded' };
        conferenceState.pushAttendee(0, 'easyrtcid');

        conferenceState.getAvatarImageByIndex(0, function(err, image) {
          expect(err).to.not.exist;
          expect(image).to.deep.equal({image: 'loaded' });

          expect(newImage).to.deep.equal({});

          done();
        });
      });

      it('should send back a new image when it is fully loaded', function(done) {
        conferenceState.pushAttendee(0, 'easyrtcid');

        conferenceState.getAvatarImageByIndex(0, function(err, image) {
          expect(err).to.not.exist;
          expect(image).to.exist;

          done();
        });
        newImage.onload();
      });

    });

  });

  describe('The newImage service', function() {

    var newImage;

    beforeEach(function() {
      inject(function($injector) {
        newImage = $injector.get('newImage');
      });
    });

    it('should return an instance of Image', function() {
      expect(newImage()).to.be.an.instanceof(Image);
    });

  });

  describe('easyRTCService service', function() {
    var service, $q, $rootScope, $log, tokenAPI, session, webrtcFactory;

    beforeEach(function() {
      tokenAPI = {};
      $log = {
        debug: function() {}
      };
      session = {
        getUsername: function() {
          return 'Wooot';
        },
        getUserId: function() {
          return 2;
        },
        user: {
          _id: 2,
          emails: ['test@openpaas.io']
        },
        domain: {
          _id: 123
        }
      };

      webrtcFactory = {
        get: function() {
          return {
            setRoomOccupantListener: function() {},
            setRoomEntryListener: function() {},
            setDisconnectListener: function() {},
            joinRoom: function() {},
            easyApp: function() {},
            hangupAll: function() {},
            setOnCall: function() {},
            setOnHangup: function() {},
            useThisSocketConnection: function() {},
            enableDataChannels: function() {},
            setPeerListener: function() {}
          };
        }
      };

      var ioSocketConnection = {
        isConnected: function() {
          return true;
        },
        getSio: function() {
          return this.sio;
        },
        addConnectCallback: function(callback) {
          this.connectCallback = callback;
        },
        addDisconnectCallback: function() {}
      };
      this.ioSocketConnection = ioSocketConnection;

      var ioConnectionManager = {
      };
      this.ioConnectionManager = ioConnectionManager;

      module(function($provide) {
        $provide.value('$log', $log);
        $provide.value('tokenAPI', tokenAPI);
        $provide.value('session', session);
        $provide.value('webrtcFactory', webrtcFactory);
        $provide.value('ioSocketConnection', ioSocketConnection);
        $provide.value('ioConnectionManager', ioConnectionManager);
      });
    });

    it('$scope.performCall should hangupAll', function(done) {
      webrtcFactory = {
        get: function() {
          return {
            hangupAll: function() {
              done();
            },
            enableDataChannels: function() {},
            setPeerListener: function() {}
          };
        }
      };

      module(function($provide) {
        $provide.value('webrtcFactory', webrtcFactory);
      });

      inject(function($injector) {
        service = $injector.get('easyRTCService');
      });

      service.performCall('YOLO');
    });

    it('$scope.performCall should call the given user id', function(done) {
      var user_id = 123;

      webrtcFactory = {
        get: function() {
          return {
            hangupAll: function() {},
            call: function(id) {
              expect(id).to.equal(user_id);
              done();
            },
            enableDataChannels: function() {},
            setPeerListener: function() {}
          };

        }
      };

      module(function($provide) {
        $provide.value('webrtcFactory', webrtcFactory);
      });

      inject(function($injector) {
        service = $injector.get('easyRTCService');
      });

      service.performCall(user_id);
    });

    it('$scope.connect should create the easyRTC app when the socketIO connection becomes available', function(done) {
      this.ioSocketConnection.sio = {};
      this.ioSocketConnection.isConnected = function() {
        return false;
      };

      webrtcFactory = {
        get: function() {
          return {
            setRoomOccupantListener: function() {},
            setRoomEntryListener: function() {},
            setDisconnectListener: function() {},
            joinRoom: function() {},
            useThisSocketConnection: function() {},
            easyApp: function() {
              done();
            },
            enableDataChannels: function() {},
            setPeerListener: function() {}
          };
        }
      };

      module(function($provide) {
        $provide.value('webrtcFactory', webrtcFactory);
      });

      inject(function($injector, _$q_, _$rootScope_) {
        service = $injector.get('easyRTCService');
        $q = _$q_;
        $rootScope = _$rootScope_;
      });

      var conferenceState = {
        conference: {
          conference: { _id: 123 }
        },
        pushAttendee: function() {},
        removeAttendee: function() {}
      };
      service.connect(conferenceState);
      expect(this.ioSocketConnection.connectCallback).to.be.a('function');
      this.ioSocketConnection.connectCallback();
    });

    it('$scope.connect should give the socketIO instance to easyrtc', function(done) {
      var self = this;
      this.ioSocketConnection.isConnected = function() {
        return true;
      };
      this.ioSocketConnection.sio = {websocket: true};

      webrtcFactory = {
        get: function() {
          return {
            setRoomOccupantListener: function() {},
            setRoomEntryListener: function() {},
            setDisconnectListener: function() {},
            joinRoom: function() {},
            useThisSocketConnection: function(sio) {
              expect(sio).to.deep.equal(self.ioSocketConnection.sio);
              done();
            },
            easyApp: function() {
            },
            enableDataChannels: function() {},
            setPeerListener: function() {}
          };
        }
      };

      module(function($provide) {
        $provide.value('webrtcFactory', webrtcFactory);
      });

      inject(function($injector, _$q_, _$rootScope_) {
        service = $injector.get('easyRTCService');
        $q = _$q_;
        $rootScope = _$rootScope_;
      });

      var conferenceState = {
        conference: {
          conference: { _id: 123 }
        },
        pushAttendee: function() {},
        removeAttendee: function() {}
      };
      service.connect(conferenceState);
    });

    it('$scope.connect should create the easyRTC app if the socketIO connection is available', function(done) {
      var self = this;
      this.ioSocketConnection.sio = {};
      this.ioSocketConnection.isConnected = function() {
        self.ioSocketConnection.addConnectCallback = function(cb) {
          return done(new Error('I should not be called ' + cb));
        };
        return true;
      };

      webrtcFactory = {
        get: function() {
          return {
            setRoomOccupantListener: function() {},
            setRoomEntryListener: function() {},
            setDisconnectListener: function() {},
            joinRoom: function() {},
            useThisSocketConnection: function() {},
            easyApp: function() {
              done();
            },
            enableDataChannels: function() {},
            setPeerListener: function() {}
          };
        }
      };

      module(function($provide) {
        $provide.value('webrtcFactory', webrtcFactory);
      });

      inject(function($injector, _$q_, _$rootScope_) {
        service = $injector.get('easyRTCService');
        $q = _$q_;
        $rootScope = _$rootScope_;
      });

      var conferenceState = {
        conference: {
          conference: { _id: 123 }
        },
        pushAttendee: function() {},
        removeAttendee: function() {}
      };
      service.connect(conferenceState);
      expect(this.ioSocketConnection.connectCallback).to.be.a('function');
      this.ioSocketConnection.connectCallback();
    });
  });

  describe('cropDimensions services', function() {
    beforeEach(function() {
      var self = this;
      inject(function(cropDimensions) {
        self.service = cropDimensions;
      });
    });

    it('should return a function', function() {
      expect(this.service).to.be.a('function');
    });
    describe('when video width is greater than video height', function() {
      it('should send an sx > 0, an sy=0', function() {
        var result = [100, 0, 200];
        var dimensions = this.service(100, 100, 400, 200);
        expect(dimensions).to.be.an('array');
        expect(dimensions).to.deep.equal(result);
      });
    });
    describe('when video height is greater than video width', function() {
      it('should send an sy > 0, an sx=0', function() {
        var result = [0, 100, 200];
        var dimensions = this.service(100, 100, 200, 400);
        expect(dimensions).to.be.an('array');
        expect(dimensions).to.deep.equal(result);
      });
    });
    describe('when video height equals video width', function() {
      it('should send an sy=0, an sx=0', function() {
        var result = [0, 0, 200];
        var dimensions = this.service(100, 100, 200, 200);
        expect(dimensions).to.be.an('array');
        expect(dimensions).to.deep.equal(result);
      });
    });
  });

  describe('drawVideo service', function() {

    beforeEach(function() {
      module(function ($provide) {
        $provide.value('drawAvatarIfVideoMuted', function() {});
      });
    });

    it('should return a function', function() {
      inject(function(drawVideo) {
        var test = drawVideo();
        expect(test).to.be.a('function');
      });
    });
    it('should call $interval.cancel() when executing function', function(done) {
      module(function($provide) {
        function intervalMock() {
          return 'identifier';
        }

        intervalMock.cancel = function(id) {
          expect(id).to.equal('identifier');
          done();
        };

        $provide.value('$interval', intervalMock);
      });
      inject(function(drawVideo) {
        var test = drawVideo();
        test();
      });
    });
  });
});
