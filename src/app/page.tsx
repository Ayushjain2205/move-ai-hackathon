"use client";

import { useEffect, useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { GameTitle } from "@/components/GameTitle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WalletSelector } from "@/components/wallet/WalletSelector";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function LandingPage() {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { connected } = useWallet();

  useEffect(() => {
    if (connected) {
      router.push("/island");
    }
  }, [connected, router]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient shown while image is loading */}
      {!imageLoaded && <div className="fixed inset-0 bg-gradient-to-b from-pink-400 to-purple-600 z-0" />}

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
        <div className="mb-20">
          <GameTitle />
        </div>

        <WalletSelector buttonText="Let's Go!" className="font-title text-2xl text-white drop-shadow-glow" />
      </div>
    </div>
  );
}
