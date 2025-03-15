"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Heart,
  Star,
  Gift,
  Crown,
} from "lucide-react";
import { useImageLoading } from "@/hooks/useImageLoading";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "him" | "her" | "both" | "gift";
  type: "clothing" | "accessory" | "emote" | "background" | "gift";
  popular?: boolean;
  new?: boolean;
}

const SHOP_ITEMS: ShopItem[] = [
  // Gifts
  {
    id: "friendship-bracelet",
    name: "Friendship Bracelet",
    description: "Glows with daily affirmations, changes color with mood",
    price: 100,
    image: "/gifts/bracelet.png",
    category: "gift",
    type: "gift",
    popular: true,
  },
  {
    id: "crown-of-excellence",
    name: "Crown of Excellence",
    description: "Virtual flowers grow with achievements",
    price: 200,
    image: "/gifts/crown.png",
    category: "gift",
    type: "gift",
  },
  {
    id: "dream-catcher",
    name: "Dream Catcher",
    description: "Displays weekly goals achieved",
    price: 300,
    image: "/gifts/dreamcatcher.png",
    category: "gift",
    type: "gift",
  },
  {
    id: "hat-of-empathy",
    name: "Hat of Empathy",
    description: "Interacts with Maya, provides encouragement",
    price: 400,
    image: "/gifts/hat.png",
    category: "gift",
    type: "gift",
  },
  {
    id: "hoodie",
    name: "Hoodie",
    description: "Stores achievements, creates visual timeline",
    price: 500,
    image: "/gifts/hoodie.png",
    category: "gift",
    type: "gift",
  },
  {
    id: "locket-of-love",
    name: "Locket of Love",
    description: "Shows affirmations, creates fun selfie filters",
    price: 600,
    image: "/gifts/locket.png",
    category: "gift",
    type: "gift",
    new: true,
  },
  {
    id: "enchanted-mirror",
    name: "Enchanted Mirror",
    description: "Customizable, changes with accomplishments",
    price: 700,
    image: "/gifts/mirror.png",
    category: "gift",
    type: "gift",
  },
  {
    id: "makeup-box",
    name: "Makeup Box",
    description: "Personal star map growing with achievements",
    price: 800,
    image: "/gifts/makeupbox.png",
    category: "gift",
    type: "gift",
  },
  {
    id: "ring-of-friendship",
    name: "Ring of Friendship",
    description: "Stores memories, creates surprise celebrations",
    price: 900,
    image: "/gifts/ring.png",
    category: "gift",
    type: "gift",
    new: true,
  },
  {
    id: "sunglasses",
    name: "Sunglasses",
    description: "Customizable, changes with accomplishments",
    price: 1000,
    image: "/gifts/sunglasses.png",
    category: "gift",
    type: "gift",
  },

  // For Him
  {
    id: "swim-trunks",
    name: "Bracelet",
    description: "Perfect for those sunset beach walks",
    price: 500,
    image: "/placeholder.svg?height=400&width=400",
    category: "him",
    type: "clothing",
    popular: true,
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
    new: true,
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
    popular: true,
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
    new: true,
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
    popular: true,
  },
  {
    id: "couple-emote",
    name: "Romantic Dance Emote",
    description: "Perfect for those special moments",
    price: 1200,
    image: "/placeholder.svg?height=400&width=400",
    category: "both",
    type: "emote",
    new: true,
  },
];

type CategoryFilter = "all" | "him" | "her" | "both" | "gift";
type TypeFilter =
  | "all"
  | "clothing"
  | "accessory"
  | "emote"
  | "background"
  | "gift";

export default function TradingPostPage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [heartBalance] = useState(5000);
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
        className="fixed top-4 left-4 z-20 bg-white/30 backdrop-blur-sm rounded-full p-2 
                border-2 border-white/40 shadow-lg hover:bg-white/40 transition-all duration-200
                hover:scale-105 transform"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 flex items-center justify-between border-b border-white/30">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-white" />
                <h1 className="font-title text-2xl text-white">Island Shop</h1>
              </div>
              <div className="bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 border border-white/40">
                <Heart className="w-5 h-5 text-pink-200" />
                <span className="font-title text-white text-lg">
                  {heartBalance}
                </span>
              </div>
            </div>

            {/* Filters - Single Row */}
            <div className="p-3 bg-white/15 border-b border-white/20">
              <div className="flex items-center justify-between">
                {/* Category Filters */}
                <div className="flex items-center gap-1.5">
                  {(["all", "gift", "him", "her", "both"] as const).map(
                    (category) => (
                      <button
                        key={category}
                        onClick={() => setCategoryFilter(category)}
                        className={cn(
                          "px-2 py-1 rounded-lg transition-all duration-200",
                          "font-title text-xs border",
                          categoryFilter === category
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 border-white text-white"
                            : "bg-white/20 border-white/30 hover:bg-white/30 text-white"
                        )}
                      >
                        {category === "all"
                          ? "All"
                          : category === "gift"
                            ? "Gifts"
                            : category}
                      </button>
                    )
                  )}
                </div>

                {/* Type Filters */}
                <div className="flex items-center gap-1.5">
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
                        "px-2 py-1 rounded-lg transition-all duration-200",
                        "font-title text-xs border",
                        typeFilter === type
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 border-white text-white"
                          : "bg-white/20 border-white/30 hover:bg-white/30 text-white"
                      )}
                    >
                      <span className="capitalize">
                        {type === "all" ? "All" : type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="h-[500px] overflow-y-auto p-3 bg-white/10">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group"
                    >
                      <div className="rounded-xl overflow-hidden border border-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-sm">
                        {/* Item Image */}
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                          {/* Badges */}
                          <div className="absolute top-1 left-1 flex gap-1">
                            {item.popular && (
                              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-1 py-0.5 rounded-full border border-white/40">
                                <div className="flex items-center gap-0.5">
                                  <Star className="w-2 h-2 text-white" />
                                  <span className="text-white text-[8px] font-title">
                                    Hot
                                  </span>
                                </div>
                              </div>
                            )}
                            {item.new && (
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-1 py-0.5 rounded-full border border-white/40">
                                <div className="flex items-center gap-0.5">
                                  <Sparkles className="w-2 h-2 text-white" />
                                  <span className="text-white text-[8px] font-title">
                                    New
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Item Type Icon */}
                          <div className="absolute bottom-1 left-1">
                            <div className="bg-white/30 backdrop-blur-[2px] p-1 rounded-full border border-white/40">
                              {item.type === "clothing" && (
                                <Crown className="w-2.5 h-2.5 text-white" />
                              )}
                              {item.type === "accessory" && (
                                <Star className="w-2.5 h-2.5 text-white" />
                              )}
                              {item.type === "emote" && (
                                <Gift className="w-2.5 h-2.5 text-white" />
                              )}
                              {item.type === "background" && (
                                <Sparkles className="w-2.5 h-2.5 text-white" />
                              )}
                              {item.type === "gift" && (
                                <Gift className="w-2.5 h-2.5 text-white" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Item Details - White Background */}
                        <div className="p-1.5 bg-white">
                          <h3 className="font-title text-xs text-gray-800 mb-0.5 truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-[10px] font-body mb-1.5 line-clamp-1">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div
                              className="bg-pink-100 
                                      border border-pink-300 rounded-full px-1.5 py-0.5
                                      flex items-center gap-0.5"
                            >
                              <Heart className="w-2.5 h-2.5 text-pink-500" />
                              <span className="font-title text-[10px] text-pink-700">
                                {item.price}
                              </span>
                            </div>
                            <Button
                              onClick={() => handlePurchase(item.id)}
                              disabled={purchasing === item.id}
                              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white 
                                     border border-white/30 hover:from-pink-600 hover:to-purple-600
                                     font-title px-1.5 py-0 h-5 text-[10px]"
                            >
                              {purchasing === item.id ? (
                                <div className="h-2.5 w-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  Buy
                                  <Sparkles className="w-2 h-2 ml-0.5" />
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
