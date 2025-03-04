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
import { ArrowLeft, Heart, Sparkles, Wand2, Star } from "lucide-react";
import { useImageLoading } from "@/hooks/useImageLoading";

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
  const [step, setStep] = useState(1);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
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

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      router.push("/island");
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
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

      // Show creating state briefly then success
      setSubmissionStatus("creating");
      setTimeout(() => {
        setSubmissionStatus("success");
      }, 2000);
    } catch (error) {
      console.error("Error generating avatar:", error);
      setGenerationError("Failed to generate your avatar. Please try again.");
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
              <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 p-4 text-center border-b border-white/20">
                <h1 className="font-title text-2xl text-white">
                  Welcome to Paradise!
                </h1>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-[40%_60%] gap-6">
                  {/* Left side - Avatar */}
                  <div className="space-y-4">
                    <div className="aspect-square w-full rounded-xl overflow-hidden border-2 border-white/20 relative">
                      <Image
                        src={avatarUrl!}
                        alt="Your islander"
                        width={300}
                        height={300}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => setSubmissionStatus("idle")}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full"
                        size="sm"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Again
                      </Button>
                      <Button
                        onClick={handleEnterIsland}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-2 border-white/20
                                 hover:from-pink-600 hover:to-purple-600 w-full"
                        size="sm"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Enter Paradise
                        <Sparkles className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>

                  {/* Right side - Details */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="font-display text-3xl text-white mb-2">
                        {formData.name}
                      </h2>
                      <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 py-2 px-3">
                        <p className="font-display text-lg text-white">
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
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-white/80 text-sm mb-1">Appearance</p>
                        <p className="text-white font-display">
                          {formData.appearance.hairStyle}{" "}
                          {formData.appearance.hairColor} Hair
                        </p>
                        <p className="text-white font-display">
                          {formData.appearance.skinTone} Skin
                        </p>
                        <p className="text-white font-display capitalize mt-1">
                          {formData.appearance.outfitStyle} Style
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-white/80 text-sm mb-1">Top Traits</p>
                        {Object.entries(formData.traits)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 3)
                          .map(([trait, value]) => (
                            <p
                              key={trait}
                              className="text-white font-display capitalize"
                            >
                              {trait}: {value}/10
                            </p>
                          ))}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white/80 text-sm mb-1">
                        Signature Move
                      </p>
                      <p className="text-white font-display">
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

                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white/80 text-sm mb-1">Intro</p>
                      <p className="text-white font-display">
                        {formData.introLine}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 p-4 text-center border-b border-white/20">
                <h1 className="font-title text-2xl text-white">
                  {step === 1 && "Welcome to Paradise"}
                  {step === 2 && "Design Your Look"}
                  {step === 3 && "Shape Your Personality"}
                  {step === 4 && "Final Touches"}
                </h1>
                <div className="flex justify-center gap-2 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        step === i
                          ? "bg-white scale-125"
                          : step > i
                          ? "bg-white/80"
                          : "bg-white/30"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="grid grid-cols-[40%_60%]">
                {/* Left Side - Avatar Preview */}
                <div className="p-4 border-r border-white/10">
                  <div className="aspect-square rounded-xl overflow-hidden border-2 border-white/20 relative mb-3">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt="Generated avatar"
                        width={400}
                        height={400}
                        className="object-cover"
                      />
                    ) : (
                      <>
                        {/* <Image
                          src="/placeholder.svg?height=400&width=400"
                          alt="Avatar preview"
                          width={400}
                          height={400}
                          className="object-cover"
                        /> */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Wand2 className="w-12 h-12 text-white/50 mx-auto mb-2" />
                            <p className="text-white/70 font-display text-sm">
                              {submissionStatus === "generating"
                                ? "Generating your avatar..."
                                : "Customizing..."}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {formData.name && (
                    <div className="text-center -mt-1">
                      <h3 className="font-display text-2xl text-white mb-2">
                        {formData.name}
                      </h3>
                      {formData.personalityVibe && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 py-2 px-3">
                          <p className="font-display text-lg text-white font-bold">
                            {
                              PERSONALITY_VIBES.find(
                                (v) => v.value === formData.personalityVibe
                              )?.emoji
                            }
                            {
                              PERSONALITY_VIBES.find(
                                (v) => v.value === formData.personalityVibe
                              )?.label
                            }
                          </p>
                        </div>
                      )}
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
                            <Label className="text-white text-sm">
                              Your Name
                            </Label>
                            <Input
                              placeholder="What should we call you?"
                              value={formData.name}
                              onChange={(e) =>
                                updateFormData("name", e.target.value)
                              }
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-8 text-sm"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-white text-sm">Gender</Label>
                            <Select
                              value={formData.gender}
                              onValueChange={(value) =>
                                updateFormData("gender", value)
                              }
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-white h-8 text-sm">
                                <SelectValue placeholder="Select your gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="non-binary">
                                  Non-binary
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-white text-sm">
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
                                      ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-white scale-105 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                      : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40"
                                  )}
                                >
                                  <span>{vibe.emoji}</span>
                                  <span className="text-white text-xs font-display">
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
                            <Label className="text-white text-sm">
                              Face Shape
                            </Label>
                            <Select
                              value={formData.appearance.faceShape}
                              onValueChange={(value) =>
                                updateFormData("appearance.faceShape", value)
                              }
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-white h-8 text-sm">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
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
                            <Label className="text-white text-sm">
                              Skin Tone
                            </Label>
                            <Select
                              value={formData.appearance.skinTone}
                              onValueChange={(value) =>
                                updateFormData("appearance.skinTone", value)
                              }
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-white h-8 text-sm">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
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
                            <Label className="text-white text-sm">
                              Hair Style
                            </Label>
                            <Select
                              value={formData.appearance.hairStyle}
                              onValueChange={(value) =>
                                updateFormData("appearance.hairStyle", value)
                              }
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-white h-8 text-sm">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
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
                            <Label className="text-white text-sm">
                              Hair Color
                            </Label>
                            <Select
                              value={formData.appearance.hairColor}
                              onValueChange={(value) =>
                                updateFormData("appearance.hairColor", value)
                              }
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-white h-8 text-sm">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
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
                          <Label className="text-white text-sm">
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
                                    ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-white scale-105 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                    : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40"
                                )}
                              >
                                <span className="text-white text-xs font-display">
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
                        <div className="bg-white/5 rounded-lg p-2 border border-white/10 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-display">
                              Points Left
                            </span>
                            <span
                              className={cn(
                                "font-display",
                                remainingTraitPoints >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
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
                                  <Label className="text-white capitalize">
                                    {trait}
                                  </Label>
                                  <span className="text-white/70">
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
                            <Label className="text-white text-sm">
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
                                      ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-white scale-105 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                      : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40"
                                  )}
                                >
                                  <span>{move.emoji}</span>
                                  <span className="text-white text-xs font-display">
                                    {move.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-white text-sm">
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
                                      ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-white scale-105 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                      : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40"
                                  )}
                                >
                                  <span className="text-white text-xs font-display">
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
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg">
                  {generationError}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="p-4 bg-black/20 border-t border-white/10 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                {step < 4 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-2 border-white/20
                             hover:from-pink-600 hover:to-purple-600"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={submissionStatus !== "idle"}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-2 border-white/20
                             hover:from-pink-600 hover:to-purple-600 disabled:opacity-50"
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
              <p className="font-display text-xl text-white">
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
