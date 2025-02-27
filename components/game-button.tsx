"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "start" | "connect" | "secondary";
  children: React.ReactNode;
  subtitle?: string;
}

export function GameButton({
  variant = "secondary",
  children,
  subtitle,
  className,
  ...props
}: GameButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = "relative w-full transition-all duration-200";

  const variants = {
    start:
      "bg-gradient-to-b from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white",
    connect:
      "bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white",
    secondary:
      "bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white",
  };

  return (
    <div className="relative group">
      {/* Button shadow/border effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl transition-all duration-200",
          "bg-black/20 translate-y-2",
          isPressed && "translate-y-1"
        )}
      />

      {/* Main button */}
      <button
        className={cn(
          baseStyles,
          variants[variant],
          "rounded-xl px-6 py-4",
          "border-2 border-white/30",
          "shadow-[0_0_10px_rgba(255,255,255,0.3)]",
          "transform active:scale-95 transition-all duration-200",
          isPressed && "translate-y-1",
          className
        )}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        {...props}
      >
        {/* Button content with new typography */}
        <div className="relative flex flex-col items-center justify-center gap-1">
          <span className="font-display text-xl tracking-wide font-bold uppercase">
            {children}
          </span>
          {subtitle && (
            <span className="font-handwritten text-lg text-white/80 -mt-1">
              {subtitle}
            </span>
          )}
        </div>

        {/* Enhanced shine effect */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div
            className="absolute top-0 left-[-100%] h-full w-1/2 
                        bg-gradient-to-r from-transparent via-white/20 to-transparent
                        transform group-hover:translate-x-[300%] transition-transform duration-1000"
          />
        </div>
      </button>
    </div>
  );
}
