"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Heart,
  Music,
  Sparkles,
  Crown,
  Star,
  Flame,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  UserPlus,
  Trophy,
} from "lucide-react";

interface IslanderProfile {
  id: string;
  name: string;
  age: number;
  image: string;
  gender: "male" | "female";
  status: "single" | "coupled";
  partner?: string;
  score: number;
  bio: string;
  type: "romantic" | "playful" | "mysterious" | "dramatic";
  popularity: number;
  lastActive: string;
}

const ISLANDER_PROFILES: IslanderProfile[] = [
  {
    id: "sarah",
    name: "Sarah",
    age: 24,
    gender: "female",
    image: "/placeholder.svg?height=400&width=400",
    status: "single",
    score: 850,
    bio: "Looking for that special connection ✨",
    type: "romantic",
    popularity: 92,
    lastActive: "2m ago",
  },
  {
    id: "mike",
    name: "Mike",
    age: 26,
    gender: "male",
    image: "/placeholder.svg?height=400&width=400",
    status: "coupled",
    partner: "Emma",
    score: 920,
    bio: "Found my paradise with Emma 💑",
    type: "playful",
    popularity: 88,
    lastActive: "5m ago",
  },
  {
    id: "emma",
    name: "Emma",
    age: 23,
    gender: "female",
    image: "/placeholder.svg?height=400&width=400",
    status: "coupled",
    partner: "Mike",
    score: 890,
    bio: "Living my best life with Mike 🌴",
    type: "romantic",
    popularity: 85,
    lastActive: "5m ago",
  },
  {
    id: "james",
    name: "James",
    age: 27,
    gender: "male",
    image: "/placeholder.svg?height=400&width=400",
    status: "single",
    score: 780,
    bio: "Here for the adventure 🌊",
    type: "mysterious",
    popularity: 78,
    lastActive: "15m ago",
  },
  {
    id: "lily",
    name: "Lily",
    age: 25,
    gender: "female",
    image: "/placeholder.svg?height=400&width=400",
    status: "single",
    score: 830,
    bio: "Bringing the drama to paradise 💫",
    type: "dramatic",
    popularity: 82,
    lastActive: "1h ago",
  },
  {
    id: "alex",
    name: "Alex",
    age: 28,
    gender: "male",
    image: "/placeholder.svg?height=400&width=400",
    status: "single",
    score: 910,
    bio: "Ready to find my soulmate 💖",
    type: "romantic",
    popularity: 95,
    lastActive: "Just now",
  },
  {
    id: "jessica",
    name: "Jessica",
    age: 26,
    gender: "female",
    image: "/placeholder.svg?height=400&width=400",
    status: "single",
    score: 870,
    bio: "Beach lover looking for adventure 🏝️",
    type: "playful",
    popularity: 88,
    lastActive: "30m ago",
  },
  {
    id: "ryan",
    name: "Ryan",
    age: 29,
    gender: "male",
    image: "/placeholder.svg?height=400&width=400",
    status: "single",
    score: 840,
    bio: "Surfer with a passion for sunsets 🌅",
    type: "mysterious",
    popularity: 82,
    lastActive: "1h ago",
  },
  {
    id: "olivia",
    name: "Olivia",
    age: 24,
    gender: "female",
    image: "/placeholder.svg?height=400&width=400",
    status: "single",
    score: 895,
    bio: "Looking for someone to share cocktails with 🍹",
    type: "romantic",
    popularity: 90,
    lastActive: "5m ago",
  },
  {
    id: "daniel",
    name: "Daniel",
    age: 27,
    gender: "male",
    image: "/placeholder.svg?height=400&width=400",
    status: "coupled",
    partner: "Sophia",
    score: 930,
    bio: "Found the one in paradise ❤️",
    type: "romantic",
    popularity: 94,
    lastActive: "10m ago",
  },
  {
    id: "sophia",
    name: "Sophia",
    age: 25,
    gender: "female",
    image: "/placeholder.svg?height=400&width=400",
    status: "coupled",
    partner: "Daniel",
    score: 915,
    bio: "Living my best life with Daniel 💕",
    type: "playful",
    popularity: 91,
    lastActive: "10m ago",
  },
  {
    id: "ethan",
    name: "Ethan",
    age: 30,
    gender: "male",
    image: "/placeholder.svg?height=400&width=400",
    status: "single",
    score: 860,
    bio: "Island DJ looking for my rhythm partner 🎧",
    type: "dramatic",
    popularity: 87,
    lastActive: "45m ago",
  },
];

type StatusFilter = "all" | "single" | "coupled";
type TypeFilter = "all" | "romantic" | "playful" | "mysterious" | "dramatic";
type GenderFilter = "all" | "male" | "female";
type NudgeType = "friend" | "challenge";

const TYPE_STYLES = {
  romantic: {
    icon: Heart,
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
    iconColor: "text-pink-400",
    label: "Romantic Soul",
    shortLabel: "Romantic",
    color: "text-pink-500",
    bgColor: "bg-pink-100",
  },
  playful: {
    icon: Star,
    gradient: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    label: "Fun & Playful",
    shortLabel: "Playful",
    color: "text-amber-500",
    bgColor: "bg-amber-100",
  },
  mysterious: {
    icon: Sparkles,
    gradient: "from-purple-500/20 to-indigo-500/20",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    label: "Mysterious Aura",
    shortLabel: "Mysterious",
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  dramatic: {
    icon: Flame,
    gradient: "from-red-500/20 to-orange-500/20",
    border: "border-red-500/30",
    iconColor: "text-red-400",
    label: "Drama Queen/King",
    shortLabel: "Dramatic",
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
};

const STATUS_STYLES = {
  single: {
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    label: "Ready to Mingle",
    color: "text-emerald-500",
    bgColor: "bg-emerald-100",
  },
  coupled: {
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
    iconColor: "text-pink-400",
    label: "Taken",
    color: "text-pink-500",
    bgColor: "bg-pink-100",
  },
};

export default function SunsetClubPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [nudging, setNudging] = useState<{
    id: string;
    type: NudgeType;
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

  const filteredProfiles = ISLANDER_PROFILES.filter((profile) => {
    if (statusFilter !== "all" && profile.status !== statusFilter) return false;
    if (typeFilter !== "all" && profile.type !== typeFilter) return false;
    if (genderFilter !== "all" && profile.gender !== genderFilter) return false;
    return true;
  });

  const handleNudge = (islanderId: string, nudgeType: NudgeType) => {
    setNudging({ id: islanderId, type: nudgeType });
    // Simulate nudge sending
    setTimeout(() => {
      setNudging(null);
    }, 1500);
  };

  const toggleExpandProfile = (profileId: string) => {
    setExpandedProfile(expandedProfile === profileId ? null : profileId);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setGenderFilter("all");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/places/club.png"
          alt="Sunset club background"
          fill
          className="object-cover"
          priority
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
            {/* Sleek Header */}
            <div className="bg-purple-500 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-white" />
                <h1 className="font-title text-xl text-white">Sunset Club</h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "bg-white/20 backdrop-blur-sm rounded-full p-2 transition-colors",
                    showFilters ? "bg-white/40" : "bg-white/20"
                  )}
                >
                  <Filter className="w-4 h-4 text-white" />
                </button>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
                  <Search className="w-3 h-3 text-white" />
                  <span className="text-white text-xs font-display">
                    {filteredProfiles.length} Islander
                    {filteredProfiles.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Filters - Collapsible */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-white border-b border-gray-200"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-display text-sm text-gray-700">
                        Filter Islanders
                      </h3>
                      <button
                        onClick={clearFilters}
                        className="text-xs text-purple-500 font-display flex items-center gap-1 hover:text-purple-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Clear Filters
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Gender Filter */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-display">
                          Gender
                        </p>
                        <Select
                          value={genderFilter}
                          onValueChange={(value: GenderFilter) =>
                            setGenderFilter(value)
                          }
                        >
                          <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-gray-800 text-xs h-9 font-display">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200">
                            <SelectItem
                              value="all"
                              className="text-gray-800 text-xs font-display"
                            >
                              Everyone
                            </SelectItem>
                            <SelectItem
                              value="male"
                              className="text-gray-800 text-xs font-display"
                            >
                              Male
                            </SelectItem>
                            <SelectItem
                              value="female"
                              className="text-gray-800 text-xs font-display"
                            >
                              Female
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Status Filter */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-display">
                          Status
                        </p>
                        <Select
                          value={statusFilter}
                          onValueChange={(value: StatusFilter) =>
                            setStatusFilter(value)
                          }
                        >
                          <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-gray-800 text-xs h-9 font-display">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200">
                            <SelectItem
                              value="all"
                              className="text-gray-800 text-xs font-display"
                            >
                              All Status
                            </SelectItem>
                            <SelectItem
                              value="single"
                              className="text-gray-800 text-xs font-display"
                            >
                              Single
                            </SelectItem>
                            <SelectItem
                              value="coupled"
                              className="text-gray-800 text-xs font-display"
                            >
                              Coupled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Type Filter */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-display">
                          Personality
                        </p>
                        <Select
                          value={typeFilter}
                          onValueChange={(value: TypeFilter) =>
                            setTypeFilter(value)
                          }
                        >
                          <SelectTrigger className="w-full bg-gray-50 border-gray-200 text-gray-800 text-xs h-9 font-display">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200">
                            <SelectItem
                              value="all"
                              className="text-gray-800 text-xs font-display"
                            >
                              All Types
                            </SelectItem>
                            {Object.entries(TYPE_STYLES).map(
                              ([type, style]) => (
                                <SelectItem
                                  key={type}
                                  value={type}
                                  className="text-gray-800 text-xs font-display"
                                >
                                  {style.shortLabel}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profiles */}
            <div className="h-[500px] overflow-y-auto bg-gray-50 scrollbar-hide">
              <div className="divide-y divide-gray-200">
                <AnimatePresence mode="popLayout">
                  {filteredProfiles.map((profile) => (
                    <motion.div
                      key={profile.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="p-3 hover:bg-gray-100 transition-colors">
                        <div className="flex gap-3">
                          {/* Avatar with properly positioned status indicator */}
                          <div className="relative w-14 h-14 flex-shrink-0">
                            <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200">
                              <Image
                                src={profile.image || "/placeholder.svg"}
                                alt={profile.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div
                              className={cn(
                                "absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white",
                                profile.status === "single"
                                  ? "bg-green-500"
                                  : "bg-pink-500"
                              )}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-display text-sm text-gray-800 font-medium">
                                  {profile.name}, {profile.age}
                                </h3>
                                <div className="flex items-center">
                                  <Crown className="w-3 h-3 text-purple-500" />
                                  <span className="text-xs text-gray-500 font-display">
                                    {profile.score}
                                  </span>
                                </div>
                              </div>
                              <div className="text-gray-400 text-xs font-display">
                                {profile.lastActive}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 mt-0.5 mb-1">
                              <div
                                className={cn(
                                  "px-1.5 py-0.5 rounded-full text-[10px] font-display",
                                  STATUS_STYLES[profile.status].bgColor,
                                  STATUS_STYLES[profile.status].color
                                )}
                              >
                                {profile.status === "single"
                                  ? "Single"
                                  : `With ${profile.partner}`}
                              </div>
                              <div
                                className={cn(
                                  "px-1.5 py-0.5 rounded-full text-[10px] font-display",
                                  TYPE_STYLES[profile.type].bgColor,
                                  TYPE_STYLES[profile.type].color
                                )}
                              >
                                {TYPE_STYLES[profile.type].shortLabel}
                              </div>
                            </div>

                            {/* Bio and actions */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p
                                  className={cn(
                                    "text-xs text-gray-600 font-body",
                                    expandedProfile === profile.id
                                      ? "line-clamp-none"
                                      : "line-clamp-1"
                                  )}
                                >
                                  {profile.bio}
                                </p>

                                {/* Additional details shown when expanded */}
                                {expandedProfile === profile.id && (
                                  <div className="mt-2 text-xs text-gray-500 font-display">
                                    <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3 text-amber-400" />
                                      <span>
                                        Popularity: {profile.popularity}%
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 ml-2">
                                <button
                                  onClick={() =>
                                    toggleExpandProfile(profile.id)
                                  }
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  {expandedProfile === profile.id ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>

                                {/* Friend and Challenge buttons */}
                                <div className="flex gap-1">
                                  {/* Friend Button */}
                                  <Button
                                    onClick={() =>
                                      handleNudge(profile.id, "friend")
                                    }
                                    disabled={
                                      nudging !== null ||
                                      profile.status === "coupled"
                                    }
                                    size="sm"
                                    className={cn(
                                      "h-6 text-xs text-white border-0 shadow-sm px-2 font-display",
                                      "transition-all duration-200",
                                      profile.status === "coupled"
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                    )}
                                  >
                                    {nudging?.id === profile.id &&
                                    nudging?.type === "friend" ? (
                                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <>
                                        <UserPlus className="w-3 h-3 mr-1" />
                                        Friend
                                      </>
                                    )}
                                  </Button>

                                  {/* Challenge Button */}
                                  <Button
                                    onClick={() =>
                                      handleNudge(profile.id, "challenge")
                                    }
                                    disabled={
                                      nudging !== null ||
                                      profile.status === "coupled"
                                    }
                                    size="sm"
                                    className={cn(
                                      "h-6 text-xs text-white border-0 shadow-sm px-2 font-display",
                                      "transition-all duration-200",
                                      profile.status === "coupled"
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                                    )}
                                  >
                                    {nudging?.id === profile.id &&
                                    nudging?.type === "challenge" ? (
                                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <>
                                        <Trophy className="w-3 h-3 mr-1" />
                                        Challenge
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
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
  );
}
