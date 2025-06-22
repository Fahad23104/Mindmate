// src/BackgroundMusic.js
import React, { useEffect, useRef } from 'react';
import calmTrack from './assets/calm.mp3';

const BackgroundMusic = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.2;
    audio.play().catch(() => { /* Autoplay prevented */ });
  }, []);

  return <audio ref={audioRef} src={calmTrack} loop />;
};

export default BackgroundMusic;
