"use client";

import { useEffect, useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { GameTitle } from "@/components/game-title";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient shown while image is loading */}
      {!imageLoaded && (
        <div className="fixed inset-0 bg-gradient-to-b from-pink-400 to-purple-600 z-0" />
      )}

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/bg.png"
          alt="Tropical paradise background"
          fill
          className="object-cover object-center"
          priority
          onLoad={() => setImageLoaded(true)}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-10 left-10 animate-float-slow">
          <Heart className="w-12 h-12 text-pink-300 drop-shadow-glow" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float">
          <Sparkles className="w-10 h-10 text-yellow-300 drop-shadow-glow" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="mb-20">
          <GameTitle />
        </div>

        <div className="transform hover:-translate-y-1 transition-transform duration-200">
          <button
            onClick={() => router.push("/login")}
            className="group relative"
          >
            {/* Button shadow/border effect */}
            <div
              className="absolute inset-0 rounded-xl translate-y-2 bg-black/20 transition-transform
                           group-hover:translate-y-1.5 group-active:translate-y-0.5"
            />

            {/* Main button */}
            <div
              className="relative transform transition-all duration-200
                           group-active:translate-y-1"
            >
              <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 p-0.5 rounded-xl">
                <div
                  className="bg-gradient-to-b from-white/20 to-transparent backdrop-blur-sm rounded-lg
                               border-2 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.3)]
                              px-8 py-3 text-center"
                >
                  <span className="font-title text-2xl text-white drop-shadow-glow">
                    Let&apos;s Go!
                  </span>
                </div>
              </div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div
                className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%]
                             bg-gradient-to-r from-transparent via-white/10 to-transparent
                            transition-transform duration-1000"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
