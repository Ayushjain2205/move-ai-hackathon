"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Trophy, Timer, Sparkles } from "lucide-react";
import { useImageLoading } from "@/hooks/useImageLoading";

export default function ArenaPage() {
  const router = useRouter();
  const { imageLoaded, handleImageLoad } = useImageLoading("/places/arena.png");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient shown while image is loading */}
      {!imageLoaded && (
        <div className="fixed inset-0 bg-gradient-to-b from-orange-500 to-red-600 z-0" />
      )}

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/places/arena.png"
          alt="Arena background"
          fill
          className="object-cover"
          priority
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push("/island")}
        className="fixed top-4 left-4 z-20 bg-white/20 backdrop-blur-sm rounded-full p-2 
                border-2 border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200
                hover:scale-105 transform"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 p-4 text-center border-b border-white/20">
              <div className="flex items-center justify-center gap-3">
                <Flame className="w-6 h-6 text-white" />
                <h1 className="font-title text-2xl text-white">
                  Challenge Arena
                </h1>
              </div>
              <p className="font-handwritten text-lg text-white/90 mt-1">
                compete for glory and rewards
              </p>
            </div>

            {/* Coming Soon Content */}
            <div className="p-12 text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-title text-3xl text-white mb-4">
                  Coming Soon
                </h2>
                <p className="text-white/80 text-lg mb-8 font-display">
                  Get ready for epic challenges and unforgettable moments!
                </p>
              </motion.div>

              <div className="flex flex-col items-center gap-6">
                <motion.div
                  className="flex items-center gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-white/60 text-sm font-display">
                        Win Prizes
                      </div>
                      <div className="text-white font-display">
                        Daily Rewards
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                      <Timer className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-white/60 text-sm font-display">
                        Launching
                      </div>
                      <div className="text-white font-display">Season 1</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <span className="font-display">
                      Be the first to compete in exciting challenges!
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
