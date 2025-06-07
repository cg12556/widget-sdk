# Happeo Audio Player Widget

A React-based audio player widget for Happeo channels that allows users to upload and play audio files.

## Features

- **File Upload**: Drag and drop or click to upload audio files (MP3, WAV, OGG, M4A)
- **Audio Playback**: Built-in audio player with play/pause, progress bar, and time display
- **Permission-based Access**: Upload and delete permissions based on user roles
- **Responsive Design**: Works on desktop and mobile devices
- **File Management**: View file details, upload date, and file size
- **Real-time Updates**: Changes are saved and synced across the channel

## Supported Audio Formats

- MP3
- WAV
- OGG
- M4A
- Maximum file size: 50MB

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

The widget automatically initializes when loaded in a Happeo channel. Users with upload permissions can:

1. **Upload Files**: Drag and drop audio files or click the upload area
2. **Play Audio**: Click the play button on any uploaded audio file
3. **Control Playback**: Use the progress bar to seek, view current time and duration
4. **Delete Files**: Remove uploaded files (if permissions allow)

## Widget SDK Integration

This widget uses the Happeo Widget SDK for:

- User authentication and context
- File upload functionality
- Content persistence
- Analytics tracking

## Development

The widget is built with:

- React 18 with TypeScript
- Vite for development and building
- Lucide React for icons
- Custom CSS for styling

## File Structure

```
src/
├── components/
│   ├── AudioUploader.tsx    # File upload component
│   ├── AudioPlayer.tsx      # Individual audio player
│   └── AudioList.tsx        # List of audio files
├── hooks/
│   └── useAudioPlayer.ts    # Audio player state management
├── types.ts                 # TypeScript interfaces
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css               # Global styles
```

## Permissions

The widget supports role-based permissions:

- **Upload Permission**: Allows users to upload new audio files
- **Delete Permission**: Allows users to delete existing audio files
- **Read-only Access**: Users can only play existing audio files

## Browser Compatibility

The widget supports all modern browsers that support:

- HTML5 Audio API
- File API
- Drag and Drop API
- ES2020+ JavaScript features