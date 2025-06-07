import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Trash2 } from 'lucide-react';
import { AudioFile, AudioPlayerState } from '../types';

interface AudioPlayerProps {
  audioFile: AudioFile;
  playerState: AudioPlayerState;
  onPlay: (id: string) => void;
  onPause: () => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onDelete?: (id: string) => void;
  canDelete: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioFile,
  playerState,
  onPlay,
  onPause,
  onTimeUpdate,
  onDelete,
  canDelete
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const isCurrentAudio = playerState.currentAudio === audioFile.id;
  const isPlaying = isCurrentAudio && playerState.isPlaying;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (isCurrentAudio) {
        onTimeUpdate(audio.currentTime, audio.duration || 0);
      }
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => setIsLoading(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [isCurrentAudio, onTimeUpdate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isCurrentAudio && playerState.isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isCurrentAudio, playerState.isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay(audioFile.id);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !isCurrentAudio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * audio.duration;
    
    audio.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const currentTime = isCurrentAudio ? playerState.currentTime : 0;
  const duration = isCurrentAudio ? playerState.duration : audioFile.duration || 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-item">
      <audio ref={audioRef} src={audioFile.url} preload="metadata" />
      
      <div className="audio-header">
        <div>
          <div className="audio-title">{audioFile.name}</div>
          <div className="audio-meta">
            Uploaded by {audioFile.uploadedBy} • {formatFileSize(audioFile.size)} • {new Date(audioFile.uploadedAt).toLocaleDateString()}
          </div>
        </div>
        
        {canDelete && onDelete && (
          <button
            className="delete-button"
            onClick={() => onDelete(audioFile.id)}
            title="Delete audio file"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="audio-controls">
        <button
          className="play-button"
          onClick={handlePlayPause}
          disabled={isLoading}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <div style={{ width: 16, height: 16, border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play size={16} />
          )}
        </button>

        <div className="progress-container" onClick={handleProgressClick}>
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;