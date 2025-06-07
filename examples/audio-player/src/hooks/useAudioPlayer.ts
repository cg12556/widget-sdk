import { useState, useCallback } from 'react';
import { AudioPlayerState } from '../types';

export const useAudioPlayer = () => {
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    currentAudio: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  const play = useCallback((audioId: string) => {
    setPlayerState(prev => ({
      ...prev,
      currentAudio: audioId,
      isPlaying: true,
    }));
  }, []);

  const pause = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  const updateTime = useCallback((currentTime: number, duration: number) => {
    setPlayerState(prev => ({
      ...prev,
      currentTime,
      duration,
    }));
  }, []);

  const stop = useCallback(() => {
    setPlayerState({
      currentAudio: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    });
  }, []);

  return {
    playerState,
    play,
    pause,
    updateTime,
    stop,
  };
};