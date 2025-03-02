"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useImageLoading } from "@/hooks/useImageLoading";
import {
  ArrowLeft,
  Brain,
  Dumbbell,
  Heart,
  MessagesSquare,
  Music2,
  Sparkles,
  Timer,
  TrendingUp,
  Trophy,
  Coins,
} from "lucide-react";

interface Skill {
  name: string;
  level: number;
  progress: number;
  icon: React.ElementType;
  color: string;
}

interface TrainingPack {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  cost: number;
  boostAmount: number;
  targetSkill: string;
  icon: React.ElementType;
}

interface ActiveTraining {
  packId: string;
  endTime: number;
  targetSkill: string;
}

const SKILLS: Skill[] = [
  {
    name: "Charm",
    level: 3,
    progress: 65,
    icon: Heart,
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Intelligence",
    level: 2,
    progress: 40,
    icon: Brain,
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Social",
    level: 4,
    progress: 20,
    icon: MessagesSquare,
    color: "from-purple-500 to-violet-500",
  },
  {
    name: "Performance",
    level: 1,
    progress: 80,
    icon: Music2,
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Fitness",
    level: 2,
    progress: 30,
    icon: Dumbbell,
    color: "from-emerald-500 to-green-500",
  },
];

const TRAINING_PACKS: TrainingPack[] = [
  {
    id: "charm-boost",
    name: "Charm Mastery",
    description: "Enhance your natural charisma and appeal",
    duration: 7200, // 2 hours in seconds
    cost: 500,
    boostAmount: 25,
    targetSkill: "Charm",
    icon: Heart,
  },
  {
    id: "brain-training",
    name: "Mind Sharpener",
    description: "Boost your wit and problem-solving abilities",
    duration: 10800, // 3 hours in seconds
    cost: 600,
    boostAmount: 30,
    targetSkill: "Intelligence",
    icon: Brain,
  },
  {
    id: "social-butterfly",
    name: "Social Butterfly",
    description: "Master the art of conversation",
    duration: 7200, // 2 hours in seconds
    cost: 450,
    boostAmount: 20,
    targetSkill: "Social",
    icon: MessagesSquare,
  },
  {
    id: "stage-presence",
    name: "Stage Presence",
    description: "Become the life of every party",
    duration: 14400, // 4 hours in seconds
    cost: 750,
    boostAmount: 35,
    targetSkill: "Performance",
    icon: Music2,
  },
  {
    id: "fitness-boost",
    name: "Beach Body Boost",
    description: "Get that perfect beach body",
    duration: 10800, // 3 hours in seconds
    cost: 550,
    boostAmount: 25,
    targetSkill: "Fitness",
    icon: Dumbbell,
  },
];

export default function RetreatPage() {
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [activeTraining, setActiveTraining] = useState<ActiveTraining | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { imageLoaded, handleImageLoad } = useImageLoading(
    "/places/retreat.png"
  );

  // Simulate active training countdown
  useEffect(() => {
    if (!activeTraining) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, activeTraining.endTime - now);

      if (remaining === 0) {
        setActiveTraining(null);
        setTimeLeft(null);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTraining]);

  const handleStartTraining = (pack: TrainingPack) => {
    const endTime = Date.now() + pack.duration * 1000;
    setActiveTraining({
      packId: pack.id,
      endTime,
      targetSkill: pack.targetSkill,
    });
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient shown while image is loading */}
      {!imageLoaded && (
        <div className="fixed inset-0 bg-gradient-to-b from-blue-500 to-indigo-600 z-0" />
      )}

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/places/retreat.png"
          alt="Retreat background"
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
                <Trophy className="w-6 h-6 text-white" />
                <h1 className="font-title text-2xl text-white">The Retreat</h1>
              </div>
              <p className="font-handwritten text-lg text-white/90 mt-1">
                level up your islander
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-[40%_60%]">
              {/* Left Column - Islander Profile & Stats */}
              <div className="border-r border-white/10">
                <div className="p-4 space-y-4">
                  {/* Avatar */}
                  <div className="aspect-square rounded-xl overflow-hidden border-2 border-white/20 relative">
                    <Image
                      src="/placeholder.svg?height=400&width=400"
                      alt="Islander avatar"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Islander Info */}
                  <div className="text-center">
                    <h2 className="font-display text-2xl text-white mb-1">
                      Sarah
                    </h2>
                    <p className="text-white/70 text-sm">Level 5 Islander</p>
                    <div
                      className="mt-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                            border border-purple-500/30 rounded-full px-3 py-1.5
                            inline-flex items-center gap-2"
                    >
                      <Trophy className="w-4 h-4 text-purple-400" />
                      <span className="font-display text-white">2,450 XP</span>
                    </div>
                  </div>

                  {/* Current Skills */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="mb-2">
                      <span className="font-display text-sm text-gray-900">
                        Current Skills
                      </span>
                    </div>
                    <div className="space-y-2">
                      {SKILLS.map((skill) => (
                        <div key={skill.name} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-lg flex items-center justify-center",
                                  "bg-gradient-to-br shadow-lg",
                                  skill.color
                                )}
                              >
                                <skill.icon className="w-3 h-3 text-white" />
                              </div>
                              <span className="font-display text-sm text-gray-900">
                                {skill.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-700 font-display text-sm">
                                Lvl {skill.level}
                              </span>
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={cn(
                                "h-full rounded-full",
                                "bg-gradient-to-r shadow-lg",
                                skill.color
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Training Packs */}
              <div className="h-[600px] overflow-y-auto">
                <div className="p-4">
                  <h2 className="font-display text-lg text-white flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5" />
                    Available Training
                  </h2>
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {TRAINING_PACKS.map((pack) => (
                        <motion.div
                          key={pack.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={cn(
                            "group",
                            activeTraining?.targetSkill === pack.targetSkill &&
                              "opacity-50 pointer-events-none"
                          )}
                        >
                          <div
                            className={cn(
                              "bg-white/95 backdrop-blur-sm rounded-lg border border-white/20 p-3 shadow-lg",
                              "hover:bg-white/90 transition-all duration-200",
                              selectedPack === pack.id &&
                                "bg-white border-white"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                  "bg-gradient-to-br shadow-lg",
                                  SKILLS.find(
                                    (s) => s.name === pack.targetSkill
                                  )?.color
                                )}
                              >
                                <pack.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-display text-base text-gray-900">
                                  {pack.name}
                                </h3>
                                <p className="text-gray-600 text-xs mb-2">
                                  {pack.description}
                                </p>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    <Timer className="w-3 h-3 text-white/70" />
                                    <span className="text-gray-600 text-xs">
                                      {formatTime(pack.duration * 1000)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-white/70" />
                                    <span className="text-gray-600 text-xs">
                                      +{pack.boostAmount}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div
                                  className="bg-gradient-to-r from-violet-500 to-purple-500
                                  border border-white/20 rounded-full px-2 py-0.5
                                  flex items-center gap-1 shadow-lg"
                                >
                                  <Coins className="w-3 h-3 text-white" />
                                  <span className="font-display text-xs text-white">
                                    {pack.cost}
                                  </span>
                                </div>
                                <Button
                                  onClick={() => handleStartTraining(pack)}
                                  disabled={!!activeTraining}
                                  size="sm"
                                  className={cn(
                                    "h-7 text-xs border border-white/20",
                                    activeTraining?.packId === pack.id
                                      ? "bg-gradient-to-r from-violet-500 to-purple-500 cursor-default"
                                      : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                                  )}
                                >
                                  {activeTraining?.packId === pack.id ? (
                                    <div className="flex items-center gap-1.5">
                                      <Timer className="w-3 h-3 animate-pulse" />
                                      <span>{formatTime(timeLeft || 0)}</span>
                                    </div>
                                  ) : (
                                    "Start Training"
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
