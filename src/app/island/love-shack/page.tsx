"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Heart,
  PartyPopperIcon as Party,
  Flame,
  Coffee,
  Frown,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Message {
  id: number;
  sender: "islander1" | "islander2";
  text: string;
  timestamp: string;
}

type VibeType = "romantic" | "flirty" | "fun" | "boring" | "angry";

interface VibeState {
  type: VibeType;
  icon: typeof Heart;
  color: string;
  gradient: string;
  label: string;
  emoji: string;
}

const VIBES: Record<VibeType, VibeState> = {
  romantic: {
    type: "romantic",
    icon: Heart,
    color: "text-pink-400",
    gradient: "from-pink-400 via-rose-400 to-purple-400",
    label: "Romantic",
    emoji: "💖",
  },
  flirty: {
    type: "flirty",
    icon: Flame,
    color: "text-rose-400",
    gradient: "from-orange-400 via-rose-400 to-pink-400",
    label: "Flirty",
    emoji: "😘",
  },
  fun: {
    type: "fun",
    icon: Party,
    color: "text-amber-400",
    gradient: "from-amber-400 via-orange-400 to-yellow-400",
    label: "Fun",
    emoji: "🎉",
  },
  boring: {
    type: "boring",
    icon: Coffee,
    color: "text-slate-400",
    gradient: "from-blue-400 via-slate-400 to-gray-400",
    label: "Boring",
    emoji: "😴",
  },
  angry: {
    type: "angry",
    icon: Frown,
    color: "text-red-500",
    gradient: "from-red-500 via-rose-500 to-red-600",
    label: "Angry",
    emoji: "😠",
  },
};

const CONVERSATIONS: Record<VibeType, string[]> = {
  romantic: [
    "The sunset looks magical... just like your eyes ✨",
    "You make my heart skip a beat every time you smile 💖",
    "I've never felt this way about anyone before...",
  ],
  flirty: [
    "Is it hot in here or is it just you? 🔥",
    "That swimsuit looks amazing on you 😘",
    "Maybe we should take a midnight swim together?",
  ],
  fun: [
    "Let's have a dance party! 💃🕺",
    "Race you to the water! 🏃‍♂️",
    "You're hilarious! Tell me another joke 😂",
  ],
  boring: [
    "So... what's your favorite color? 😕",
    "The weather is... nice today.",
    "I had cereal for breakfast...",
  ],
  angry: [
    "I saw you talking to them earlier 😠",
    "Why are you being like this?",
    "Maybe we need some space...",
  ],
};

export default function LoveShackPage() {
  const [currentVibe, setCurrentVibe] = useState<VibeType>("romantic");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<"islander1" | "islander2" | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const [sp1, setSp1] = useState(2450);
  const [sp2, setSp2] = useState(1890);
  const [winner, setWinner] = useState<"islander1" | "islander2" | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);

  const router = useRouter();

  // Add initial message
  useEffect(() => {
    const initialMessage: Message = {
      id: Date.now(),
      sender: "islander1" as const,
      text: "Hey there! Ready to chat? 💖",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([initialMessage]);
  }, []);

  // Function to generate a new message
  const generateNewMessage = async () => {
    if (!isActive || timeLeft <= 0) return;

    const lastMessage = messages[messages.length - 1];
    const nextSender =
      lastMessage.sender === "islander1" ? "islander2" : "islander1";

    // Show typing indicator
    setIsTyping(nextSender);

    try {
      // Simulate typing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!isActive || timeLeft <= 0) {
        setIsTyping(null);
        return;
      }

      // Get message from API
      const response = await fetch("/api/chat-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentVibe,
          lastMessageSender: lastMessage.sender,
        }),
      });

      const data = await response.json();

      // Update messages and vibe
      setMessages((prev) => [...prev, data.message]);
      if (data.newVibe !== currentVibe) {
        setCurrentVibe(data.newVibe);
      }
      setIsTyping(null);

      // Schedule next message
      timeoutRef.current = setTimeout(generateNewMessage, 1500);
    } catch (error) {
      console.error("Failed to generate message:", error);
      setIsTyping(null);
    }
  };

  // Start chat simulation
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      generateNewMessage();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, timeLeft]);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && isActive) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !winner) {
      setIsActive(false);
      setIsTyping(null);
      const randomWinner = Math.random() > 0.5 ? "islander1" : "islander2";
      setWinner(randomWinner);

      if (randomWinner === "islander1") {
        setSp1((prev) => prev + 100);
        setSp2((prev) => prev - 50);
      } else {
        setSp1((prev) => prev - 50);
        setSp2((prev) => prev + 100);
      }
    }
  }, [timeLeft, winner, isActive]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const renderIcon = (
    IconComponent: typeof Heart,
    className = "w-4 h-4 text-white"
  ) => {
    return <IconComponent className={className} />;
  };

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
        <div className="absolute inset-0 bg-black/10" />
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden">
            {/* Sleek Header */}
            <div className="bg-pink-500 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <h1 className="font-title text-xl text-white">Love Shack</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
                  <span className="text-white text-xs font-title">Time:</span>
                  <span
                    className={cn(
                      "text-white text-xs font-title",
                      timeLeft <= 10 && "text-red-200 animate-pulse"
                    )}
                  >
                    {timeLeft}s
                  </span>
                </div>
                <motion.div
                  key={currentVibe}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "px-3 py-1 rounded-full flex items-center gap-1.5",
                    "bg-gradient-to-r shadow-sm",
                    VIBES[currentVibe].gradient
                  )}
                >
                  {renderIcon(VIBES[currentVibe].icon, "w-3 h-3 text-white")}
                  <span className="text-white text-xs font-title">
                    {VIBES[currentVibe].label}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Chat Container */}
            <div className="flex flex-col h-[500px]">
              {/* Participants */}
              <div className="flex items-center justify-between px-6 py-3 bg-white">
                {/* Islander 1 */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-200">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        width={40}
                        height={40}
                        alt="Islander 1"
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />
                  </div>
                  <div>
                    <p className="font-title text-sm text-gray-800">Sarah</p>
                    <motion.p
                      key={sp1}
                      initial={{ scale: 1 }}
                      animate={
                        winner === "islander1" ? { scale: [1, 1.2, 1] } : {}
                      }
                      className="font-display text-xs text-gray-500"
                    >
                      <span className="text-pink-500">SP:</span>{" "}
                      <span
                        className={cn(
                          winner === "islander1"
                            ? "text-green-600"
                            : winner === "islander2"
                              ? "text-red-600"
                              : "text-gray-600"
                        )}
                      >
                        {sp1}
                      </span>
                    </motion.p>
                  </div>
                </div>

                {/* VS */}
                <div className="bg-gray-100 rounded-full px-3 py-1">
                  <span className="font-title text-sm text-gray-600">VS</span>
                </div>

                {/* Islander 2 */}
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-title text-sm text-gray-800 text-right">
                      Mike
                    </p>
                    <motion.p
                      key={sp2}
                      initial={{ scale: 1 }}
                      animate={
                        winner === "islander2" ? { scale: [1, 1.2, 1] } : {}
                      }
                      className="font-display text-xs text-gray-500 text-right"
                    >
                      <span className="text-pink-500">SP:</span>{" "}
                      <span
                        className={cn(
                          winner === "islander2"
                            ? "text-green-600"
                            : winner === "islander1"
                              ? "text-red-600"
                              : "text-gray-600"
                        )}
                      >
                        {sp2}
                      </span>
                    </motion.p>
                  </div>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-200">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        width={40}
                        height={40}
                        alt="Islander 2"
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white" />
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 scroll-smooth bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "islander2"
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-xl p-3 shadow-sm",
                        message.sender === "islander2"
                          ? cn(
                              "bg-gradient-to-r text-white rounded-br-none",
                              VIBES[currentVibe].gradient
                            )
                          : cn(
                              "bg-white rounded-bl-none",
                              "border",
                              "border-gray-200"
                            )
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm font-title",
                          message.sender === "islander2"
                            ? "text-white"
                            : "text-gray-800"
                        )}
                      >
                        {message.text}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] text-right mt-1 font-display",
                          message.sender === "islander2"
                            ? "text-white/70"
                            : "text-gray-400"
                        )}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div
                    className={cn(
                      "flex gap-2 items-center",
                      isTyping === "islander2" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className="bg-gray-200 rounded-full px-3 py-1.5 flex items-center gap-2">
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

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {winner && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full"
                >
                  <h2 className="font-title text-2xl text-center text-gray-800 mb-6">
                    Time's Up!
                  </h2>

                  <div className="flex items-center justify-between mb-8">
                    {/* Islander 1 Result */}
                    <div className="text-center">
                      <div className="relative mb-2">
                        <div
                          className={cn(
                            "w-16 h-16 rounded-full overflow-hidden border-2 shadow-md mx-auto",
                            winner === "islander1"
                              ? "border-green-400"
                              : "border-red-400"
                          )}
                        >
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            width={64}
                            height={64}
                            alt="Islander 1"
                            className="object-cover"
                          />
                        </div>
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className={cn(
                            "absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-title",
                            winner === "islander1"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          )}
                        >
                          {winner === "islander1" ? "+100" : "-50"}
                        </motion.div>
                      </div>
                      <p className="font-title text-sm text-gray-800">Sarah</p>
                    </div>

                    {/* Result Indicator */}
                    <div className="flex flex-col items-center">
                      <div className="font-title text-lg text-pink-500 mb-1">
                        Winner!
                      </div>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"></div>
                    </div>

                    {/* Islander 2 Result */}
                    <div className="text-center">
                      <div className="relative mb-2">
                        <div
                          className={cn(
                            "w-16 h-16 rounded-full overflow-hidden border-2 shadow-md mx-auto",
                            winner === "islander2"
                              ? "border-green-400"
                              : "border-red-400"
                          )}
                        >
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            width={64}
                            height={64}
                            alt="Islander 2"
                            className="object-cover"
                          />
                        </div>
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className={cn(
                            "absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-title",
                            winner === "islander2"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          )}
                        >
                          {winner === "islander2" ? "+100" : "-50"}
                        </motion.div>
                      </div>
                      <p className="font-title text-sm text-gray-800">Mike</p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push("/island")}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-title text-sm shadow-sm hover:from-pink-600 hover:to-purple-600 transition-colors"
                  >
                    Return to Island
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
