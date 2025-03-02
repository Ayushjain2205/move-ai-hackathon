"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useImageLoading } from "@/hooks/useImageLoading";
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
  Users,
  User,
  Send,
  Crown,
  Star,
  Flame,
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
];

type StatusFilter = "all" | "single" | "coupled";
type TypeFilter = "all" | "romantic" | "playful" | "mysterious" | "dramatic";
type GenderFilter = "all" | "male" | "female";

const TYPE_STYLES = {
  romantic: {
    icon: Heart,
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
    iconColor: "text-pink-400",
    label: "Romantic Soul",
  },
  playful: {
    icon: Star,
    gradient: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    label: "Fun & Playful",
  },
  mysterious: {
    icon: Sparkles,
    gradient: "from-purple-500/20 to-indigo-500/20",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    label: "Mysterious Aura",
  },
  dramatic: {
    icon: Flame,
    gradient: "from-red-500/20 to-orange-500/20",
    border: "border-red-500/30",
    iconColor: "text-red-400",
    label: "Drama Queen/King",
  },
};

const STATUS_STYLES = {
  single: {
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    label: "Ready to Mingle",
  },
  coupled: {
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
    iconColor: "text-pink-400",
    label: "Taken",
  },
};

export default function SunsetClubPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [nudging, setNudging] = useState<string | null>(null);
  const { imageLoaded, handleImageLoad } = useImageLoading("/places/club.png");

  const filteredProfiles = ISLANDER_PROFILES.filter((profile) => {
    if (statusFilter !== "all" && profile.status !== statusFilter) return false;
    if (typeFilter !== "all" && profile.type !== typeFilter) return false;
    if (genderFilter !== "all" && profile.gender !== genderFilter) return false;
    return true;
  });

  const handleNudge = (islanderId: string) => {
    setNudging(islanderId);
    // Simulate nudge sending
    setTimeout(() => {
      setNudging(null);
    }, 1500);
  };

  const renderSelectIcon = (icon: React.ElementType) => {
    const Icon = icon;
    return <Icon className="w-4 h-4 mr-2" />;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient shown while image is loading */}
      {!imageLoaded && (
        <div className="fixed inset-0 bg-gradient-to-b from-purple-500 to-pink-600 z-0" />
      )}

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/places/club.png"
          alt="Sunset club background"
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
                <Music className="w-6 h-6 text-white" />
                <h1 className="font-title text-2xl text-white">Sunset Club</h1>
              </div>
              <p className="font-handwritten text-lg text-white/90 mt-1">
                discover your perfect match
              </p>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-white/10">
              <div className="flex flex-wrap gap-3">
                {/* Gender Filter */}
                <Select
                  value={genderFilter}
                  onValueChange={(value: GenderFilter) =>
                    setGenderFilter(value)
                  }
                >
                  <SelectTrigger
                    className="w-[140px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                             border-white/20 text-white hover:from-purple-500/20 hover:to-pink-500/20 
                             transition-all duration-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    <SelectItem
                      value="all"
                      className="text-white hover:bg-white/20"
                    >
                      Everyone
                    </SelectItem>
                    <SelectItem
                      value="male"
                      className="text-white hover:bg-white/20"
                    >
                      Male
                    </SelectItem>
                    <SelectItem
                      value="female"
                      className="text-white hover:bg-white/20"
                    >
                      Female
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select
                  value={statusFilter}
                  onValueChange={(value: StatusFilter) =>
                    setStatusFilter(value)
                  }
                >
                  <SelectTrigger
                    className="w-[140px] bg-gradient-to-r from-pink-500/10 to-rose-500/10 
                             border-white/20 text-white hover:from-pink-500/20 hover:to-rose-500/20 
                             transition-all duration-200"
                  >
                    {statusFilter === "single" ? (
                      <User className="w-4 h-4 mr-2" />
                    ) : (
                      <Users className="w-4 h-4 mr-2" />
                    )}
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    <SelectItem
                      value="all"
                      className="text-white hover:bg-white/20"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem
                      value="single"
                      className="text-white hover:bg-white/20"
                    >
                      Single
                    </SelectItem>
                    <SelectItem
                      value="coupled"
                      className="text-white hover:bg-white/20"
                    >
                      Coupled
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Type Filter */}
                <Select
                  value={typeFilter}
                  onValueChange={(value: TypeFilter) => setTypeFilter(value)}
                >
                  <SelectTrigger
                    className="w-[140px] bg-gradient-to-r from-amber-500/10 to-orange-500/10 
                             border-white/20 text-white hover:from-amber-500/20 hover:to-orange-500/20 
                             transition-all duration-200"
                  >
                    {typeFilter === "all" ? (
                      <Crown className="w-4 h-4 mr-2" />
                    ) : (
                      (() => {
                        const Icon = TYPE_STYLES[typeFilter].icon;
                        return <Icon className="w-4 h-4 mr-2" />;
                      })()
                    )}
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    <SelectItem
                      value="all"
                      className="text-white hover:bg-white/20"
                    >
                      All Types
                    </SelectItem>
                    {Object.entries(TYPE_STYLES).map(([type, style]) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="text-white hover:bg-white/20"
                      >
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Profiles Grid */}
            <div className="h-[400px] overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredProfiles.map((profile) => (
                    <motion.div
                      key={profile.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group"
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
                        {/* Profile Image */}
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src={profile.image || "/placeholder.svg"}
                            alt={profile.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                          {/* Status Badge */}
                          <div className="absolute top-2 right-2">
                            <div
                              className={cn(
                                "px-2 py-1 rounded-full border backdrop-blur-sm",
                                "flex items-center gap-1.5",
                                "bg-gradient-to-r shadow-lg",
                                STATUS_STYLES[profile.status].gradient,
                                STATUS_STYLES[profile.status].border
                              )}
                            >
                              {profile.status === "single" ? (
                                <User
                                  className={cn(
                                    "w-3 h-3",
                                    STATUS_STYLES[profile.status].iconColor
                                  )}
                                />
                              ) : (
                                <Users
                                  className={cn(
                                    "w-3 h-3",
                                    STATUS_STYLES[profile.status].iconColor
                                  )}
                                />
                              )}
                              <span className="text-white text-[10px] font-display">
                                {STATUS_STYLES[profile.status].label}
                              </span>
                            </div>
                          </div>

                          {/* Type Badge */}
                          <div className="absolute top-2 left-2">
                            <div
                              className={cn(
                                "px-2 py-1 rounded-full border backdrop-blur-sm",
                                "flex items-center gap-1.5 shadow-lg",
                                "bg-gradient-to-r",
                                TYPE_STYLES[profile.type].gradient,
                                TYPE_STYLES[profile.type].border
                              )}
                            >
                              {(() => {
                                const Icon = TYPE_STYLES[profile.type].icon;
                                return (
                                  <Icon
                                    className={cn(
                                      "w-3 h-3",
                                      TYPE_STYLES[profile.type].iconColor
                                    )}
                                  />
                                );
                              })()}
                              <span className="text-white text-[10px] font-display">
                                {TYPE_STYLES[profile.type].label}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Profile Details */}
                        <div className="p-3">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h3 className="font-display text-sm text-white">
                                {profile.name}, {profile.age}
                              </h3>
                              {profile.partner && (
                                <p className="text-white/70 text-xs">
                                  with {profile.partner}
                                </p>
                              )}
                            </div>
                            <div
                              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                                        border border-purple-500/30 rounded-full px-2 py-0.5
                                        flex items-center gap-1 shadow-lg"
                            >
                              <Crown className="w-3 h-3 text-purple-400" />
                              <span className="font-display text-sm text-white">
                                {profile.score}
                              </span>
                            </div>
                          </div>

                          <p className="text-white/70 text-xs mb-3 line-clamp-2">
                            {profile.bio}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="text-white/50 text-xs font-display">
                              {profile.lastActive}
                            </div>
                            <Button
                              onClick={() => handleNudge(profile.id)}
                              disabled={nudging === profile.id}
                              size="sm"
                              className="h-7 text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white 
                                       border border-white/20 hover:from-pink-600 hover:to-purple-600
                                       shadow-lg transition-all duration-200"
                            >
                              {nudging === profile.id ? (
                                <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  Nudge
                                  <Send className="w-3 h-3 ml-1" />
                                </>
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
  );
}
