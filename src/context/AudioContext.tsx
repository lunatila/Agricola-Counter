import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Platform } from 'react-native';
import { useAudioPlayer, AudioSource } from 'expo-audio';

// All tracks must be required statically — the React Native bundler cannot
// resolve dynamic require() calls.
const TRACKS: AudioSource[] = [
  require('../../assets/music/track1.mp3') as AudioSource,
  require('../../assets/music/track2.mp3') as AudioSource,
];

interface AudioContextData {
  isMuted: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextData>({} as AudioContextData);

// ---------------------------------------------------------------------------
// Web stub — audio is disabled on web for performance and to avoid browser
// autoplay-policy errors.
// ---------------------------------------------------------------------------
const WebAudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AudioContext.Provider value={{ isMuted: true, toggleMute: () => {} }}>
    {children}
  </AudioContext.Provider>
);

// ---------------------------------------------------------------------------
// Native audio provider — full track-looping implementation.
// ---------------------------------------------------------------------------
const NativeAudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true); // Music temporarily disabled
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const isInitialMount = useRef(true);

  const player = useAudioPlayer(TRACKS[0]);

  // Start playback on mount and clean up on unmount.
  useEffect(() => {
    player.volume = 1.0;
    // player.play(); // Music temporarily disabled
    return () => { player.remove(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load and play the new track whenever the index advances.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const playNextTrack = async () => {
      try {
        await player.replace(TRACKS[currentTrackIndex]);
        if (!isMuted) await player.play();
      } catch (error) {
        console.error('Error playing next track:', error);
      }
    };

    playNextTrack();
  }, [currentTrackIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll playback status to advance to the next track when one finishes.
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const status = await player.currentStatus;
        if (status && !status.playing && status.currentTime >= status.duration - 0.5) {
          setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
        }
      } catch {
        // Ignore transient errors during status polling.
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTrackIndex, isMuted]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMute = () => {
    try {
      if (isMuted) {
        player.play();
      } else {
        player.pause();
      }
      setIsMuted((prev) => !prev);
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

// ---------------------------------------------------------------------------
// Public export — selects the right implementation by platform.
// ---------------------------------------------------------------------------
export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) =>
  Platform.OS === 'web' ? (
    <WebAudioProvider>{children}</WebAudioProvider>
  ) : (
    <NativeAudioProvider>{children}</NativeAudioProvider>
  );

export const useAudio = (): AudioContextData => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
