import { NextResponse } from "next/server";

// This is a mock API endpoint that would fetch user XP from a database
// In a real application, you would connect to your database here

export async function GET() {
  try {
    // Mock data - in a real app, you would fetch this from your database
    // This endpoint only returns workout XP, not including achievement XP
    const mockUserXP = {
      totalXP: 275, // XP from completed workouts only
      workoutsCompleted: 12,
      streakDays: 5,
    };

    return NextResponse.json(mockUserXP);
  } catch (error) {
    console.error("Error fetching user XP:", error);
    return NextResponse.json(
      { error: "Failed to fetch user XP" },
      { status: 500 }
    );
  }
}
