"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Heart,
  Sparkles,
  Upload,
} from "lucide-react";

interface IslanderFormData {
  name: string;
  age: string;
  occupation: string;
  location: string;
  personality: string;
  bio: string;
  lookingFor: string;
  photo: string | null;
}

const PERSONALITY_TYPES = [
  "Adventurous",
  "Romantic",
  "Mysterious",
  "Playful",
  "Ambitious",
  "Creative",
  "Intellectual",
  "Free-spirited",
];

export default function ArrivalDockPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IslanderFormData>({
    name: "",
    age: "",
    occupation: "",
    location: "",
    personality: "",
    bio: "",
    lookingFor: "",
    photo: null,
  });

  const updateFormData = (field: keyof IslanderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = () => {
    // Here you would typically submit the islander data
    console.log("Submitting islander:", formData);
    router.push("/island");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/places/arrival-dock.png"
          alt="Tropical dock at sunset"
          fill
          className="object-cover"
          priority
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
        <div className="w-full max-w-lg">
          {/* Form Container */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 p-6 text-center border-b border-white/20">
              <h1 className="font-title text-3xl text-white mb-2">
                Welcome to Paradise
              </h1>
              <p className="font-handwritten text-xl text-white/90">
                tell us about yourself
              </p>

              {/* Step Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
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

            {/* Form Steps */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label className="text-white">Name</Label>
                      <Input
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Age</Label>
                      <Input
                        type="number"
                        placeholder="Your age"
                        value={formData.age}
                        onChange={(e) => updateFormData("age", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Occupation</Label>
                      <Input
                        placeholder="What do you do?"
                        value={formData.occupation}
                        onChange={(e) =>
                          updateFormData("occupation", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Location</Label>
                      <Input
                        placeholder="Where are you from?"
                        value={formData.location}
                        onChange={(e) =>
                          updateFormData("location", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label className="text-white">Personality Type</Label>
                      <Select
                        value={formData.personality}
                        onValueChange={(value) =>
                          updateFormData("personality", value)
                        }
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Choose your personality" />
                        </SelectTrigger>
                        <SelectContent>
                          {PERSONALITY_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Bio</Label>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={(e) => updateFormData("bio", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Looking For</Label>
                      <Textarea
                        placeholder="What kind of connection are you seeking?"
                        value={formData.lookingFor}
                        onChange={(e) =>
                          updateFormData("lookingFor", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white/50">
                        {formData.photo ? (
                          <Image
                            src={formData.photo || "/placeholder.svg"}
                            alt="Profile preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                            <Camera className="w-12 h-12 text-white/50" />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => {
                          // Add photo upload logic here
                          updateFormData(
                            "photo",
                            "/placeholder.svg?height=400&width=400"
                          );
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>

                    <div className="space-y-4 text-center">
                      <h3 className="font-display text-xl text-white">
                        Ready to Find Love?
                      </h3>
                      <p className="text-white/80">
                        Your journey to finding your digital soulmate begins
                        here!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="p-6 bg-black/20 border-t border-white/10 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-2 border-white/20
                           hover:from-pink-600 hover:to-purple-600"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-2 border-white/20
                           hover:from-pink-600 hover:to-purple-600"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Join Paradise
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
