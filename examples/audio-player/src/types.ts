export interface AudioFile {
  id: string;
  name: string;
  url: string;
  duration?: number;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
}

export interface AudioPlayerState {
  currentAudio: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export interface WidgetPermissions {
  canUpload: boolean;
  canDelete: boolean;
}