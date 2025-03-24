"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Wand2,
  Trophy,
  Star,
  PartyPopper,
} from "lucide-react";
import { useImageLoading } from "@/hooks/useImageLoading";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface IslanderFormData {
  name: string;
  gender: string;
  personalityVibe: string;
  appearance: {
    faceShape: string;
    skinTone: string;
    hairStyle: string;
    hairColor: string;
    outfitStyle: string;
  };
  traits: {
    confidence: number;
    humor: number;
    intelligence: number;
    kindness: number;
    charisma: number;
  };
  signatureMove: string;
  introLine: string;
}

const PERSONALITY_VIBES = [
  { value: "bold", label: "Bold & Daring", emoji: "🔥" },
  { value: "charming", label: "Charming & Sweet", emoji: "💝" },
  { value: "mysterious", label: "Mysterious & Deep", emoji: "✨" },
  { value: "playful", label: "Playful & Fun", emoji: "🎉" },
];

const FACE_SHAPES = ["Round", "Oval", "Heart", "Square"];
const SKIN_TONES = ["Fair", "Light", "Medium", "Tan", "Deep", "Rich"];
const HAIR_STYLES = ["Short", "Medium", "Long", "Curly", "Wavy", "Straight"];
const HAIR_COLORS = ["Blonde", "Brown", "Black", "Red", "Pink", "Blue"];
const OUTFIT_STYLES = ["Casual", "Beachy", "Elegant", "Sporty", "Glamorous"];
const SIGNATURE_MOVES = [
  { value: "wink", label: "Playful Wink", emoji: "😉" },
  { value: "dance", label: "Signature Dance Move", emoji: "💃" },
  { value: "smirk", label: "Mysterious Smirk", emoji: "😏" },
  { value: "laugh", label: "Heartfelt Laugh", emoji: "😊" },
];

const INTRO_LINES = [
  "Here to find my soulmate and make unforgettable memories! 💖",
  "Ready to bring the fun and maybe find love along the way! 🎉",
  "Looking for that special connection in paradise... ✨",
  "Let's make this summer one to remember! 🌅",
];

export default function ArrivalDockPage() {
  const router = useRouter();
  const { account } = useWallet();
  const [step, setStep] = useState(1);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [formData, setFormData] = useState<IslanderFormData>({
    name: "",
    gender: "",
    personalityVibe: "",
    appearance: {
      faceShape: "",
      skinTone: "",
      hairStyle: "",
      hairColor: "",
      outfitStyle: "",
    },
    traits: {
      confidence: 5,
      humor: 5,
      intelligence: 5,
      kindness: 5,
      charisma: 5,
    },
    signatureMove: "",
    introLine: "",
  });

  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "creating" | "generating" | "success"
  >("idle");

  // Validation functions for each step
  const validateStep1 = () => {
    return (
      formData.name.trim() !== "" &&
      formData.gender !== "" &&
      formData.personalityVibe !== ""
    );
  };

  const validateStep2 = () => {
    return (
      formData.appearance.faceShape !== "" &&
      formData.appearance.skinTone !== "" &&
      formData.appearance.hairStyle !== "" &&
      formData.appearance.hairColor !== "" &&
      formData.appearance.outfitStyle !== ""
    );
  };

  const validateStep3 = () => {
    return remainingTraitPoints >= 0;
  };

  const validateStep4 = () => {
    return formData.signatureMove !== "" && formData.introLine !== "";
  };

  // Get validation status for current step
  const isCurrentStepValid = () => {
    switch (step) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      default:
        return false;
    }
  };

  const { imageLoaded, handleImageLoad } = useImageLoading(
    "/places/arrival-dock.png"
  );

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (field.includes(".")) {
        const [category, subfield] = field.split(".");

        if (category === "appearance") {
          newData.appearance = {
            ...newData.appearance,
            [subfield]: value,
          };
        } else if (category === "traits") {
          newData.traits = {
            ...newData.traits,
            [subfield]: value,
          };
        }
      } else {
        newData[field as keyof IslanderFormData] = value;
      }
      return newData;
    });
  };

  const generateAvatar = async () => {
    setIsGeneratingAvatar(true);
    setGenerationError(null);

    try {
      const response = await fetch("/api/generate-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate avatar");
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.status === "failed") {
        throw new Error("Avatar generation failed");
      }

      const imageUrl = result.output[0];
      setAvatarUrl(imageUrl);
    } catch (error) {
      console.error("Error generating avatar:", error);
      setGenerationError("Failed to generate your avatar. Please try again.");
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const handleNext = async () => {
    if (step === 2) {
      // Generate avatar after appearance is set
      generateAvatar();
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      router.push("/island");
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!account?.address) {
      setGenerationError("Please connect your wallet first");
      return;
    }

    setSubmissionStatus("generating");
    setGenerationError(null);

    try {
      // Generate the avatar
      const response = await fetch("/api/generate-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate avatar");
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.status === "failed") {
        throw new Error("Avatar generation failed");
      }

      // Get the generated image URL
      const imageUrl = result.output[0];
      setAvatarUrl(imageUrl);

      // Store the Islander data in Supabase
      const createResponse = await fetch("/api/create-islander", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: {
            ...formData,
            avatarUrl: imageUrl,
          },
          walletAddress: account.address,
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create islander");
      }

      // Show creating state briefly then success
      setSubmissionStatus("creating");
      setTimeout(() => {
        setSubmissionStatus("success");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setGenerationError("Failed to create your islander. Please try again.");
      setSubmissionStatus("idle");
    }
  };

  // Add a function to handle going to the island
  const handleEnterIsland = () => {
    router.push("/island");
  };

  const remainingTraitPoints =
    25 - Object.values(formData.traits).reduce((a, b) => a + b, 0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient shown while image is loading */}
      {!imageLoaded && (
        <div className="fixed inset-0 bg-gradient-to-b from-indigo-500 to-purple-600 z-0" />
      )}

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/places/arrival-dock.png"
          alt="Tropical dock at sunset"
          fill
          className="object-cover"
          priority
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
      </div>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-20 bg-white/20 backdrop-blur-sm rounded-full p-2 
                border-2 border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200
                hover:scale-105 transform"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {submissionStatus === "success" ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden"
            >
              {/* Success Header - Matching the form header style */}
              <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 p-5 border-b border-white/20 relative overflow-hidden">
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="w-6 h-6 text-white animate-pulse" />
                  <h1 className="font-title text-2xl text-white drop-shadow-sm">
                    Islander Created!
                  </h1>
                </div>

                {/* Animated particles */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                  <div className="absolute -top-2 left-1/4 animate-float-slow">
                    <Star className="w-4 h-4 text-yellow-300" />
                  </div>
                  <div className="absolute top-1/2 right-1/4 animate-float">
                    <Heart className="w-4 h-4 text-pink-300" />
                  </div>
                  <div className="absolute bottom-0 right-1/3 animate-float-delayed">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Welcome message */}
                <div className="text-center mb-6">
                  <p className="font-handwritten text-xl text-white/90">
                    Welcome to paradise
                  </p>
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent mt-1"></div>
                </div>

                <div className="grid grid-cols-[40%_60%] gap-8">
                  {/* Left side - Avatar */}
                  <div className="space-y-5">
                    <div className="aspect-square w-full rounded-xl overflow-hidden border-2 border-white/30 relative shadow-glow">
                      <Image
                        src={avatarUrl! || "/placeholder.svg"}
                        alt="Your islander"
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                      />

                      {/* Decorative corner elements */}
                      <div className="absolute top-2 left-2">
                        <PartyPopper className="w-5 h-5 text-pink-300" />
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <Heart className="w-5 h-5 text-pink-300" />
                      </div>
                    </div>

                    <Button
                      onClick={() => setSubmissionStatus("idle")}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full font-title"
                      size="sm"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Again
                    </Button>
                  </div>

                  {/* Right side - Details */}
                  <div className="space-y-4 pr-2">
                    <div>
                      <h2 className="font-title text-3xl text-white mb-2">
                        {formData.name}
                      </h2>
                      <div className="inline-block bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg border border-white/20 py-2 px-3">
                        <p className="font-title text-lg text-white">
                          {
                            PERSONALITY_VIBES.find(
                              (v) => v.value === formData.personalityVibe
                            )?.emoji
                          }{" "}
                          {
                            PERSONALITY_VIBES.find(
                              (v) => v.value === formData.personalityVibe
                            )?.label
                          }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                        <p className="text-white/80 text-sm mb-1 font-handwritten">
                          Appearance
                        </p>
                        <p className="text-white font-title">
                          {formData.appearance.hairStyle}{" "}
                          {formData.appearance.hairColor} Hair
                        </p>
                        <p className="text-white font-title">
                          {formData.appearance.skinTone} Skin
                        </p>
                        <p className="text-white font-title capitalize mt-1">
                          {formData.appearance.outfitStyle} Style
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                        <p className="text-white/80 text-sm mb-1 font-handwritten">
                          Top Traits
                        </p>
                        {Object.entries(formData.traits)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 3)
                          .map(([trait, value]) => (
                            <p
                              key={trait}
                              className="text-white font-title capitalize"
                            >
                              {trait}: {value}/10
                            </p>
                          ))}
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <p className="text-white/80 text-sm mb-1 font-handwritten">
                        Signature Move
                      </p>
                      <p className="text-white font-title">
                        {
                          SIGNATURE_MOVES.find(
                            (m) => m.value === formData.signatureMove
                          )?.emoji
                        }{" "}
                        {
                          SIGNATURE_MOVES.find(
                            (m) => m.value === formData.signatureMove
                          )?.label
                        }
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <p className="text-white/80 text-sm mb-1 font-handwritten">
                        Intro
                      </p>
                      <p className="text-white font-title">
                        {formData.introLine}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA - Replacing the "Your island adventure awaits!" text */}
                <div className="mt-8">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent mb-5"></div>

                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      duration: 1.5,
                    }}
                  >
                    <Button
                      onClick={handleEnterIsland}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 
                                border-2 border-white/30 w-full font-title py-6 relative overflow-hidden group shadow-glow"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Heart className="w-6 h-6 mr-3 animate-pulse" />
                      <span className="text-xl">Enter Paradise</span>
                      <Sparkles className="w-6 h-6 ml-3" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden">
              {/* Header - Sleeker Design */}
              <div className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 p-5 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {step === 1 && <Heart className="w-6 h-6 text-white" />}
                    {step === 2 && <Wand2 className="w-6 h-6 text-white" />}
                    {step === 3 && <Sparkles className="w-6 h-6 text-white" />}
                    {step === 4 && <Heart className="w-6 h-6 text-white" />}
                    <h1 className="font-title text-2xl text-white drop-shadow-sm">
                      {step === 1 && "Welcome to Paradise"}
                      {step === 2 && "Design Your Look"}
                      {step === 3 && "Shape Your Personality"}
                      {step === 4 && "Final Touches"}
                    </h1>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-2 w-8 rounded-full transition-all duration-300",
                          step === i
                            ? "bg-white shadow-glow"
                            : step > i
                              ? "bg-white/60"
                              : "bg-white/20"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="grid grid-cols-[40%_60%]">
                {/* Left Side - Avatar Preview */}
                <div className="p-4 border-r border-white/10">
                  <div className="aspect-square rounded-xl overflow-hidden border-2 border-white/20 relative mb-3 bg-gradient-to-b from-purple-500/20 to-pink-500/20">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Generated avatar"
                        width={400}
                        height={400}
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Wand2 className="w-12 h-12 text-white/50 mx-auto mb-2" />
                          <p className="text-white/70 font-title text-sm">
                            {isGeneratingAvatar ? "Customizing..." : "Preview"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {formData.name && (
                    <div className="text-center -mt-1">
                      <h3 className="font-title text-2xl text-white mb-2">
                        {formData.name}
                      </h3>
                    </div>
                  )}
                </div>

                {/* Right Side - Form Steps */}
                <div className="p-4">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label className="text-white text-sm font-title">
                              Your Name
                            </Label>
                            <Input
                              placeholder="What should we call you?"
                              value={formData.name}
                              onChange={(e) =>
                                updateFormData("name", e.target.value)
                              }
                              className="bg-white border-white/20 text-gray-800 placeholder:text-gray-500 h-10 text-sm font-title"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-white text-sm font-title">
                              Gender
                            </Label>
                            <Select
                              value={formData.gender}
                              onValueChange={(value) =>
                                updateFormData("gender", value)
                              }
                            >
                              <SelectTrigger className="bg-white border-white/20 text-gray-800 h-10 text-sm font-title">
                                <SelectValue placeholder="Select your gender" />
                              </SelectTrigger>
                              <SelectContent className="bg-white text-gray-800 font-title">
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="non-binary">
                                  Non-binary
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-white text-sm font-title">
                              Initial Vibe
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              {PERSONALITY_VIBES.map((vibe) => (
                                <button
                                  key={vibe.value}
                                  onClick={() =>
                                    updateFormData(
                                      "personalityVibe",
                                      vibe.value
                                    )
                                  }
                                  className={cn(
                                    "p-2 rounded-lg border-2 text-sm transition-all duration-200",
                                    "flex items-center gap-2",
                                    formData.personalityVibe === vibe.value
                                      ? "bg-gradient-to-r from-pink-500 to-purple-500 border-white scale-105 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                      : "bg-white border-white/20 hover:bg-white/90 hover:border-white/40"
                                  )}
                                >
                                  <span>{vibe.emoji}</span>
                                  <span
                                    className={cn(
                                      "text-xs font-title",
                                      formData.personalityVibe === vibe.value
                                        ? "text-white"
                                        : "text-gray-800"
                                    )}
                                  >
                                    {vibe.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-white text-sm font-title">
                              Face Shape
                            </Label>
                            <Select
                              value={formData.appearance.faceShape}
                              onValueChange={(value) =>
                                updateFormData("appearance.faceShape", value)
                              }
                            >
                              <SelectTrigger className="bg-white border-white/20 text-gray-800 h-10 text-sm font-title">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="bg-white text-gray-800 font-title">
                                {FACE_SHAPES.map((shape) => (
                                  <SelectItem
                                    key={shape}
                                    value={shape.toLowerCase()}
                                  >
                                    {shape}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-white text-sm font-title">
                              Skin Tone
                            </Label>
                            <Select
                              value={formData.appearance.skinTone}
                              onValueChange={(value) =>
                                updateFormData("appearance.skinTone", value)
                              }
                            >
                              <SelectTrigger className="bg-white border-white/20 text-gray-800 h-10 text-sm font-title">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="bg-white text-gray-800 font-title">
                                {SKIN_TONES.map((tone) => (
                                  <SelectItem
                                    key={tone}
                                    value={tone.toLowerCase()}
                                  >
                                    {tone}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-white text-sm font-title">
                              Hair Style
                            </Label>
                            <Select
                              value={formData.appearance.hairStyle}
                              onValueChange={(value) =>
                                updateFormData("appearance.hairStyle", value)
                              }
                            >
                              <SelectTrigger className="bg-white border-white/20 text-gray-800 h-10 text-sm font-title">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="bg-white text-gray-800 font-title">
                                {HAIR_STYLES.map((style) => (
                                  <SelectItem
                                    key={style}
                                    value={style.toLowerCase()}
                                  >
                                    {style}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-white text-sm font-title">
                              Hair Color
                            </Label>
                            <Select
                              value={formData.appearance.hairColor}
                              onValueChange={(value) =>
                                updateFormData("appearance.hairColor", value)
                              }
                            >
                              <SelectTrigger className="bg-white border-white/20 text-gray-800 h-10 text-sm font-title">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="bg-white text-gray-800 font-title">
                                {HAIR_COLORS.map((color) => (
                                  <SelectItem
                                    key={color}
                                    value={color.toLowerCase()}
                                  >
                                    {color}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-white text-sm font-title">
                            Outfit Style
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            {OUTFIT_STYLES.map((style) => (
                              <button
                                key={style}
                                onClick={() =>
                                  updateFormData(
                                    "appearance.outfitStyle",
                                    style.toLowerCase()
                                  )
                                }
                                className={cn(
                                  "p-2 rounded-lg border-2 text-sm transition-all duration-200",
                                  formData.appearance.outfitStyle ===
                                    style.toLowerCase()
                                    ? "bg-gradient-to-r from-pink-500 to-purple-500 border-white scale-105 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                    : "bg-white border-white/20 hover:bg-white/90 hover:border-white/40"
                                )}
                              >
                                <span
                                  className={cn(
                                    "text-xs font-title",
                                    formData.appearance.outfitStyle ===
                                      style.toLowerCase()
                                      ? "text-white"
                                      : "text-gray-800"
                                  )}
                                >
                                  {style}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="bg-white rounded-lg p-3 border border-white/10 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-800 font-title">
                              Points Left
                            </span>
                            <span
                              className={cn(
                                "font-title",
                                remainingTraitPoints >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              )}
                            >
                              {remainingTraitPoints}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {Object.entries(formData.traits).map(
                            ([trait, value]) => (
                              <div key={trait} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <Label className="text-white capitalize font-title">
                                    {trait}
                                  </Label>
                                  <span className="text-white/70 font-title">
                                    {value}/10
                                  </span>
                                </div>
                                <Slider
                                  value={[value]}
                                  min={1}
                                  max={10}
                                  step={1}
                                  className="[&_[role=slider]]:bg-white"
                                  onValueChange={([newValue]) => {
                                    const otherTraitsTotal = Object.entries(
                                      formData.traits
                                    )
                                      .filter(([t]) => t !== trait)
                                      .reduce((sum, [, v]) => sum + v, 0);

                                    if (otherTraitsTotal + newValue <= 25) {
                                      updateFormData(
                                        `traits.${trait}`,
                                        newValue
                                      );
                                    }
                                  }}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label className="text-white text-sm font-title">
                              Signature Move
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              {SIGNATURE_MOVES.map((move) => (
                                <button
                                  key={move.value}
                                  onClick={() =>
                                    updateFormData("signatureMove", move.value)
                                  }
                                  className={cn(
                                    "p-2 rounded-lg border-2 text-sm transition-all duration-200",
                                    "flex items-center gap-2",
                                    formData.signatureMove === move.value
                                      ? "bg-gradient-to-r from-pink-500 to-purple-500 border-white scale-105 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                      : "bg-white border-white/20 hover:bg-white/90 hover:border-white/40"
                                  )}
                                >
                                  <span>{move.emoji}</span>
                                  <span
                                    className={cn(
                                      "text-xs font-title",
                                      formData.signatureMove === move.value
                                        ? "text-white"
                                        : "text-gray-800"
                                    )}
                                  >
                                    {move.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-white text-sm font-title">
                              Your Intro Line
                            </Label>
                            <div className="space-y-2">
                              {INTRO_LINES.map((line, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    updateFormData("introLine", line)
                                  }
                                  className={cn(
                                    "w-full p-2 rounded-lg border-2 text-left text-sm transition-all duration-200",
                                    formData.introLine === line
                                      ? "bg-gradient-to-r from-pink-500 to-purple-500 border-white scale-105 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                      : "bg-white border-white/20 hover:bg-white/90 hover:border-white/40"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "text-xs font-title",
                                      formData.introLine === line
                                        ? "text-white"
                                        : "text-gray-800"
                                    )}
                                  >
                                    {line}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Error Message */}
              {generationError && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg font-title">
                  {generationError}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="p-4 bg-black/20 border-t border-white/10 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="bg-white border-white/20 text-gray-800 hover:bg-white/90 font-title"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                {step < 4 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!isCurrentStepValid()}
                    className={cn(
                      "font-title transition-all duration-300",
                      isCurrentStepValid()
                        ? "bg-pink-500 text-white hover:bg-pink-600 border-2 border-white/30"
                        : "bg-white/10 text-white/50 border border-white/10 backdrop-blur-sm"
                    )}
                  >
                    {isCurrentStepValid() ? "Next Step" : "Complete This Step"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      submissionStatus !== "idle" || !isCurrentStepValid()
                    }
                    className={cn(
                      "font-title transition-all duration-300",
                      isCurrentStepValid() && submissionStatus === "idle"
                        ? "bg-pink-500 text-white hover:bg-pink-600 border-2 border-white/30"
                        : "bg-white/10 text-white/50 border border-white/10 backdrop-blur-sm"
                    )}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Create Islander
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay - Only show for generating and creating states */}
      <AnimatePresence>
        {(submissionStatus === "generating" ||
          submissionStatus === "creating") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-title text-xl text-white">
                {submissionStatus === "generating"
                  ? "Generating Your Avatar..."
                  : "Creating Your Islander..."}
              </p>
              <p className="font-handwritten text-lg text-white/80 mt-2">
                {submissionStatus === "generating"
                  ? "Creating your perfect look"
                  : "Getting ready for paradise"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
