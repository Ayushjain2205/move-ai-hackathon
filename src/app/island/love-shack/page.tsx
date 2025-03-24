"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
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
  traits: {
    confidence: number;
    humor: number;
    intelligence: number;
    kindness: number;
    charisma: number;
  };
}

interface Message {
  id: string;
  sender: "user" | "match";
  text: string;
  timestamp: string;
}

interface Choice {
  id: string;
  text: string;
}

type MatchState = "searching" | "preview" | "chatting" | "result";
type ChatResult = "match" | "no_match" | null;

export default function LoveShackPage() {
  const router = useRouter();
  const { account } = useWallet();
  const [currentIslander, setCurrentIslander] = useState<Islander | null>(null);
  const [potentialMatch, setPotentialMatch] = useState<Islander | null>(null);
  const [matchState, setMatchState] = useState<MatchState>("searching");
  const [timeLeft, setTimeLeft] = useState(30);
  const [messages, setMessages] = useState<Message[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatResult, setChatResult] = useState<ChatResult>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Generate AI response
  const generateAIResponse = async () => {
    if (!currentIslander || !potentialMatch) return;

    setIsTyping(true);
    try {
      const response = await fetch("/api/chat-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          currentIslander,
          potentialMatch,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, data.message]);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Generate choices for user
  const generateChoices = async () => {
    if (!currentIslander || !potentialMatch) return;

    try {
      const response = await fetch("/api/chat-choices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          currentIslander,
          potentialMatch,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate choices");
      }

      const data = await response.json();
      setChoices(data.choices);
    } catch (error) {
      console.error("Error generating choices:", error);
    }
  };

  // Start chat with match
  const startChat = async () => {
    setMatchState("chatting");
    setTimeLeft(30);
    setMessages([]);
    setChoices([]);
    setChatResult(null);

    // Generate initial message from match
    await generateAIResponse();
    // Generate choices for user
    await generateChoices();
  };

  // Handle user choice
  const handleChoice = async (choice: Choice) => {
    // Add user's choice to messages
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: choice.text,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setChoices([]);

    // Generate AI response
    await generateAIResponse();
    // Generate new choices
    await generateChoices();

    // Check if chat should end (10 messages)
    if (messages.length >= 18) {
      // 9 pairs of messages
      endChat();
    }
  };

  // End chat and determine result
  const endChat = () => {
    setMatchState("result");
    // Determine match based on conversation quality
    const matchScore = calculateMatchScore();
    setChatResult(matchScore > 0.7 ? "match" : "no_match");
  };

  // Calculate match score based on conversation quality
  const calculateMatchScore = () => {
    // Simple scoring based on message count and timing
    const baseScore = messages.length / 20; // Max 20 messages
    const timeBonus = timeLeft / 30; // Time remaining bonus
    return Math.min(1, baseScore + timeBonus * 0.2);
  };

  // Timer logic
  useEffect(() => {
    if (matchState === "chatting" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && matchState === "chatting") {
      endChat();
    }
  }, [timeLeft, matchState]);

  // Start searching for a match when component mounts
  useEffect(() => {
    if (currentIslander && matchState === "searching") {
      findMatch();
    }
  }, [currentIslander, matchState]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
        className="fixed top-4 left-4 z-20 bg-white/20 backdrop-blur-sm rounded-full p-2 
                border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200
                hover:scale-105 transform"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
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
              <div
                className={cn(
                  "flex items-center justify-between gap-12",
                  matchState === "chatting" && "mb-4"
                )}
              >
                {/* Current Islander - Always on the right */}
                <div
                  className={cn(
                    "text-center",
                    matchState === "chatting" ? "w-16" : "flex-1"
                  )}
                >
                  <div
                    className={cn(
                      "relative mx-auto mb-2",
                      matchState === "chatting" ? "w-16 h-16" : "w-40 h-40"
                    )}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-pink-200 shadow-lg transform hover:scale-105 transition-transform duration-200">
                      <Image
                        src={currentIslander.avatar_url || "/placeholder.svg"}
                        alt={currentIslander.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div
                      className={cn(
                        "absolute -bottom-2 -right-2 bg-green-500 rounded-full border-2 border-white flex items-center justify-center",
                        matchState === "chatting" ? "w-4 h-4" : "w-8 h-8"
                      )}
                    >
                      <Star
                        className={cn(
                          "text-white",
                          matchState === "chatting" ? "w-2 h-2" : "w-4 h-4"
                        )}
                      />
                    </div>
                  </div>
                  <h2
                    className={cn(
                      "font-title text-gray-800",
                      matchState === "chatting" ? "text-sm" : "text-2xl mb-2"
                    )}
                  >
                    {currentIslander.name}
                  </h2>
                  {matchState !== "chatting" && (
                    <>
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
                    </>
                  )}
                </div>

                {/* VS or Match - Always on the left */}
                <div
                  className={cn(
                    "text-center",
                    matchState === "chatting" ? "w-16" : "flex-1"
                  )}
                >
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
                      <div className="relative w-16 h-16 mx-auto mb-2">
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
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Star className="w-2 h-2 text-white" />
                        </div>
                      </div>
                      <h2 className="font-title text-sm text-gray-800">
                        {potentialMatch.name}
                      </h2>
                    </motion.div>
                  )}

                  {matchState === "result" && potentialMatch && (
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
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Chat Interface */}
              {matchState === "chatting" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  {/* Messages */}
                  <div className="h-[300px] overflow-y-auto space-y-3 mb-4 p-3 bg-gray-50 rounded-xl">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.sender === "user"
                            ? "justify-start"
                            : "justify-end"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-xl p-2.5 shadow-sm",
                            message.sender === "user"
                              ? "bg-white rounded-bl-none border border-gray-200"
                              : "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-none"
                          )}
                        >
                          <p
                            className={cn(
                              "text-sm font-title",
                              message.sender === "user"
                                ? "text-gray-800"
                                : "text-white"
                            )}
                          >
                            {message.text}
                          </p>
                          <p
                            className={cn(
                              "text-[10px] text-right mt-0.5 font-display",
                              message.sender === "user"
                                ? "text-gray-400"
                                : "text-white/70"
                            )}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-end">
                        <div className="bg-white rounded-xl p-2.5 shadow-sm rounded-bl-none border border-gray-200">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                            <span
                              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                            <span
                              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Choices */}
                  {choices.length > 0 && (
                    <div className="space-y-2">
                      {choices.map((choice) => (
                        <button
                          key={choice.id}
                          onClick={() => handleChoice(choice)}
                          className="w-full bg-white rounded-xl p-3 text-left border border-gray-200 shadow-sm hover:border-pink-200 hover:bg-pink-50 transition-all duration-200"
                        >
                          <p className="text-gray-800 font-title text-sm">
                            {choice.text}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Result Display */}
              {matchState === "result" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-center gap-4">
                      {chatResult === "match" ? (
                        <>
                          <Heart className="w-8 h-8 text-white animate-pulse" />
                          <p className="text-white font-title text-2xl">
                            It's a Match! 💖
                          </p>
                        </>
                      ) : (
                        <>
                          <X className="w-8 h-8 text-white" />
                          <p className="text-white font-title text-2xl">
                            Not meant to be... 💔
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setMatchState("searching");
                        setPotentialMatch(null);
                        setChatResult(null);
                      }}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-title text-lg shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 hover:scale-105 transform"
                    >
                      Find Another Match
                    </button>
                  </div>
                </motion.div>
              )}

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
