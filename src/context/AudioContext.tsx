import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';

interface AudioContextData {
  isMuted: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextData>({} as AudioContextData);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const player = useAudioPlayer(require('../../assets/music/agricola.mp3') as AudioSource);

  useEffect(() => {
    // Start playing on mount
    player.loop = true;
    player.volume = 1.0;
    player.play();

    return () => {
      // Cleanup on unmount
      player.remove();
    };
  }, []);

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
