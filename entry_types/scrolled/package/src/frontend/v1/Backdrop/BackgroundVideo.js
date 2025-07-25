import React, { useEffect } from 'react';

import {VideoPlayer} from './../../VideoPlayer';
import {MotifArea} from './../MotifArea';
import {usePlayerState} from './../../MediaPlayer/usePlayerState';
import {useSectionLifecycle} from './../../useSectionLifecycle';
import {Effects} from './Effects';
import {documentHiddenState} from 'pageflow/frontend';
import {PlayerEventContextDataProvider} from '../../useEventContextData';

export function BackgroundVideo({video, onMotifAreaUpdate, containerDimension}) {
  const [playerState, playerActions] = usePlayerState();
  const {shouldLoad, shouldPrepare} = useSectionLifecycle({
    onVisible() {
      playerActions.changeVolumeFactor(0, 0);
      playerActions.play()
    },

    onActivate() {
      playerActions.changeVolumeFactor(1, 1000);
    },

    onDeactivate() {
      playerActions.changeVolumeFactor(0, 1000);
    },

    onInvisible() {
      playerActions.pause()
    }
  });

  useEffect(() => {
    let documentState = documentHiddenState((visibilityState) => {
      if (visibilityState === 'hidden') {
        playerActions.pause();
      }
      else{
        playerActions.play();
      }
    });
    return () => {
      documentState.removeCallback();
    }
  }, [playerActions])

  return (
    <>
      <Effects file={video}>
        <PlayerEventContextDataProvider playerDescription="Backdrop Video"
                                        playbackMode="loop">
          <VideoPlayer load={shouldPrepare ? 'auto' :
                             shouldLoad ? 'poster' :
                             'none'}
                       playerState={playerState}
                       playerActions={playerActions}
                       videoFile={video}
                       textTracksDisabled={true}
                       adaptiveMinQuality="high"
                       fit="cover"
                       loop={true}
                       playsInline={true} />
        </PlayerEventContextDataProvider>
      </Effects>
      <MotifArea key={video.permaId}
                 onUpdate={onMotifAreaUpdate}
                 file={video}
                 containerWidth={containerDimension.width}
                 containerHeight={containerDimension.height}/>
    </>
  );
}
