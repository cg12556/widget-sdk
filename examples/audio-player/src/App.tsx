import React, { useState, useEffect } from 'react';
import widgetSDK from '@happeo/widget-sdk';
import AudioUploader from './components/AudioUploader';
import AudioList from './components/AudioList';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { AudioFile, WidgetPermissions } from './types';

const App: React.FC = () => {
  const [widgetApi, setWidgetApi] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<WidgetPermissions>({
    canUpload: false,
    canDelete: false,
  });

  const { playerState, play, pause, updateTime, stop } = useAudioPlayer();

  // Initialize widget SDK
  useEffect(() => {
    const initWidget = async () => {
      try {
        const uniqueId = 'audio-player-widget-' + Math.random().toString(36).substr(2, 9);
        const api = await widgetSDK.api.init(uniqueId);
        const currentUser = await api.getCurrentUser();
        const context = await api.getContext();
        
        setWidgetApi(api);
        setUser(currentUser);
        
        // Determine permissions based on context
        // In a real implementation, you'd check user roles/permissions
        const canUpload = true; // For demo purposes
        const canDelete = true; // For demo purposes
        
        setPermissions({ canUpload, canDelete });
        
        // Load existing audio files
        await loadAudioFiles(api);
        
      } catch (err) {
        console.error('Failed to initialize widget:', err);
        setError('Failed to initialize widget');
      } finally {
        setIsLoading(false);
      }
    };

    initWidget();
  }, []);

  const loadAudioFiles = async (api: any) => {
    try {
      const content = await api.getContent();
      const files = content.content ? JSON.parse(content.content) : [];
      setAudioFiles(files);
    } catch (err) {
      console.error('Failed to load audio files:', err);
      setAudioFiles([]);
    }
  };

  const saveAudioFiles = async (files: AudioFile[]) => {
    if (!widgetApi) return;
    
    try {
      await widgetApi.setContent(JSON.stringify(files));
    } catch (err) {
      console.error('Failed to save audio files:', err);
      throw err;
    }
  };

  const handleUpload = async (files: File[]) => {
    if (!widgetApi || !user) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const uploadPromises = files.map(async (file) => {
        // Upload file using widget SDK
        const uploadResult = await widgetApi.uploadImage({
          files: [file],
          startUpload: (entry: any) => {
            console.log('Upload started:', entry);
          },
          updateUploadProgress: (entry: any) => {
            console.log('Upload progress:', entry.uploadProgress);
          },
          onUploadError: (id: string, error: Error) => {
            console.error('Upload error:', error);
            throw error;
          },
        });

        // Create audio file object
        const audioFile: AudioFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: uploadResult.url || URL.createObjectURL(file), // Fallback for demo
          size: file.size,
          uploadedBy: user.name.fullName,
          uploadedAt: new Date().toISOString(),
        };

        return audioFile;
      });

      const newAudioFiles = await Promise.all(uploadPromises);
      const updatedFiles = [...audioFiles, ...newAudioFiles];
      
      setAudioFiles(updatedFiles);
      await saveAudioFiles(updatedFiles);
      
      setSuccess(`Successfully uploaded ${newAudioFiles.length} audio file(s)`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload audio files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (audioId: string) => {
    if (!widgetApi) return;

    try {
      // Stop playback if this audio is currently playing
      if (playerState.currentAudio === audioId) {
        stop();
      }

      const updatedFiles = audioFiles.filter(file => file.id !== audioId);
      setAudioFiles(updatedFiles);
      await saveAudioFiles(updatedFiles);
      
      setSuccess('Audio file deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete audio file. Please try again.');
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  if (isLoading) {
    return (
      <div className="audio-player-widget">
        <div className="widget-header">
          <h1 className="widget-title">Audio Player</h1>
          <p className="widget-subtitle">Channel Audio Library</p>
        </div>
        <div className="loading">
          <div style={{ marginRight: '12px' }}>Loading...</div>
          <div style={{ width: 20, height: 20, border: '2px solid #667eea', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="audio-player-widget">
      <div className="widget-header">
        <h1 className="widget-title">Audio Player</h1>
        <p className="widget-subtitle">Channel Audio Library</p>
      </div>

      <div className="widget-content">
        {error && (
          <div className="error\" onClick={clearMessages} style={{ cursor: 'pointer' }}>
            {error}
          </div>
        )}
        
        {success && (
          <div className="success" onClick={clearMessages} style={{ cursor: 'pointer' }}>
            {success}
          </div>
        )}

        <AudioUploader
          onUpload={handleUpload}
          isUploading={isUploading}
          canUpload={permissions.canUpload}
        />

        <AudioList
          audioFiles={audioFiles}
          playerState={playerState}
          onPlay={play}
          onPause={pause}
          onTimeUpdate={updateTime}
          onDelete={permissions.canDelete ? handleDelete : undefined}
          canDelete={permissions.canDelete}
        />
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;