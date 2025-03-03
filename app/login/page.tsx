"use client";

import { useEffect, useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { GameTitle } from "@/components/game-title";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConnectEmbed } from "thirdweb/react";
import { client } from "@/lib/client";
import { defineChain } from "thirdweb";

export default function LandingPage() {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleConnect = (wallet: any) => {
    console.log("Wallet connected:", wallet);
    router.push("/island");
  };

  const chain = defineChain({
    id: 1313161641,
    rpc: "https://0x4e4541a9.rpc.aurora-cloud.dev",
    nativeCurrency: {
      name: "Love.ai",
      symbol: "AURORA",
      decimals: 18,
    },
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient shown while image is loading */}
      {!imageLoaded && (
        <div className="fixed inset-0 bg-gradient-to-b from-pink-400 to-purple-600 z-0" />
      )}
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/bg.png"
          alt="Tropical paradise background"
          fill
          className="object-cover object-center"
          priority
          onLoad={() => setImageLoaded(true)}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
      </div>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-10 left-10 animate-float-slow">
          <Heart className="w-12 h-12 text-pink-300 drop-shadow-glow" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float">
          <Sparkles className="w-10 h-10 text-yellow-300 drop-shadow-glow" />
        </div>
      </div>
      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="mb-2">
          {/* <GameTitle /> */}
          <div className=" max-w-full">
            <ConnectEmbed
              client={client}
              style={{
                borderRadius: "12px",
                backgroundColor: "white",
              }}
              onConnect={handleConnect}
              showAllWallets={true}
              autoConnect={false}
              theme="light"
              chains={[chain]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
