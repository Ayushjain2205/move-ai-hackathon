"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX, Heart, Sparkles } from "lucide-react";
import { GameButton } from "@/components/game-button";
import { GameTitle } from "@/components/game-title";
import { useSoundEffect } from "@/hooks/use-sound-effect";

export default function GameLanding() {
  const [isMuted, toggleSound] = useSoundEffect("/click.mp3");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-pink-400 to-purple-600 flex items-center justify-center">
        <div className="animate-bounce">
          <Heart className="w-24 h-24 text-white animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FF6B9C] to-[#FF4D79]">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 animate-float-slow">
          <Heart className="w-12 h-12 text-pink-300" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float">
          <Sparkles className="w-10 h-10 text-yellow-300" />
        </div>
      </div>

      {/* Sound toggle */}
      <button
        onClick={() => toggleSound()}
        className="absolute top-4 right-4 z-50 p-3 rounded-full 
                 bg-white/10 backdrop-blur-sm hover:bg-white/20 
                 transition-all duration-300 text-white"
      >
        {isMuted ? (
          <VolumeX className="h-6 w-6" />
        ) : (
          <Volume2 className="h-6 w-6" />
        )}
      </button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-10">
        <GameTitle />

        <div className="mt-12 w-full max-w-md space-y-6">
          <div
            className="game-menu-container p-6 rounded-[2rem] bg-white/20 backdrop-blur-sm 
                        border-4 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <div className="space-y-4">
              <GameButton variant="start" subtitle="begin your journey">
                START GAME
              </GameButton>

              <GameButton variant="connect" subtitle="connect your wallet">
                CONNECT WALLET
              </GameButton>

              <div className="grid grid-cols-2 gap-4">
                <GameButton variant="secondary">SHOP</GameButton>
                <GameButton variant="secondary">SETTINGS</GameButton>
              </div>
            </div>
          </div>

          {/* Version tag with new typography */}
          <div className="text-center">
            <span
              className="inline-block px-4 py-1 rounded-full 
                         bg-white/20 backdrop-blur-sm text-white 
                         font-display text-sm tracking-wider
                         border-2 border-white/30"
            >
              BETA v0.1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
