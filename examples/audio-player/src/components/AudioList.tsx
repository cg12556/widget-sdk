import React from 'react';
import { Music } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import { AudioFile, AudioPlayerState } from '../types';

interface AudioListProps {
  audioFiles: AudioFile[];
  playerState: AudioPlayerState;
  onPlay: (id: string) => void;
  onPause: () => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onDelete?: (id: string) => void;
  canDelete: boolean;
}

const AudioList: React.FC<AudioListProps> = ({
  audioFiles,
  playerState,
  onPlay,
  onPause,
  onTimeUpdate,
  onDelete,
  canDelete
}) => {
  if (audioFiles.length === 0) {
    return (
      <div className="empty-state">
        <Music size={64} className="empty-icon" />
        <div style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No audio files yet</div>
        <div style={{ fontSize: '0.9rem' }}>Upload some audio files to get started</div>
      </div>
    );
  }

  return (
    <div className="audio-list">
      {audioFiles.map((audioFile) => (
        <AudioPlayer
          key={audioFile.id}
          audioFile={audioFile}
          playerState={playerState}
          onPlay={onPlay}
          onPause={onPause}
          onTimeUpdate={onTimeUpdate}
          onDelete={onDelete}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
};

export default AudioList;