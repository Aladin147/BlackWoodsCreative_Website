'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { useDeviceAdaptation } from './useDeviceAdaptation';

interface AudioConfig {
  volume: number;
  enabled: boolean;
  respectUserPreferences: boolean;
  fadeInDuration: number;
  fadeOutDuration: number;
}

interface SoundEffect {
  id: string;
  url: string;
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

interface AudioContextState {
  context: AudioContext | null;
  isSupported: boolean;
  isEnabled: boolean;
  masterVolume: number;
}

const defaultConfig: AudioConfig = {
  volume: 0.3,
  enabled: true,
  respectUserPreferences: true,
  fadeInDuration: 500,
  fadeOutDuration: 300
};

// Predefined sound effects for common interactions
// Note: Audio files are optional - system gracefully handles missing files
const defaultSoundEffects: SoundEffect[] = [
  {
    id: 'hover',
    url: '/audio/hover.mp3',
    volume: 0.2,
    preload: false // Disabled preload to prevent 404 errors
  },
  {
    id: 'click',
    url: '/audio/click.mp3',
    volume: 0.3,
    preload: false // Disabled preload to prevent 404 errors
  },
  {
    id: 'magnetic',
    url: '/audio/magnetic.mp3',
    volume: 0.15,
    preload: false // Disabled preload to prevent 404 errors
  },
  {
    id: 'transition',
    url: '/audio/transition.mp3',
    volume: 0.25,
    preload: false // Disabled preload to prevent 404 errors
  },
  {
    id: 'ambient',
    url: '/audio/ambient.mp3',
    volume: 0.1,
    loop: true,
    preload: false // Disabled preload to prevent 404 errors
  }
];

export function useAudioSystem(config: Partial<AudioConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };
  const [audioState, setAudioState] = useState<AudioContextState>({
    context: null,
    isSupported: false,
    isEnabled: false,
    masterVolume: finalConfig.volume
  });

  const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const activeSourcesRef = useRef<Map<string, AudioBufferSourceNode>>(new Map());
  const gainNodeRef = useRef<GainNode | null>(null);
  const { deviceInfo } = useDeviceAdaptation();

  // Initialize audio context
  const initAudioContext = useCallback(async () => {
    if (typeof window === 'undefined') return;

    // Check user preferences
    if (finalConfig.respectUserPreferences) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setAudioState(prev => ({ ...prev, isEnabled: false }));
        return;
      }
    }

    // Check if audio is supported
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      setAudioState(prev => ({ ...prev, isSupported: false }));
      return;
    }

    try {
      const context = new AudioContextClass();
      const gainNode = context.createGain();
      gainNode.connect(context.destination);
      gainNode.gain.value = finalConfig.volume;

      gainNodeRef.current = gainNode;

      setAudioState({
        context,
        isSupported: true,
        isEnabled: finalConfig.enabled,
        masterVolume: finalConfig.volume
      });

      // Resume context on user interaction (required by browsers)
      const resumeContext = async () => {
        if (context.state === 'suspended') {
          await context.resume();
        }
      };

      document.addEventListener('click', resumeContext, { once: true });
      document.addEventListener('touchstart', resumeContext, { once: true });

    } catch (error) {
      console.warn('Failed to initialize audio context:', error);
      setAudioState(prev => ({ ...prev, isSupported: false }));
    }
  }, [finalConfig]);

  // Load audio buffer with graceful error handling
  const loadAudioBuffer = useCallback(async (soundEffect: SoundEffect): Promise<AudioBuffer | null> => {
    if (!audioState.context || !audioState.isSupported) return null;

    try {
      const response = await fetch(soundEffect.url);
      if (!response.ok) {
        // Gracefully handle missing audio files
        console.info(`Audio file not found: ${soundEffect.url} - continuing without audio`);
        return null;
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioState.context.decodeAudioData(arrayBuffer);

      audioBuffersRef.current.set(soundEffect.id, audioBuffer);
      return audioBuffer;
    } catch (error) {
      // Gracefully handle audio loading errors
      console.info(`Audio system: ${soundEffect.url} not available - continuing without audio`);
      return null;
    }
  }, [audioState.context, audioState.isSupported]);

  // Preload sound effects
  const preloadSounds = useCallback(async (soundEffects: SoundEffect[] = defaultSoundEffects) => {
    if (!audioState.isSupported || !audioState.isEnabled) return;

    const preloadPromises = soundEffects
      .filter(effect => effect.preload)
      .map(effect => loadAudioBuffer(effect));

    await Promise.allSettled(preloadPromises);
  }, [audioState.isSupported, audioState.isEnabled, loadAudioBuffer]);

  // Play sound effect
  const playSound = useCallback(async (
    soundId: string, 
    options: { 
      volume?: number; 
      loop?: boolean; 
      fadeIn?: boolean;
      delay?: number;
    } = {}
  ) => {
    if (!audioState.context || !audioState.isEnabled || !gainNodeRef.current) return;

    // Don't play sounds on mobile to preserve battery
    if (deviceInfo.isMobile) return;

    let audioBuffer = audioBuffersRef.current.get(soundId);
    
    // Load buffer if not cached
    if (!audioBuffer) {
      const soundEffect = defaultSoundEffects.find(effect => effect.id === soundId);
      if (soundEffect) {
        audioBuffer = await loadAudioBuffer(soundEffect);
      }
    }

    if (!audioBuffer) return;

    try {
      // Stop existing sound if playing
      const existingSource = activeSourcesRef.current.get(soundId);
      if (existingSource) {
        existingSource.stop();
        activeSourcesRef.current.delete(soundId);
      }

      // Create new source
      const source = audioState.context.createBufferSource();
      const gainNode = audioState.context.createGain();
      
      source.buffer = audioBuffer;
      source.loop = options.loop || false;
      
      // Set up audio graph
      source.connect(gainNode);
      gainNode.connect(gainNodeRef.current);
      
      // Set volume
      const soundEffect = defaultSoundEffects.find(effect => effect.id === soundId);
      const baseVolume = options.volume ?? soundEffect?.volume ?? 0.5;
      const finalVolume = baseVolume * audioState.masterVolume;
      
      if (options.fadeIn) {
        gainNode.gain.setValueAtTime(0, audioState.context.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          finalVolume, 
          audioState.context.currentTime + finalConfig.fadeInDuration / 1000
        );
      } else {
        gainNode.gain.value = finalVolume;
      }

      // Start playback
      const startTime = audioState.context.currentTime + (options.delay || 0) / 1000;
      source.start(startTime);
      
      activeSourcesRef.current.set(soundId, source);

      // Clean up when finished
      source.onended = () => {
        activeSourcesRef.current.delete(soundId);
      };

    } catch (error) {
      console.warn(`Failed to play sound: ${soundId}`, error);
    }
  }, [audioState, deviceInfo.isMobile, loadAudioBuffer, finalConfig.fadeInDuration]);

  // Stop sound effect
  const stopSound = useCallback((soundId: string, fadeOut: boolean = true) => {
    const source = activeSourcesRef.current.get(soundId);
    if (!source || !audioState.context) return;

    if (fadeOut && gainNodeRef.current) {
      const gainNode = audioState.context.createGain();
      gainNode.gain.setValueAtTime(gainNode.gain.value, audioState.context.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0, 
        audioState.context.currentTime + finalConfig.fadeOutDuration / 1000
      );
      
      setTimeout(() => {
        source.stop();
        activeSourcesRef.current.delete(soundId);
      }, finalConfig.fadeOutDuration);
    } else {
      source.stop();
      activeSourcesRef.current.delete(soundId);
    }
  }, [audioState.context, finalConfig.fadeOutDuration]);

  // Set master volume
  const setMasterVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.max(0, Math.min(1, volume));
      setAudioState(prev => ({ ...prev, masterVolume: volume }));
    }
  }, []);

  // Toggle audio system
  const toggleAudio = useCallback(() => {
    setAudioState(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
  }, []);

  // Initialize on mount
  useEffect(() => {
    initAudioContext();
  }, [initAudioContext]);

  // Preload sounds when audio is enabled
  useEffect(() => {
    if (audioState.isEnabled && audioState.isSupported) {
      preloadSounds();
    }
  }, [audioState.isEnabled, audioState.isSupported, preloadSounds]);

  return {
    audioState,
    playSound,
    stopSound,
    setMasterVolume,
    toggleAudio,
    preloadSounds,
    isReady: audioState.isSupported && audioState.isEnabled
  };
}

// Hook for common UI sound effects
export function useUISounds() {
  const { playSound, isReady } = useAudioSystem();

  const playHoverSound = useCallback(() => {
    if (isReady) playSound('hover');
  }, [playSound, isReady]);

  const playClickSound = useCallback(() => {
    if (isReady) playSound('click');
  }, [playSound, isReady]);

  const playMagneticSound = useCallback(() => {
    if (isReady) playSound('magnetic', { volume: 0.1 });
  }, [playSound, isReady]);

  const playTransitionSound = useCallback(() => {
    if (isReady) playSound('transition', { fadeIn: true });
  }, [playSound, isReady]);

  return {
    playHoverSound,
    playClickSound,
    playMagneticSound,
    playTransitionSound,
    isReady
  };
}

// Audio control component
export function AudioControls({
  className = '',
  showVolumeSlider = true
}: {
  className?: string;
  showVolumeSlider?: boolean;
}) {
  const { audioState, setMasterVolume, toggleAudio } = useAudioSystem();

  if (!audioState.isSupported) return null;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleAudio}
        className="p-2 rounded-full transition-colors duration-300 bg-gray-800 text-white hover:bg-gray-700"
        title={audioState.isEnabled ? 'Disable audio' : 'Enable audio'}
      >
        {audioState.isEnabled ? '🔊' : '🔇'}
      </button>

      {showVolumeSlider && audioState.isEnabled && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={audioState.masterVolume}
          onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
          className="w-20"
          title="Volume"
        />
      )}
    </div>
  );
}
