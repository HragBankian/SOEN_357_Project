"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Trophy,
  Lock,
  Star,
  Award,
  CheckCircle,
  LogOut,
  Dumbbell,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from '../context/AuthContext';

// Types
interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
  progress?: {
    current: number;
    target: number;
  };
  icon: React.ReactNode;
}

interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: {
    current: number;
    target: number;
  };
  completed: boolean;
}

interface UserXP {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
}

export default function Page() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weeklyChallenge, setWeeklyChallenge] =
    useState<WeeklyChallenge | null>(null);
  const [userXP, setUserXP] = useState<UserXP>({
    totalXP: 0,
    level: 1,
    currentLevelXP: 0,
    nextLevelXP: 100,
  });
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    // Simulate fetching achievements
    const fetchAchievements = () => {
      // This would be replaced with an actual API call
      const mockAchievements: Achievement[] = [
        {
          id: "1",
          title: "First Workout",
          description: "Complete your first workout",
          xpReward: 50,
          unlocked: true,
          icon: <Dumbbell className="size-6" />,
        },
        {
          id: "2",
          title: "Workout Streak",
          description: "Complete 5 workouts in a row",
          xpReward: 100,
          unlocked: true,
          icon: <Award className="size-6" />,
        },
        {
          id: "3",
          title: "Weight Tracker",
          description: "Track your weight for 7 consecutive days",
          xpReward: 75,
          unlocked: false,
          progress: {
            current: 4,
            target: 7,
          },
          icon: <Star className="size-6" />,
        },
        {
          id: "4",
          title: "Fitness Enthusiast",
          description: "Complete 50 workouts",
          xpReward: 200,
          unlocked: false,
          progress: {
            current: 12,
            target: 50,
          },
          icon: <Trophy className="size-6" />,
        },
        {
          id: "5",
          title: "Perfect Week",
          description: "Complete all planned workouts for a week",
          xpReward: 150,
          unlocked: false,
          progress: {
            current: 3,
            target: 7,
          },
          icon: <CheckCircle className="size-6" />,
        },
        {
          id: "6",
          title: "Consistency King",
          description: "Log in for 30 consecutive days",
          xpReward: 300,
          unlocked: false,
          progress: {
            current: 14,
            target: 30,
          },
          icon: <Award className="size-6" />,
        },
      ];

      setAchievements(mockAchievements);
    };

    // Simulate fetching weekly challenge
    const fetchWeeklyChallenge = () => {
      // This would be replaced with an actual API call
      const mockWeeklyChallenge: WeeklyChallenge = {
        id: "wc1",
        title: "100% Completion",
        description: "Complete 100% of planned workouts this week",
        xpReward: 200,
        progress: {
          current: 5,
          target: 7,
        },
        completed: false,
      };

      setWeeklyChallenge(mockWeeklyChallenge);
    };

    // Simulate fetching user XP
    const fetchUserXP = async () => {
      try {
        // This would be replaced with an actual API call
        const response = await fetch("/api/xp");
        const data = await response.json();

        // Mock data
        const mockXP = data.totalXP;
        const xpPerLevel = 100;
        const level = Math.floor(mockXP / xpPerLevel) + 1;
        const currentLevelXP = mockXP % xpPerLevel;

        setUserXP({
          totalXP: mockXP,
          level: level,
          currentLevelXP: currentLevelXP,
          nextLevelXP: xpPerLevel,
        });
      } catch (error) {
        console.error("Error fetching user XP:", error);
      }
    };

    // Fetch all data
    const fetchData = async () => {
      setLoading(true);
      fetchAchievements();
      fetchWeeklyChallenge();
      await fetchUserXP();
      setLoading(false);
    };

    fetchData();
  }, []);

  // Calculate XP progress percentage
  const xpProgressPercentage =
    (userXP.currentLevelXP / userXP.nextLevelXP) * 100;

  return (
    <div className="min-h-dvh h-dvh bg-[#0f172a] text-white pt-20 pb-6 px-6 overflow-hidden box-border flex flex-col">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-4 bg-[#0f172a]/80 backdrop-blur-md z-50 border-b border-white/10">
        <Link
          href={"/"}
          className="text-2xl font-bold text-white"
        >
          OmniFit
        </Link>
        <div className="flex gap-8 items-center">
          <Link
            href={"/dashboard"}
            className="text-white font-medium hover:text-[#6C47FF] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href={"/workouts"}
            className="text-white font-medium hover:text-[#6C47FF] transition-colors"
          >
            My Workouts
          </Link>
          <Link
            href={"/achievements"}
            className="text-white font-medium text-[#6C47FF]"
          >
            Achievements
          </Link>
          <button 
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="bg-red-500/20 text-white font-medium hover:bg-red-500/30 transition-colors px-3 py-2 rounded-lg border border-red-500/30"
            style={{ cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white">Achievements</h1>
          <p className="text-sm text-white/70 mt-1">
            Track your progress and earn rewards
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-6 flex-1 overflow-hidden">
        {loading ? (
          <div className="text-center text-white/70 mt-4">
            Loading achievements...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden">
            {/* Left Column - XP and Level */}
            <div className="flex flex-col gap-6">
              <div className="bg-[#1a1f3c] rounded-xl p-6 border border-white/10 shadow-lg flex flex-col gap-4">
                <h2 className="text-xl font-semibold text-center">
                  Your Progress
                </h2>

                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="relative size-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-[#6C47FF]/20"></div>
                    <svg
                      className="absolute inset-0 size-full"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-[#6C47FF]"
                        strokeDasharray={`${xpProgressPercentage * 2.4} 1000`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <span className="text-2xl font-bold">{userXP.level}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-white/70">Current Level</span>
                    <span className="text-xl font-bold">
                      {userXP.totalXP} XP
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#0f172a]/50 rounded-full h-2.5 mb-1">
                  <div
                    className="bg-gradient-to-r from-[#6C47FF] to-[#8A6FFF] h-2.5 rounded-full"
                    style={{ width: `${xpProgressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-white/70">
                  <span>{userXP.currentLevelXP} XP</span>
                  <span>{userXP.nextLevelXP} XP</span>
                </div>

                <div className="mt-2 text-center text-sm text-white/70">
                  <p>
                    {userXP.nextLevelXP - userXP.currentLevelXP} XP needed for
                    level {userXP.level + 1}
                  </p>
                </div>
              </div>

              {/* Weekly Challenge */}
              {weeklyChallenge && (
                <div className="bg-[#1a1f3c] rounded-xl p-6 border border-white/10 shadow-lg flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Weekly Challenge</h2>
                    <div className="px-2 py-1 bg-[#6C47FF]/20 rounded-md text-xs font-medium text-[#8A6FFF]">
                      +{weeklyChallenge.xpReward} XP
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium">
                      {weeklyChallenge.title}
                    </h3>
                    <p className="text-sm text-white/70">
                      {weeklyChallenge.description}
                    </p>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>
                        {weeklyChallenge.progress.current}/
                        {weeklyChallenge.progress.target}
                      </span>
                    </div>
                    <div className="w-full bg-[#0f172a]/50 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-[#6C47FF] to-[#8A6FFF] h-2.5 rounded-full"
                        style={{
                          width: `${
                            (weeklyChallenge.progress.current /
                              weeklyChallenge.progress.target) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {weeklyChallenge.completed ? (
                    <div className="flex items-center justify-center gap-2 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium mt-2">
                      <CheckCircle className="size-4" />
                      Completed
                    </div>
                  ) : (
                    <div className="text-center text-sm text-white/70 mt-2">
                      {weeklyChallenge.progress.target -
                        weeklyChallenge.progress.current}{" "}
                      more to complete
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Achievements */}
            <div className="lg:col-span-2 overflow-hidden flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>

              <div className="overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`bg-[#1a1f3c] rounded-xl p-5 border shadow-lg transition-all ${
                      achievement.unlocked
                        ? "border-[#6C47FF]/30 hover:border-[#6C47FF]/50"
                        : "border-white/10 opacity-80"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`size-12 rounded-lg flex items-center justify-center ${
                          achievement.unlocked
                            ? "bg-[#6C47FF]/20 text-[#8A6FFF]"
                            : "bg-[#0f172a]/50 text-white/40"
                        }`}
                      >
                        {achievement.unlocked ? (
                          achievement.icon
                        ) : (
                          <Lock className="size-6" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{achievement.title}</h3>
                          <div className="px-2 py-1 bg-[#6C47FF]/20 rounded-md text-xs font-medium text-[#8A6FFF]">
                            +{achievement.xpReward} XP
                          </div>
                        </div>
                        <p className="text-sm text-white/70 mt-1">
                          {achievement.description}
                        </p>

                        {!achievement.unlocked && achievement.progress && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>
                                {achievement.progress.current}/
                                {achievement.progress.target}
                              </span>
                            </div>
                            <div className="w-full bg-[#0f172a]/50 rounded-full h-1.5">
                              <div
                                className="bg-gradient-to-r from-[#6C47FF] to-[#8A6FFF] h-1.5 rounded-full"
                                style={{
                                  width: `${
                                    (achievement.progress.current /
                                      achievement.progress.target) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {achievement.unlocked && (
                          <div className="flex items-center gap-1 text-xs text-green-400 mt-2">
                            <CheckCircle className="size-3" />
                            <span>Unlocked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
