"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Coins, ShoppingBag, Sparkles } from "lucide-react";
import { useImageLoading } from "@/hooks/useImageLoading";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "him" | "her" | "both";
  type: "clothing" | "accessory" | "emote" | "background";
}

const SHOP_ITEMS: ShopItem[] = [
  // For Him
  {
    id: "swim-trunks",
    name: "Beach Ready Swim Trunks",
    description: "Perfect for those sunset beach walks",
    price: 500,
    image: "/placeholder.svg?height=400&width=400",
    category: "him",
    type: "clothing",
  },
  {
    id: "summer-shirt",
    name: "Tropical Paradise Shirt",
    description: "Stand out with this vibrant summer pattern",
    price: 450,
    image: "/placeholder.svg?height=400&width=400",
    category: "him",
    type: "clothing",
  },
  {
    id: "sunglasses-m",
    name: "Cool Guy Shades",
    description: "Keep it mysterious with these stylish sunglasses",
    price: 300,
    image: "/placeholder.svg?height=400&width=400",
    category: "him",
    type: "accessory",
  },
  {
    id: "surf-emote",
    name: "Surf's Up Emote",
    description: "Show off your beach skills",
    price: 750,
    image: "/placeholder.svg?height=400&width=400",
    category: "him",
    type: "emote",
  },

  // For Her
  {
    id: "summer-dress",
    name: "Sunset Breeze Dress",
    description: "Flutter in the warm island breeze",
    price: 600,
    image: "/placeholder.svg?height=400&width=400",
    category: "her",
    type: "clothing",
  },
  {
    id: "beach-hat",
    name: "Elegant Sun Hat",
    description: "Stay stylish while staying sun-safe",
    price: 350,
    image: "/placeholder.svg?height=400&width=400",
    category: "her",
    type: "accessory",
  },
  {
    id: "sandals",
    name: "Crystal Beach Sandals",
    description: "Sparkle with every step",
    price: 400,
    image: "/placeholder.svg?height=400&width=400",
    category: "her",
    type: "clothing",
  },
  {
    id: "dance-emote",
    name: "Beach Party Dance",
    description: "Show off your best moves",
    price: 750,
    image: "/placeholder.svg?height=400&width=400",
    category: "her",
    type: "emote",
  },

  // For Both
  {
    id: "beach-background",
    name: "Private Beach Background",
    description: "Your own slice of paradise",
    price: 1000,
    image: "/placeholder.svg?height=400&width=400",
    category: "both",
    type: "background",
  },
  {
    id: "couple-emote",
    name: "Romantic Dance Emote",
    description: "Perfect for those special moments",
    price: 1200,
    image: "/placeholder.svg?height=400&width=400",
    category: "both",
    type: "emote",
  },
];

type CategoryFilter = "all" | "him" | "her" | "both";
type TypeFilter = "all" | "clothing" | "accessory" | "emote" | "background";

export default function TradingPostPage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const { imageLoaded, handleImageLoad } = useImageLoading(
    "/places/trading-post.png"
  );

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter)
      return false;
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    return true;
  });

  const handlePurchase = (itemId: string) => {
    setPurchasing(itemId);
    // Simulate purchase
    setTimeout(() => {
      setPurchasing(null);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient shown while image is loading */}
      {!imageLoaded && (
        <div className="fixed inset-0 bg-gradient-to-b from-teal-500 to-blue-600 z-0" />
      )}

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/places/trading-post.png"
          alt="Trading post background"
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
                <ShoppingBag className="w-6 h-6 text-white" />
                <h1 className="font-title text-2xl text-white">Trading Post</h1>
              </div>
              <p className="font-handwritten text-lg text-white/90 mt-1">
                upgrade your island style
              </p>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-white/10">
              <div className="space-y-3">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  {(["all", "him", "her", "both"] as const).map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border-2 transition-all duration-200",
                        "font-display text-xs",
                        categoryFilter === category
                          ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-white"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                      )}
                    >
                      <span className="text-white capitalize">
                        {category === "all" ? "All Items" : `For ${category}`}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Type Filters */}
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "all",
                      "clothing",
                      "accessory",
                      "emote",
                      "background",
                    ] as const
                  ).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border-2 transition-all duration-200",
                        "font-display text-xs",
                        typeFilter === type
                          ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-white"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                      )}
                    >
                      <span className="text-white capitalize">
                        {type === "all" ? "All Types" : type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="h-[400px] overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group"
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
                        {/* Item Image */}
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                          {/* Category Badge */}
                          <div className="absolute top-2 right-2">
                            <div className="bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/20">
                              <span className="text-white text-[10px] font-display capitalize">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="p-3">
                          <h3 className="font-display text-sm text-white mb-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-white/70 text-xs mb-3 line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div
                              className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 
                border border-pink-500/30 rounded-full px-2 py-0.5
                flex items-center gap-1"
                            >
                              <Coins className="w-3 h-3 text-pink-400" />
                              <span className="font-display text-sm text-white">
                                {item.price}
                              </span>
                            </div>
                            <Button
                              onClick={() => handlePurchase(item.id)}
                              disabled={purchasing === item.id}
                              size="sm"
                              className="h-7 text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white 
                                       border border-white/20 hover:from-pink-600 hover:to-purple-600"
                            >
                              {purchasing === item.id ? (
                                <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  Buy
                                  <Sparkles className="w-3 h-3 ml-1" />
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
