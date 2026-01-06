import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';

// Import all track files statically (required by React Native bundler)
const track1 = require('../../assets/music/track1.mp3') as AudioSource;
const track2 = require('../../assets/music/track2.mp3') as AudioSource;
// Add more tracks here as needed:
// const track3 = require('../../assets/music/track3.mp3') as AudioSource;
// const track4 = require('../../assets/music/track4.mp3') as AudioSource;

// Array of all tracks to play in sequence
const TRACKS: AudioSource[] = [
  track1,
  track2,
  // Add more tracks here:
  // track3,
  // track4,
];

interface AudioContextData {
  isMuted: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextData>({} as AudioContextData);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const isInitialMount = React.useRef(true);

  const player = useAudioPlayer(TRACKS[0]);

  useEffect(() => {
    if (TRACKS.length === 0) {
      console.error('No tracks found!');
      return;
    }

    // Start playing on mount
    player.volume = 1.0;
    player.play();

    return () => {
      // Cleanup on unmount
      player.remove();
    };
  }, []);

  // Effect to handle track changes
  useEffect(() => {
    if (TRACKS.length === 0) return;

    // Skip on initial mount (first track is already loaded)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const playNextTrack = async () => {
      try {
        // Replace the current audio source
        await player.replace(TRACKS[currentTrackIndex]);

        // Only play if not muted
        if (!isMuted) {
          await player.play();
        }
      } catch (error) {
        console.error('Error playing next track:', error);
      }
    };

    playNextTrack();
  }, [currentTrackIndex]);

  // Monitor playback and switch tracks when current one ends
  useEffect(() => {
    if (TRACKS.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const status = await player.currentStatus;

        // Check if track has finished playing
        if (status && !status.playing && status.currentTime >= status.duration - 0.5) {
          // Move to next track
          const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
          setCurrentTrackIndex(nextIndex);
        }
      } catch (error) {
        // Ignore errors during status check
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [currentTrackIndex, isMuted]);

  const toggleMute = () => {
    try {
      if (isMuted) {
        player.play();
      } else {
        player.pause();
      }
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Error toggling sound:', error);
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
