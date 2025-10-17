"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Rewind, FastForward, Volume2, VolumeX} from "lucide-react";

export default function Home() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [lastVolume, setLastVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [isVolumeVisible, setIsVolumeVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    
    const audioRef = useRef(null);
    const isSeeking = useRef(false);
    const hideTimer = useRef<number | null>(null);

    const volumePercentage = volume * 100;

    const volumeBackground = `linear-gradient(to right, #be2929 ${volumePercentage}%, #262728 ${volumePercentage}%)`;
    const progressBackground = `linear-gradient(to right, #1a54d4 ${progress}%, #262728 ${progress}%)`;

    useEffect(() => {
        setIsPlaying(false);
        setVolume(0.5);
        setIsVolumeVisible(false);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        const setAudioData = () => {
            setDuration(audio.duration);
        }

        if (audio.readyState > 0) {
            setAudioData();
        } else {
            audio.addEventListener('loadedmetadata', setAudioData);
        }

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
        }
    }, []);

    useEffect(() => {
        if (!isSeeking.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`; 
    }

    const toggleMute = () => {
        if (isMuted) {
            setIsMuted(false);
            setVolume(lastVolume);
        } else {
            setIsMuted(true);
            setLastVolume(volume);
            setVolume(0);
        }
    }

    const handleTimeUpdate = () => {
        if (!isSeeking.current && audioRef.current.duration) {
            setCurrentTime(audioRef.current.currentTime);
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
    }
    
    const handleSeekMouseDown = () => {
        isSeeking.current = true;
        audioRef.current.pause();
    }

    const handleSeekMouseUp = (e) => {
        const newProgress = parseFloat(e.target.value);
        if (duration) {
            audioRef.current.currentTime = (newProgress / 100) * duration;
        }
        isSeeking.current = false;

        if (isPlaying) {
            audioRef.current.play();
        }
    }

    const handleProgressChange = (e) => {
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);

        if (duration) {
            setCurrentTime((newProgress / 100) * duration);
        }
    }

    const handleMouseEnter = () => {
        if (hideTimer.current) {
            window.clearTimeout(hideTimer.current);
        }
        setIsVolumeVisible(true);
    };

    const handleMouseLeave = () => {
        hideTimer.current = window.setTimeout(() => {
            setIsVolumeVisible(false);
        }, 300);
    };
 
    return (
        <>         
            <audio 
                ref={audioRef}
                src="/musica.mp3"
                onTimeUpdate={handleTimeUpdate}
            />

            <div className="w-screen h-screen bg-[#222] flex justify-center items-center text-white box-border">
                <div className="w-[340px] h-[500px] bg-[#333] rounded-lg p-[60px]">
                    <div className="h-[70%] flex flex-col justify-center items-center">
                        <div className="w-full">
                            <img src="img/capa.jpg" alt="Capa do album" className="w-full" />
                        </div>
                        <div className="text-center">
                            <h4 className="font-bold">Please Please Me</h4>
                            <p className="text-sm">The Beatles</p>
                        </div>
                    </div>

                    <div className="h-[30%] flex flex-col items-center">
                        <div className="w-full mt-[25px]">
                            <input 
                                type="range" 
                                min="0"
                                max="100"
                                value={progress}
                                onMouseDown={handleSeekMouseDown}
                                onMouseUp={handleSeekMouseUp}
                                onChange={handleProgressChange}
                                style={{ background: progressBackground }}
                                className={`
                                    w-full h-[5px] appearance-none cursor-pointer
                                    
                                    [&::-webkit-slider-thumb]:appearance-none
                                    [&::-webkit-slider-thumb]:h-3
                                    [&::-webkit-slider-thumb]:w-3
                                    [&::-webkit-slider-thumb]:bg-white
                                    [&::-webkit-slider-thumb]:rounded-full
                                    [&::-webkit-slider-thumb]:border-0

                                    [&::-moz-range-thumb]:appearance-none
                                    [&::-moz-range-thumb]:h-3
                                    [&::-moz-range-thumb]:w-3
                                    [&::-moz-range-thumb]:bg-white
                                    [&::-moz-range-thumb]:rounded-full
                                    [&::-moz-range-thumb]:border-0
                                `}
                            />
                            <div className="flex mt-[-5px] justify-between text-[0.95rem] text-[#717577]">
                                <p>{ formatTime(currentTime) }</p>
                                <p>{ formatTime(duration) }</p>
                            </div>
                        </div>

                        <div className="flex w-[calc(100%-6px)] mt-5 justify-between">
                            <button className="cursor-pointer"> <Rewind/> </button>
                            <button onClick={() => setIsPlaying(!isPlaying)} className="bg-[#be2929] w-10 h-10 rounded-full cursor-pointer flex justify-center items-center">
                                {isPlaying ? <Pause/> : <Play/>}
                            </button>
                            <button className="cursor-pointer"> <FastForward/> </button>

                            <div 
                                className="relative flex items-center" 
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button onClick={toggleMute} className="cursor-pointer">
                                    {isMuted || volume === 0 ? <VolumeX/> : <Volume2/>}
                                </button>

                                {isVolumeVisible && (
                                    <div className="absolute right-0 bottom-full mb-2 bg-[#444] p-2 rounded">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={(e) => {
                                                const newVolume = parseFloat(e.target.value);
                                                setVolume(newVolume);
                                                if (newVolume > 0) {
                                                    setIsMuted(false);
                                                }
                                            }}
                                            style={{ background: volumeBackground}}
                                            className={`
                                                w-24 h-[5px] bg-[#262728] appearance-none cursor-pointer

                                                [&::-webkit-slider-thumb]:appearance-none
                                                [&::-webkit-slider-thumb]:h-3
                                                [&::-webkit-slider-thumb]:w-3
                                                [&::-webkit-slider-thumb]:bg-white
                                                [&::-webkit-slider-thumb]:rounded-full
                                                [&::-webkit-slider-thumb]:border-0

                                                [&::-moz-range-thumb]:appearance-none
                                                [&::-moz-range-thumb]:h-3
                                                [&::-moz-range-thumb]:w-3
                                                [&::-moz-range-thumb]:bg-white
                                                [&::-moz-range-thumb]:rounded-full
                                                [&::-moz-range-thumb]:border-0
                                            `}
                                        />
                                        <p className="text-center text-xs mt-1">{Math.round(volume * 100)}%</p>
                                    </div>                                
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
