"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ArrowLeft, Flame, Trophy } from "lucide-react";
import { useImageLoading } from "@/hooks/useImageLoading";

interface Agent {
  id: string;
  name: string;
  avatar_url: string;
  personality_vibe: string;
  traits: {
    intelligence: number;
    intuition: number;
    adaptability: number;
  };
}

interface Message {
  id: string;
  sender: "user" | "opponent" | "system";
  text: string;
  timestamp: string;
}

type BattleState = "setup" | "debate" | "result";

interface QuestionResult {
  question: string;
  userAnswer: string;
  opponentAnswer: string;
  correctAnswer: string;
  winner: "user" | "opponent" | "tie";
}

export default function ArenaPage() {
  const router = useRouter();
  const { account } = useWallet();
  const { imageLoaded, handleImageLoad } = useImageLoading("/places/arena.png");
  const [userAgent, setUserAgent] = useState<Agent | null>(null);
  const [opponentAgent, setOpponentAgent] = useState<Agent | null>(null);
  const [battleState, setBattleState] = useState<BattleState>("setup");
  const [timeLeft, setTimeLeft] = useState(30);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [finalWinner, setFinalWinner] = useState<"user" | "opponent" | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch user's agent
  useEffect(() => {
    const fetchUserAgent = async () => {
      if (!account?.address) return;

      try {
        const response = await fetch(
          `/api/get-islander?walletAddress=${account.address}`
        );
        if (!response.ok) throw new Error("Failed to fetch islander data");
        const data = await response.json();
        setUserAgent(data);
      } catch (error) {
        console.error("Error fetching islander:", error);
      }
    };

    fetchUserAgent();
  }, [account?.address]);

  // Find opponent when user agent is loaded
  useEffect(() => {
    if (userAgent && !opponentAgent) {
      findOpponent();
    }
  }, [userAgent]);

  // Start battle when both agents are loaded
  useEffect(() => {
    if (userAgent && opponentAgent && battleState === "setup") {
      startBattle();
    }
  }, [userAgent, opponentAgent, battleState]);

  // Find opponent
  const findOpponent = async () => {
    if (!userAgent) return;

    try {
      const response = await fetch("/api/find-opponent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excludeId: userAgent.id }),
      });

      if (!response.ok) throw new Error("Failed to find opponent");
      const data = await response.json();
      setOpponentAgent(data.opponent);
    } catch (error) {
      console.error("Error finding opponent:", error);
    }
  };

  // Generate and process a single question
  const processQuestion = async () => {
    if (currentQuestionIndex >= 5 || battleState === "result") {
      return;
    }

    setIsProcessing(true);

    try {
      // Generate question
      const questionResponse = await fetch("/api/generate-battle-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAgent, opponentAgent }),
      });

      if (!questionResponse.ok) throw new Error("Failed to generate question");
      const questionData = await questionResponse.json();
      setQuestion(questionData.question);

      // Add question to messages
      setMessages([
        {
          id: Date.now().toString(),
          sender: "system",
          text: `Question ${currentQuestionIndex + 1}/5: ${questionData.question}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      // Simulate answers after delays
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // User answer
      const userAnswer = Math.random() > 0.5 ? "Yes" : "No";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "user",
          text: userAnswer,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Opponent answer
      const opponentAnswer = Math.random() > 0.5 ? "Yes" : "No";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          sender: "opponent",
          text: opponentAnswer,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Determine correct answer and winner
      const correctAnswer = Math.random() > 0.5 ? "Yes" : "No";
      const questionWinner =
        userAnswer === correctAnswer && opponentAnswer !== correctAnswer
          ? "user"
          : opponentAnswer === correctAnswer && userAnswer !== correctAnswer
            ? "opponent"
            : "tie";

      // Add result
      setQuestionResults((prev) => [
        ...prev,
        {
          question: questionData.question,
          userAnswer,
          opponentAnswer,
          correctAnswer,
          winner: questionWinner,
        },
      ]);

      // Show correct answer
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 3).toString(),
          sender: "system",
          text: `The correct answer is: ${correctAnswer}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      // Move to next question or end battle
      if (currentQuestionIndex < 4) {
        setCurrentQuestionIndex((prev) => prev + 1);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        processQuestion();
      } else {
        // End battle
        const userWins = questionResults.filter(
          (r) => r.winner === "user"
        ).length;
        const opponentWins = questionResults.filter(
          (r) => r.winner === "opponent"
        ).length;

        if (userWins > opponentWins) {
          setFinalWinner("user");
        } else if (opponentWins > userWins) {
          setFinalWinner("opponent");
        }
        setBattleState("result");
      }
    } catch (error) {
      console.error("Error processing question:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start battle
  const startBattle = async () => {
    setBattleState("debate");
    setTimeLeft(30);
    setMessages([]);
    setQuestionResults([]);
    setFinalWinner(null);
    setCurrentQuestionIndex(0);
    setIsProcessing(false);
    await processQuestion();
  };

  // Timer logic
  useEffect(() => {
    if (battleState === "debate" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && battleState === "debate") {
      const userWins = questionResults.filter(
        (r) => r.winner === "user"
      ).length;
      const opponentWins = questionResults.filter(
        (r) => r.winner === "opponent"
      ).length;

      if (userWins > opponentWins) {
        setFinalWinner("user");
      } else if (opponentWins > userWins) {
        setFinalWinner("opponent");
      }
      setBattleState("result");
    }
  }, [timeLeft, battleState, questionResults]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!account?.address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <p className="text-white text-xl">
            Please connect your wallet to battle!
          </p>
        </div>
      </div>
    );
  }

  if (!userAgent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/places/arena.png"
          alt="Arena background"
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
        <div className="w-full max-w-4xl">
          <div className="bg-gradient-to-br from-purple-500/90 to-pink-500/90 rounded-xl border-2 border-white/30 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 p-4 text-center border-b border-white/20">
              <div className="flex items-center justify-center gap-3">
                <Flame className="w-6 h-6 text-white" />
                <h1 className="font-title text-2xl text-white">
                  Challenge Arena
                </h1>
              </div>
              <p className="font-handwritten text-lg text-white/90 mt-1">
                battle against other agents in a game of wits
              </p>
            </div>

            {/* Battle Arena */}
            <div className="p-8">
              {/* Question Display */}
              {battleState !== "result" && (
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                  >
                    <h2 className="font-title text-2xl text-white mb-2">
                      Question {currentQuestionIndex + 1}/5
                    </h2>
                    <p className="text-white/90 text-xl font-display">
                      {question || "Generating question..."}
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Score Display */}
              <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                  <p className="text-white/60 text-sm">{userAgent?.name}</p>
                  <p className="text-white text-2xl font-display">
                    {questionResults.filter((r) => r.winner === "user").length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-sm">Score</p>
                  <p className="text-white text-2xl font-display">
                    {questionResults.length}/5
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-sm">{opponentAgent?.name}</p>
                  <p className="text-white text-2xl font-display">
                    {
                      questionResults.filter((r) => r.winner === "opponent")
                        .length
                    }
                  </p>
                </div>
              </div>

              {/* Agent Avatars and Answers */}
              <div className="flex justify-between items-center mb-8">
                {/* User Agent */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-pink-500/30 shadow-lg">
                    <Image
                      src={userAgent?.avatar_url || "/avatars/default.png"}
                      alt={userAgent?.name || "Your Agent"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-white font-display">{userAgent?.name}</p>
                    <p className="text-white/60 text-sm">
                      {userAgent?.personality_vibe}
                    </p>
                    {messages.find((m) => m.sender === "user") && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                      >
                        <p className="text-white font-display text-lg">
                          {messages.find((m) => m.sender === "user")?.text}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* VS Badge */}
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="text-white font-title">VS</span>
                </div>

                {/* Opponent Agent */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-lg">
                    <Image
                      src={opponentAgent?.avatar_url || "/avatars/default.png"}
                      alt={opponentAgent?.name || "Opponent"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-white font-display">
                      {opponentAgent?.name}
                    </p>
                    <p className="text-white/60 text-sm">
                      {opponentAgent?.personality_vibe}
                    </p>
                    {messages.find((m) => m.sender === "opponent") && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                      >
                        <p className="text-white font-display text-lg">
                          {messages.find((m) => m.sender === "opponent")?.text}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Final Result Display */}
              {battleState === "result" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <h3 className="font-title text-2xl text-white mb-4">
                      Battle Result
                    </h3>
                    {finalWinner ? (
                      <div className="flex items-center justify-center gap-4">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                        <p className="text-white text-xl font-display">
                          {finalWinner === "user"
                            ? `${userAgent?.name} Wins!`
                            : `${opponentAgent?.name} Wins!`}
                        </p>
                      </div>
                    ) : (
                      <p className="text-white text-xl font-display">
                        It's a Tie!
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
