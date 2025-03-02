"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Heart,
  PartyPopperIcon as Party,
  Flame,
  Coffee,
  Frown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    const interval = setInterval(() => {
      const sender = Math.random() > 0.5 ? "islander1" : "islander2";
      setIsTyping(sender);

      setTimeout(() => {
        const newMessage: Message = {
          id: Date.now(),
          sender,
          text: CONVERSATIONS[currentVibe][
            Math.floor(Math.random() * CONVERSATIONS[currentVibe].length)
          ],
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        };

        setMessages((prev) => [...prev.slice(-4), newMessage]);
        setIsTyping(null);

        if (Math.random() < 0.2) {
          const vibes = Object.keys(VIBES) as VibeType[];
          const newVibe = vibes[Math.floor(Math.random() * vibes.length)];
          setCurrentVibe(newVibe);
        }
      }, 1500);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentVibe]);

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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Islander 1 Avatar */}
          <motion.div
            initial={{ scale: 0, x: -50 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="absolute left-4 top-4"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/50 shadow-lg">
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  width={80}
                  height={80}
                  alt="Islander 1"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
            </div>
          </motion.div>

          {/* Islander 2 Avatar */}
          <motion.div
            initial={{ scale: 0, x: 50 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="absolute right-4 bottom-4"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/50 shadow-lg">
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  width={80}
                  height={80}
                  alt="Islander 2"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
            </div>
          </motion.div>

          {/* Chat Container with Compact Vibe Meter */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden">
            {/* Compact Vibe Meter */}
            <div className="h-12 border-b border-white/20 bg-black/20 flex items-center px-4 gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-white/70 text-sm font-display">
                  Vibe:
                </span>
                <motion.div
                  key={currentVibe}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "px-3 py-1 rounded-full flex items-center gap-1.5",
                    "bg-gradient-to-r shadow-lg",
                    VIBES[currentVibe].gradient
                  )}
                >
                  {renderIcon(VIBES[currentVibe].icon)}
                  <span className="text-white text-sm font-display">
                    {VIBES[currentVibe].label}
                  </span>
                </motion.div>
              </div>

              {/* Mini Vibe Icons */}
              <div className="flex gap-2 ml-auto">
                {Object.entries(VIBES).map(([key, vibe]) => (
                  <div
                    key={key}
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                      currentVibe === key
                        ? cn(
                            "bg-gradient-to-br shadow-lg scale-110",
                            vibe.gradient
                          )
                        : "bg-white/10"
                    )}
                  >
                    {renderIcon(
                      vibe.icon,
                      cn(
                        "w-3 h-3",
                        currentVibe === key ? "text-white" : "text-white/40"
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="h-[400px] p-4 overflow-y-auto space-y-4 scroll-smooth">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={cn(
                      "flex",
                      message.sender === "islander2"
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-xl p-3 shadow-md backdrop-blur-sm",
                        message.sender === "islander2"
                          ? cn(
                              "bg-gradient-to-br text-white rounded-br-none",
                              VIBES[currentVibe].gradient,
                              "shadow-lg"
                            )
                          : "bg-white/90 text-gray-800 rounded-bl-none"
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.sender === "islander2"
                            ? "text-white/70"
                            : "text-gray-500"
                        )}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Positioned Typing Indicators */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-2 items-center",
                    isTyping === "islander2" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span
                        className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                    <span className="text-xs font-display text-white/70">
                      typing...
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Invisible div for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
