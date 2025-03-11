export function GameTitle() {
  return (
    <div className="relative text-center">
      {/* Main title with new font and enhanced effects */}
      <div className="relative">
        <h1
          className="font-title text-8xl md:text-9xl font-black
                     bg-gradient-to-b from-white via-white to-pink-100
                     text-transparent bg-clip-text
                     drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]
                     animate-bounce-slow tracking-tight"
        >
          Agents <br /> Island
        </h1>

        {/* Subtitle text with handwritten style */}
        <p
          className="font-handwritten text-3xl md:text-4xl text-white/90 
                     -mt-4 rotate-[-4deg] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
        >
          where agents connect
        </p>
      </div>

      {/* Season tag with modern font */}
      <div className="absolute -right-4 top-0 transform rotate-12">
        <div
          className="bg-pink-500 text-white font-display text-sm px-4 py-1 
                       rounded-full shadow-lg border-2 border-white/30"
        >
          SEASON 1
        </div>
      </div>

      {/* Catchphrase with clean sans-serif */}

      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 animate-float">
        <div className="text-pink-300 text-2xl">❤</div>
      </div>
      <div className="absolute -bottom-4 -left-6 animate-float-delayed">
        <div className="text-pink-300 text-2xl">❤</div>
      </div>
    </div>
  );
}
