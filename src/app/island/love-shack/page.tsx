"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Star,
  Trophy,
  Search,
  X,
} from "lucide-react";

interface Islander {
  id: string;
  name: string;
  avatar_url: string;
  gender: string;
  personality_vibe: string;
  score: number;
  popularity: number;
  status: string;
  intro_line: string;
}

type MatchState = "searching" | "preview" | "chatting";

export default function LoveShackPage() {
  const router = useRouter();
  const { account } = useWallet();
  const [currentIslander, setCurrentIslander] = useState<Islander | null>(null);
  const [potentialMatch, setPotentialMatch] = useState<Islander | null>(null);
  const [matchState, setMatchState] = useState<MatchState>("searching");
  const [timeLeft, setTimeLeft] = useState(30);

  // Fetch current islander data
  useEffect(() => {
    const fetchCurrentIslander = async () => {
      if (!account?.address) return;

      try {
        const response = await fetch(
          `/api/get-islander?walletAddress=${account.address}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch islander data");
        }
        const data = await response.json();
        setCurrentIslander(data);
      } catch (error) {
        console.error("Error fetching islander:", error);
      }
    };

    fetchCurrentIslander();
  }, [account?.address]);

  // Fetch potential match
  const findMatch = async () => {
    if (!currentIslander) return;

    try {
      const response = await fetch("/api/find-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentIslanderId: currentIslander.id,
          gender: currentIslander.gender === "male" ? "female" : "male",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to find match");
      }

      const data = await response.json();
      setPotentialMatch(data.match);
      setMatchState("preview");
    } catch (error) {
      console.error("Error finding match:", error);
    }
  };

  // Start chat with match
  const startChat = () => {
    setMatchState("chatting");
    // Reset timer
    setTimeLeft(30);
  };

  // Timer logic
  useEffect(() => {
    if (matchState === "chatting" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setMatchState("searching");
      setPotentialMatch(null);
    }
  }, [timeLeft, matchState]);

  // Start searching for a match when component mounts
  useEffect(() => {
    if (currentIslander && matchState === "searching") {
      findMatch();
    }
  }, [currentIslander, matchState]);

  if (!currentIslander) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/places/love-shack.png"
          alt="Love Shack"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.push("/island")}
        className="fixed top-4 left-4 z-20 bg-white rounded-full p-2 
                border-2 border-pink-200 shadow-lg hover:bg-pink-50 transition-all duration-200
                hover:scale-105 transform"
      >
        <ArrowLeft className="w-6 h-6 text-pink-500" />
      </button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-white" />
                <h1 className="font-title text-2xl text-white">Love Shack</h1>
              </div>
              {matchState === "chatting" && (
                <div className="bg-white/20 rounded-full px-4 py-1.5 flex items-center gap-2">
                  <span className="text-white text-sm font-title">Time:</span>
                  <span
                    className={cn(
                      "text-white text-sm font-title",
                      timeLeft <= 10 && "text-red-200 animate-pulse"
                    )}
                  >
                    {timeLeft}s
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-center justify-between gap-12">
                {/* Current Islander */}
                <div className="flex-1 text-center">
                  <div className="relative w-40 h-40 mx-auto mb-6">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-pink-200 shadow-lg transform hover:scale-105 transition-transform duration-200">
                      <Image
                        src={currentIslander.avatar_url || "/placeholder.svg"}
                        alt={currentIslander.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h2 className="font-title text-2xl text-gray-800 mb-2">
                    {currentIslander.name}
                  </h2>
                  <p className="text-gray-600 mb-4 font-display">
                    {currentIslander.intro_line}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="bg-pink-100 rounded-full px-3 py-1.5">
                      <span className="text-sm text-pink-600 font-title">
                        {currentIslander.score} XP
                      </span>
                    </div>
                    <div className="bg-purple-100 rounded-full px-3 py-1.5">
                      <span className="text-sm text-purple-600 font-title">
                        {currentIslander.popularity}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* VS or Match */}
                <div className="flex-1 text-center">
                  {matchState === "searching" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <Search className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-display text-lg">
                        Finding your perfect match...
                      </p>
                    </motion.div>
                  )}

                  {matchState === "preview" && potentialMatch && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="relative w-40 h-40 mx-auto mb-6">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-pink-200 shadow-lg transform hover:scale-105 transition-transform duration-200">
                          <Image
                            src={
                              potentialMatch.avatar_url || "/placeholder.svg"
                            }
                            alt={potentialMatch.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <h2 className="font-title text-2xl text-gray-800 mb-2">
                        {potentialMatch.name}
                      </h2>
                      <p className="text-gray-600 mb-4 font-display">
                        {potentialMatch.intro_line}
                      </p>
                      <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="bg-pink-100 rounded-full px-3 py-1.5">
                          <span className="text-sm text-pink-600 font-title">
                            {potentialMatch.score} XP
                          </span>
                        </div>
                        <div className="bg-purple-100 rounded-full px-3 py-1.5">
                          <span className="text-sm text-purple-600 font-title">
                            {potentialMatch.popularity}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {matchState === "chatting" && potentialMatch && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <div className="relative w-40 h-40 mx-auto mb-6">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-pink-200 shadow-lg transform hover:scale-105 transition-transform duration-200">
                          <Image
                            src={
                              potentialMatch.avatar_url || "/placeholder.svg"
                            }
                            alt={potentialMatch.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <h2 className="font-title text-2xl text-gray-800 mb-2">
                        {potentialMatch.name}
                      </h2>
                      <p className="text-gray-600 font-display text-lg">
                        Chatting with {potentialMatch.name}...
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Start Button */}
              {matchState === "preview" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-center"
                >
                  <button
                    onClick={startChat}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-title text-lg shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 transform"
                  >
                    Start Vibing
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
