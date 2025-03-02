"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isActive, setIsActive] = useState(true);

  const [sp1, setSp1] = useState(2450);
  const [sp2, setSp2] = useState(1890);
  const [winner, setWinner] = useState<"islander1" | "islander2" | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const lastSenderRef = useRef<"islander1" | "islander2">("islander1");
  const timeLeftRef = useRef(timeLeft);

  // Update timeLeftRef when timeLeft changes
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Add initial message
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: "islander1",
        text: "Hey there! Ready to chat? 💖",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Main chat logic
  useEffect(() => {
    console.log("Chat effect running, isActive:", isActive);

    if (!isActive) {
      console.log("Chat effect stopped - inactive");
      return;
    }

    let isComponentMounted = true;

    const addMessage = () => {
      if (!isComponentMounted || timeLeftRef.current === 0) return;

      const sender: "islander1" | "islander2" =
        lastSenderRef.current === "islander1" ? "islander2" : "islander1";

      console.log("Setting typing indicator for:", sender);
      setIsTyping(sender);

      setTimeout(() => {
        if (!isComponentMounted || timeLeftRef.current === 0) {
          setIsTyping(null);
          return;
        }

        console.log("Adding new message from:", sender);
        const newMessage: Message = {
          id: Date.now(),
          sender,
          text: CONVERSATIONS[currentVibe][
            Math.floor(Math.random() * CONVERSATIONS[currentVibe].length)
          ],
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setIsTyping(null);
        lastSenderRef.current = sender;

        // Maybe change vibe
        if (Math.random() < 0.2) {
          const vibes = Object.keys(VIBES) as VibeType[];
          const newVibe = vibes[Math.floor(Math.random() * vibes.length)];
          setCurrentVibe(newVibe);
        }
      }, 1000);
    };

    console.log("Setting up message interval");
    const interval = setInterval(addMessage, 2500);

    // Trigger first message immediately
    addMessage();

    return () => {
      console.log("Cleaning up chat effect");
      isComponentMounted = false;
      clearInterval(interval);
    };
  }, [isActive, currentVibe]); // Removed timeLeft from dependencies

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0) {
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
  }, [timeLeft, winner]);

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
          {/* Avatars and VS Badge */}
          <div className="flex items-center justify-between mb-4">
            {/* Islander 1 Avatar */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/50 shadow-lg">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    width={64}
                    height={64}
                    alt="Islander 1"
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="font-display text-sm text-white drop-shadow-md">
                  Sarah
                </p>
                <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <motion.p
                    key={sp1}
                    initial={{ scale: 1 }}
                    animate={
                      winner === "islander1" ? { scale: [1, 1.2, 1] } : {}
                    }
                    className="font-display text-xs text-white/90"
                  >
                    <span className="text-pink-300">SP:</span>{" "}
                    <span
                      className={cn(
                        winner === "islander1"
                          ? "text-green-400"
                          : winner === "islander2"
                          ? "text-red-400"
                          : "text-white"
                      )}
                    >
                      {sp1}
                    </span>
                  </motion.p>
                </div>
              </div>
            </div>

            {/* VS Badge */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-full p-4 shadow-lg border-2 border-white/20">
                  <span className="font-title text-2xl text-white drop-shadow-glow">
                    VS
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
              </div>
            </div>

            {/* Islander 2 Avatar */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/50 shadow-lg">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    width={64}
                    height={64}
                    alt="Islander 2"
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="font-display text-sm text-white drop-shadow-md">
                  Mike
                </p>
                <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <motion.p
                    key={sp2}
                    initial={{ scale: 1 }}
                    animate={
                      winner === "islander2" ? { scale: [1, 1.2, 1] } : {}
                    }
                    className="font-display text-xs text-white/90"
                  >
                    <span className="text-pink-300">SP:</span>{" "}
                    <span
                      className={cn(
                        winner === "islander2"
                          ? "text-green-400"
                          : winner === "islander1"
                          ? "text-red-400"
                          : "text-white"
                      )}
                    >
                      {sp2}
                    </span>
                  </motion.p>
                </div>
              </div>
            </div>
          </div>

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
              <div className="ml-4 font-display text-sm">
                <span
                  className={cn(
                    "text-white/70",
                    timeLeft <= 10 && "text-red-400 animate-pulse"
                  )}
                >
                  {timeLeft}s
                </span>
              </div>
            </div>

            {winner && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-8"
                >
                  {/* Islander 1 Result */}
                  <div className="text-center">
                    <div className="relative mb-2">
                      <div
                        className={cn(
                          "w-20 h-20 rounded-full overflow-hidden border-4 shadow-lg",
                          winner === "islander1"
                            ? "border-green-400"
                            : "border-red-400"
                        )}
                      >
                        <Image
                          src="/placeholder.svg?height=80&width=80"
                          width={80}
                          height={80}
                          alt="Islander 1"
                          className="object-cover"
                        />
                      </div>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className={cn(
                          "absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm font-display",
                          winner === "islander1"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        )}
                      >
                        {winner === "islander1" ? "+100" : "-50"}
                      </motion.div>
                    </div>
                    <p className="font-display text-lg text-white">Sarah</p>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="font-title text-xl text-white">
                      Time's Up!
                    </div>
                    <div className="font-display text-sm text-white/80">VS</div>
                  </div>

                  {/* Islander 2 Result */}
                  <div className="text-center">
                    <div className="relative mb-2">
                      <div
                        className={cn(
                          "w-20 h-20 rounded-full overflow-hidden border-4 shadow-lg",
                          winner === "islander2"
                            ? "border-green-400"
                            : "border-red-400"
                        )}
                      >
                        <Image
                          src="/placeholder.svg?height=80&width=80"
                          width={80}
                          height={80}
                          alt="Islander 2"
                          className="object-cover"
                        />
                      </div>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className={cn(
                          "absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm font-display",
                          winner === "islander2"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        )}
                      >
                        {winner === "islander2" ? "+100" : "-50"}
                      </motion.div>
                    </div>
                    <p className="font-display text-lg text-white">Mike</p>
                  </div>
                </motion.div>
              </motion.div>
            )}

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
                          : cn(
                              "bg-white/90 rounded-bl-none",
                              "border-2",
                              "border-transparent",
                              "bg-gradient-to-br from-white/90 to-white/95"
                            )
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm",
                          message.sender === "islander2"
                            ? "text-white"
                            : cn(
                                "bg-gradient-to-br bg-clip-text text-transparent",
                                VIBES[currentVibe].gradient
                              )
                        )}
                      >
                        {message.text}
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
