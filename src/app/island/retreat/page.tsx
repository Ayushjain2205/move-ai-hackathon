"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
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
  User,
  Star,
  Filter,
  Check,
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
    id: "charm-boost-2",
    name: "Flirting 101",
    description: "Learn the art of subtle flirtation",
    duration: 5400, // 1.5 hours in seconds
    cost: 350,
    boostAmount: 15,
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
    id: "brain-training-2",
    name: "Quick Thinking",
    description: "Improve your response time in conversations",
    duration: 3600, // 1 hour in seconds
    cost: 250,
    boostAmount: 10,
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
    id: "social-butterfly-2",
    name: "Group Dynamics",
    description: "Learn to navigate group settings with ease",
    duration: 5400, // 1.5 hours in seconds
    cost: 400,
    boostAmount: 18,
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
    id: "stage-presence-2",
    name: "Dance Moves",
    description: "Learn impressive dance routines",
    duration: 9000, // 2.5 hours in seconds
    cost: 550,
    boostAmount: 25,
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
  {
    id: "fitness-boost-2",
    name: "Endurance Training",
    description: "Build stamina for long beach days",
    duration: 7200, // 2 hours in seconds
    cost: 400,
    boostAmount: 20,
    targetSkill: "Fitness",
    icon: Dumbbell,
  },
];

// Circular progress component
const CircularProgress = ({
  progress,
  size = 40,
  strokeWidth = 3,
  color = "bg-gradient-to-r from-pink-500 to-rose-500",
  icon: Icon,
  level,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  icon: React.ElementType;
  level: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#${color.replace(/\s/g, "-")})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient
            id={color.replace(/\s/g, "-")}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor={
                color.includes("pink")
                  ? "#ec4899"
                  : color.includes("blue")
                    ? "#3b82f6"
                    : color.includes("purple")
                      ? "#8b5cf6"
                      : color.includes("amber")
                        ? "#f59e0b"
                        : "#10b981"
              }
            />
            <stop
              offset="100%"
              stopColor={
                color.includes("rose")
                  ? "#f43f5e"
                  : color.includes("indigo")
                    ? "#6366f1"
                    : color.includes("violet")
                      ? "#8b5cf6"
                      : color.includes("orange")
                        ? "#f97316"
                        : "#059669"
              }
            />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-700" />
      </div>

      {/* Level indicator - Solid background instead of glassmorphism */}
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-4 h-4 flex items-center justify-center border border-gray-200 text-[8px] font-bold text-gray-700 shadow-sm">
        {level}
      </div>
    </div>
  );
};

export default function RetreatPage() {
  const router = useRouter();
  const [activeTraining, setActiveTraining] = useState<ActiveTraining | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [heartBalance] = useState(2450);
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null);

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

  const handleStartTraining = () => {
    if (!selectedTraining) return;

    const pack = TRAINING_PACKS.find((p) => p.id === selectedTraining);
    if (!pack) return;

    const endTime = Date.now() + pack.duration * 1000;
    setActiveTraining({
      packId: pack.id,
      endTime,
      targetSkill: pack.targetSkill,
    });

    // Clear selection after starting
    setSelectedTraining(null);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const filteredTrainingPacks = skillFilter
    ? TRAINING_PACKS.filter((pack) => pack.targetSkill === skillFilter)
    : TRAINING_PACKS;

  const selectedPack = TRAINING_PACKS.find((p) => p.id === selectedTraining);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/places/retreat.png"
          alt="Retreat background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push("/island")}
        className="fixed top-4 left-4 z-20 bg-white/30 backdrop-blur-sm rounded-full p-2 
                border-2 border-white/40 shadow-lg hover:bg-white/40 transition-all duration-200
                hover:scale-105 transform"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500/90 to-purple-500/90 backdrop-blur-md p-3 flex items-center justify-between border-b border-white/30">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-white" />
                <h1 className="font-title text-xl text-white">The Retreat</h1>
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5 border border-white/40">
                <Heart className="w-4 h-4 text-pink-200" />
                <span className="font-title text-white text-base">
                  {heartBalance}
                </span>
              </div>
            </div>

            {/* Main Content - Left/Right Split */}
            <div className="flex flex-row">
              {/* Left Side - Islander Profile & Skills */}
              <div className="w-1/3 bg-white/40 backdrop-blur-md border-r border-white/30">
                {/* Islander Image & Details */}
                <div className="p-4 text-center">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-white/70 relative mx-auto shadow-lg">
                    <Image
                      src="/placeholder.svg?height=160&width=160"
                      alt="Islander avatar"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h2 className="font-title text-xl text-gray-800 mt-3">
                    Sarah
                  </h2>

                  <div className="flex items-center justify-center gap-2 mt-1">
                    <div className="bg-purple-100/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 border border-purple-200/50">
                      <Star className="w-3 h-3 text-purple-500" />
                      <span className="font-title text-purple-700 text-xs">
                        Level 5
                      </span>
                    </div>

                    <div className="bg-amber-100/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 border border-amber-200/50">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      <span className="font-title text-amber-700 text-xs">
                        2,450 XP
                      </span>
                    </div>
                  </div>

                  {activeTraining && (
                    <div className="mt-2 bg-green-100/50 backdrop-blur-sm rounded-lg p-2 border border-green-200/50">
                      <div className="flex items-center justify-center gap-1">
                        <Timer className="w-3 h-3 text-green-500 animate-pulse" />
                        <span className="text-green-700 text-xs font-title">
                          Training: {formatTime(timeLeft || 0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skills Section */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-title text-sm text-gray-800 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-gray-700" />
                      Skills
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {SKILLS.map((skill) => (
                      <div
                        key={skill.name}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer",
                          skillFilter === skill.name
                            ? "bg-purple-100/40 backdrop-blur-sm border border-purple-200/40"
                            : "bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/40"
                        )}
                        onClick={() =>
                          setSkillFilter(
                            skillFilter === skill.name ? null : skill.name
                          )
                        }
                        role="button"
                      >
                        <CircularProgress
                          progress={skill.progress}
                          color={skill.color}
                          icon={skill.icon}
                          level={skill.level}
                        />

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-title text-sm text-gray-800">
                              {skill.name}
                            </span>
                            <span className="font-display text-xs text-gray-600">
                              Level {skill.level}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-1.5 bg-white/30 backdrop-blur-sm rounded-full overflow-hidden flex-1">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={cn(
                                  "h-full rounded-full",
                                  "bg-gradient-to-r",
                                  skill.color
                                )}
                              />
                            </div>
                            <span className="font-display text-xs text-gray-600">
                              {skill.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Training Options */}
              <div className="w-2/3 bg-white/40 backdrop-blur-md flex flex-col">
                <div className="p-3 border-b border-white/30">
                  <div className="flex items-center justify-between">
                    <h2 className="font-title text-sm text-gray-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gray-700" />
                      Training
                    </h2>

                    {skillFilter && (
                      <button
                        onClick={() => setSkillFilter(null)}
                        className="flex items-center gap-1 text-xs font-display text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <Filter className="w-3 h-3" />
                        Clear Filter: {skillFilter}
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 flex-grow">
                  <div className="grid grid-cols-2 gap-2">
                    <AnimatePresence mode="popLayout">
                      {filteredTrainingPacks.map((pack) => {
                        const isActive = activeTraining?.packId === pack.id;
                        const isTargetSkillTraining =
                          activeTraining?.targetSkill === pack.targetSkill;
                        const isSelected = selectedTraining === pack.id;
                        const targetSkill = SKILLS.find(
                          (s) => s.name === pack.targetSkill
                        );

                        return (
                          <motion.div
                            key={pack.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={cn(
                              "group",
                              isTargetSkillTraining &&
                                !isActive &&
                                "opacity-50 pointer-events-none"
                            )}
                          >
                            <div
                              className={cn(
                                "rounded-lg overflow-hidden transition-all duration-300 h-full cursor-pointer",
                                isSelected
                                  ? "bg-purple-500/20 border-2 border-purple-500"
                                  : "bg-white/30 backdrop-blur-sm border border-white/30 hover:bg-white/40 hover:border-white/50"
                              )}
                              onClick={() => {
                                if (!activeTraining) {
                                  setSelectedTraining(
                                    isSelected ? null : pack.id
                                  );
                                }
                              }}
                            >
                              <div className="flex h-full">
                                {/* Left Color Bar */}
                                <div
                                  className={cn(
                                    "w-1 shrink-0",
                                    "bg-gradient-to-b",
                                    targetSkill?.color
                                  )}
                                />

                                {/* Content */}
                                <div className="flex-1 p-2 flex flex-col relative">
                                  {/* Selection indicator */}
                                  {isSelected && (
                                    <div className="absolute top-1 right-1 bg-purple-400/70 backdrop-blur-sm rounded-full p-0.5 border border-white/50">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                  )}

                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <div
                                      className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center",
                                        "bg-gradient-to-br",
                                        targetSkill?.color
                                      )}
                                    >
                                      <pack.icon className="w-3 h-3 text-white" />
                                    </div>
                                    <h3 className="font-title text-sm text-gray-800">
                                      {pack.name}
                                    </h3>
                                  </div>

                                  <p className="font-display text-xs mb-auto text-gray-700">
                                    {pack.description}
                                  </p>

                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-1">
                                        <Timer className="w-3 h-3 text-gray-600" />
                                        <span className="font-display text-xs text-gray-700">
                                          {formatTime(pack.duration * 1000)}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3 text-gray-600" />
                                        <span className="font-display text-xs text-gray-700">
                                          +{pack.boostAmount}%
                                        </span>
                                      </div>
                                    </div>

                                    <div className="bg-pink-100/40 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 border border-pink-200/40">
                                      <Coins className="w-3 h-3 text-pink-500" />
                                      <span className="font-title text-xs text-pink-700">
                                        {pack.cost}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Fixed action bar at bottom */}
                <div className="p-3 border-t border-white/30 bg-white/40 backdrop-blur-md">
                  {selectedTraining ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-100/40 backdrop-blur-sm rounded-lg p-2 border border-purple-200/40">
                          {selectedPack?.icon && (
                            <selectedPack.icon className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-title text-base text-gray-800">
                            {selectedPack?.name}
                          </p>
                          <div className="flex items-center gap-2 font-display text-xs text-gray-700">
                            <span>
                              {formatTime(selectedPack?.duration || 0 * 1000)}
                            </span>
                            <span>•</span>
                            <span>
                              +{selectedPack?.boostAmount}%{" "}
                              {selectedPack?.targetSkill}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Coins className="w-3 h-3" />
                              {selectedPack?.cost}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Updated button to match Arrival Dock style */}
                      <button
                        onClick={handleStartTraining}
                        disabled={!!activeTraining}
                        className="bg-pink-500 hover:bg-pink-600 text-white font-title text-lg px-8 py-2 rounded-xl transition-colors"
                      >
                        Start Training
                      </button>
                    </div>
                  ) : (
                    <div className="text-center font-display text-sm text-gray-700">
                      {activeTraining ? (
                        <div className="flex items-center justify-center gap-2">
                          <Timer className="w-4 h-4 text-green-500 animate-pulse" />
                          <span className="text-green-700 font-title">
                            Training in progress: {formatTime(timeLeft || 0)}
                          </span>
                        </div>
                      ) : (
                        <span>Select a training option to begin</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
