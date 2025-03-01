"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Event {
  id: number;
  type: "gossip" | "drama" | "challenge" | "romance";
  user: string;
  content: string;
  timestamp: string;
  emoji: string;
}

const SAMPLE_EVENTS: Event[] = [
  {
    id: 1,
    type: "gossip",
    user: "Island Host",
    content:
      "Secret couple alert at the Love Shack! Someone's been sneaking around... 👀",
    timestamp: "Just now",
    emoji: "🌶️",
  },
  {
    id: 2,
    type: "drama",
    user: "Sarah",
    content: "Did you see what happened at the pool? Tea time!",
    timestamp: "2m ago",
    emoji: "☕️",
  },
  {
    id: 3,
    type: "challenge",
    user: "Mike",
    content: "New challenge starting in 5 minutes! Get ready islanders!",
    timestamp: "5m ago",
    emoji: "🏆",
  },
  {
    id: 4,
    type: "romance",
    user: "Emma",
    content: "Two islanders were spotted holding hands at sunset!",
    timestamp: "10m ago",
    emoji: "💖",
  },
];

export function LiveFeedDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>(SAMPLE_EVENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent: Event = {
        id: Date.now(),
        type: "gossip",
        user: `Islander${Math.floor(Math.random() * 100)}`,
        content: "Just spilled some major tea! 👀",
        timestamp: "Just now",
        emoji: "🌶️",
      };
      setEvents((prev) => [newEvent, ...prev.slice(0, 8)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed left-0 top-1/2 -translate-y-1/2 z-30",
          "bg-gradient-to-b from-pink-500 to-purple-500",
          "p-3 rounded-r-xl",
          "border-2 border-white/20",
          "shadow-lg backdrop-blur-sm",
          "transition-all duration-200",
          "hover:translate-x-1 hover:scale-105",
          "group",
          isOpen && "opacity-0"
        )}
      >
        <div className="flex flex-col items-center gap-1">
          {/* Icon Container with Glow Effect */}
          <div
            className="relative w-12 h-12 rounded-full overflow-hidden 
                         bg-gradient-to-br from-white/20 to-transparent
                         border-2 border-white/30
                         group-hover:scale-110 transform transition-all duration-200
                         flex items-center justify-center"
          >
            <span className="text-3xl">🌶️</span>
            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div
                className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] 
                            bg-gradient-to-r from-transparent via-white/20 to-transparent
                            transition-transform duration-1000"
              />
            </div>
          </div>

          {/* Text with Bounce Animation */}
          <div className="flex flex-col items-center">
            <span
              className="font-display text-sm text-white whitespace-nowrap 
                           drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            >
              Gossip Corner
            </span>
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>

          {/* Notification Dot */}
          <span
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full 
                         animate-pulse border border-white/50"
          />
        </div>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-0 top-0 bottom-0 w-80 z-50"
          >
            <div
              className="h-full bg-gradient-to-b from-pink-400/90 to-purple-500/90 backdrop-blur-md 
                        border-r-2 border-white/30 shadow-xl"
            >
              {/* Header */}
              <div className="p-4 bg-black/20 border-b-2 border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl animate-bounce-slow">🌶️</div>
                    <div>
                      <h2 className="font-title text-xl text-white">
                        Gossip Corner
                      </h2>
                      <p className="font-handwritten text-sm text-white/80">
                        hot island tea ☕️
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 rounded-full" />
              </div>

              {/* Events Feed */}
              <div className="p-4 space-y-4 h-[calc(100vh-4rem)] overflow-y-auto">
                <AnimatePresence>
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white/30 rounded-xl p-3 backdrop-blur-sm 
                               border-2 border-white/30 shadow-lg
                               hover:bg-white/40 hover:scale-[1.02] 
                               transform transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl group-hover:scale-110 transform transition-transform duration-200">
                          {event.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-white text-sm">
                            <span className="font-semibold">{event.user}</span>{" "}
                            <span className="text-white">{event.content}</span>
                          </p>
                          <p className="text-xs text-white/70 font-handwritten mt-1">
                            {event.timestamp}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
