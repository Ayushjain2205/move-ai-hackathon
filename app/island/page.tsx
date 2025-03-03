"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Flame, Music, Users, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiveFeedDrawer } from "@/components/live-feed-drawer";
import { useImageLoading } from "@/hooks/useImageLoading";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/client";
const LOCATIONS = [
  {
    name: "Love Shack",
    description:
      "💖 Social Hub - Connect with other islanders and build relationships",
    icon: Heart,
    href: "/island/love-shack",
    color: "from-pink-400 to-red-400",
  },
  {
    name: "Challenge Arena",
    description: "🔥 Daily competitions and dramatic moments await",
    icon: Flame,
    href: "/island/arena",
    color: "from-orange-400 to-red-400",
  },
  {
    name: "Sunset Club",
    description: "🎉 Party and mingle with other islanders",
    icon: Music,
    href: "/island/club",
    color: "from-purple-400 to-pink-400",
  },
  {
    name: "Arrival Dock",
    description: "🌊 Welcome new islanders to paradise",
    icon: Users,
    href: "/island/arrival-dock",
    color: "from-indigo-400 to-purple-400",
  },
  {
    name: "The Retreat",
    description: "🏖️ Your personal space to manage your islander profile",
    icon: User,
    href: "/island/retreat",
    color: "from-blue-400 to-indigo-400",
  },
  {
    name: "Trading Post",
    description: "🛒 Trade and collect unique NFT items",
    icon: ShoppingBag,
    href: "/island/trading",
    color: "from-teal-400 to-blue-400",
  },
];

export default function IslandPage() {
  const { imageLoaded, handleImageLoad } = useImageLoading("/island.png");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient shown while image is loading */}
      {!imageLoaded && (
        <div className="fixed inset-0 bg-gradient-to-b from-indigo-500 to-purple-600 z-0" />
      )}

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/island.png"
          alt="Tropical island sunset"
          fill
          className="object-cover object-center"
          priority
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
      </div>

      {/* Live Feed Drawer */}
      <LiveFeedDrawer />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="pt-8 px-6 text-center">
          <h1 className="font-title text-4xl text-white drop-shadow-glow">
            Welcome to Paradise
          </h1>
          <p className="font-handwritten text-xl text-white/90 mt-2">
            explore the island
          </p>
          <div className="absolute top-4 right-4">
            <ConnectButton client={client} />
          </div>
        </header>

        {/* Location Grid */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {LOCATIONS.map((location) => (
              <Link
                key={location.name}
                href={location.href}
                className="group relative flex flex-col items-center"
              >
                {/* Location Icon */}
                <div
                  className={cn(
                    "relative w-24 h-24 rounded-2xl overflow-hidden",
                    "transform transition-all duration-300 ease-out",
                    "group-hover:scale-105 group-hover:-translate-y-1",
                    "group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]",
                    "border-2 border-white/20"
                  )}
                >
                  {/* Icon Background */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br",
                      location.color,
                      "opacity-90 backdrop-blur-sm"
                    )}
                  />

                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <location.icon
                      className="w-12 h-12 text-white drop-shadow-glow 
                                transform transition-transform duration-300 
                                group-hover:scale-110"
                    />
                  </div>

                  {/* Hover Glow Effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300"
                  >
                    <div className="absolute inset-0 bg-white/10" />
                  </div>
                </div>

                {/* Location Name */}
                <h3
                  className="mt-3 font-display text-lg text-white
                             tracking-wide text-center leading-tight
                             drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                >
                  {location.name}
                </h3>

                {/* Hover Tooltip */}
                <div
                  className="absolute top-full mt-2 opacity-0 translate-y-2 
                              group-hover:opacity-100 group-hover:translate-y-0
                              transition-all duration-200 pointer-events-none z-50"
                >
                  <div
                    className="w-48 bg-white/90 backdrop-blur-sm rounded-lg p-2.5
                                shadow-lg"
                  >
                    <p className="text-sm text-gray-700 font-body text-center">
                      {location.description}
                    </p>
                  </div>
                  {/* Tooltip Arrow */}
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 
                                border-8 border-transparent border-b-white/90"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
