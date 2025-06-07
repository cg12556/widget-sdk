import React, { useRef, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface AudioUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  isUploading: boolean;
  canUpload: boolean;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onUpload, isUploading, canUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || !canUpload) return;

    const audioFiles = Array.from(files).filter(file => {
      const isAudio = file.type.startsWith('audio/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      
      if (!isAudio) {
        setError('Please select only audio files');
        return false;
      }
      
      if (!isValidSize) {
        setError('File size must be less than 50MB');
        return false;
      }
      
      return true;
    });

    if (audioFiles.length > 0) {
      setError(null);
      onUpload(audioFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    if (canUpload && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  if (!canUpload) {
    return (
      <div className="upload-section" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
        <AlertCircle size={48} className="upload-icon" />
        <div className="upload-text">Upload not available</div>
        <div className="upload-hint">You don't have permission to upload files</div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      
      <div
        className={`upload-section ${isDragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        style={{ 
          cursor: isUploading ? 'not-allowed' : 'pointer',
          opacity: isUploading ? 0.6 : 1 
        }}
      >
        <Upload size={48} className="upload-icon" />
        <div className="upload-text">
          {isUploading ? 'Uploading...' : 'Upload Audio Files'}
        </div>
        <div className="upload-hint">
          Drag and drop audio files here, or click to browse
          <br />
          Supported formats: MP3, WAV, OGG, M4A (Max 50MB)
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="file-input"
          accept="audio/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={isUploading}
        />
      </div>
    </>
  );
};

export default AudioUploader;