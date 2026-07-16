import {events} from '../events';
import {throttle} from '../utils/throttle';

export const mediaEvents = function(player, context) {

  player.updateMediaEventsContext = function (newContext) {
    context = newContext;
  }

  player.triggerMediaAllocate = function() {
    if (context) {
      events.trigger('media:allocate', {
        ...mediaEventPayload(),
        element: player.getMediaElement()
      });
    }
  }

  player.triggerMediaRelease = function() {
    if (context) {
      events.trigger('media:release', {
        ...mediaEventPayload(),
        element: player.getMediaElement()
      });
    }
  }

  player.on('play', function() {
    triggerMediaEvent('play');
  });

  player.on('seeking', function() {
    triggerMediaEvent('seeking');
  });

  player.on('seeked', function() {
    triggerMediaEvent('seeked');
  });

  player.on('timeupdate', function() {
    triggerMediaEvent('timeupdate');
  });

  player.on('timeupdate', throttle(function() {
    triggerMediaEvent('timeupdate_throttled');
  }, 5000));

  player.on('pause', function() {
    triggerMediaEvent('pause');
  });

  player.on('ended', function() {
    triggerMediaEvent('ended');
  });

  function triggerMediaEvent(name) {
    if (context) {
      events.trigger('media:' + name, mediaEventPayload());
    }
  }

  function mediaEventPayload() {
    return {
      fileName: player.previousSrc || player.currentSrc(),
      context: context,
      currentTime: player.currentTime(),
      duration: player.duration(),
      volume: player.volume(),
      altText: player.getMediaElement().getAttribute('alt'),
      bitrate: 3500000
    };
  }
};
