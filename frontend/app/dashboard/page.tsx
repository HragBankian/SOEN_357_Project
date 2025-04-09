'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { format, startOfWeek, addDays } from 'date-fns';
import styles from '../dashboard.module.css';
import { useAuth } from '../context/AuthContext';

// Simple SVG icons
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 011.06-1.06L12 10.94l2.47-2.47a.75.75 0 011.06 0z" clipRule="evenodd" />
  </svg>
);

interface DayData {
  date: Date;
  workoutCompleted: boolean;
  weight: number | null;
  workoutType?: string;
  workoutDetails?: string;
}

// Sample data for graphs
const weeklyWorkoutData = [
  { day: 'Mon', count: 5 },
  { day: 'Tue', count: 3 },
  { day: 'Wed', count: 4 },
  { day: 'Thu', count: 0 },
  { day: 'Fri', count: 0 },
  { day: 'Sat', count: 0 },
  { day: 'Sun', count: 0 }
];

const weightTrendData = [
  { day: 'Mon', weight: 175.5 },
  { day: 'Tue', weight: 175.0 },
  { day: 'Wed', weight: 174.5 },
  { day: 'Thu', weight: null },
  { day: 'Fri', weight: null },
  { day: 'Sat', weight: null },
  { day: 'Sun', weight: null }
];

// Function to save day data to backend (placeholder for future implementation)
const saveDayToBackend = async (day: string, weight: number | null, workoutIsComplete: boolean) => {
  try {
    // This is a placeholder for the actual API call
    console.log(`Saving data for ${day}: Weight=${weight}, Workout Complete=${workoutIsComplete}`);
    
    // In the future, this will be replaced with an actual API call like:
    // const response = await fetch('/api/save-day', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     day,
    //     weight,
    //     workoutIsComplete
    //   }),
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('Failed to save day data');
    // }
    // 
    // return await response.json();
    
    // For now, just return a success message
    return { success: true, message: `Data saved for ${day}` };
  } catch (error) {
    console.error('Error saving day data:', error);
    throw error;
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const isLoggingOut = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (mounted && !isLoggedIn && !isLoggingOut.current) {
      router.push('/login');
    }
    
    // Initialize week data starting from Monday April 7 to Sunday April 13, 2025
    const initializeWeekData = () => {
      // Start with Monday, April 7, 2025
      const startDate = new Date(2025, 3, 7); // Month is 0-based, so 3 is April
      
      // Hardcoded workout data for the week (Monday to Sunday) - PPL Split
      const workoutData = [
        { workoutType: 'Push' },
        { workoutType: 'Pull' },
        { workoutType: 'Legs' },
        { workoutType: 'Rest' },
        { workoutType: 'Push' },
        { workoutType: 'Pull' },
        { workoutType: 'Legs' }
      ];
      
      const initialData = Array.from({ length: 7 }, (_, i) => ({
        date: addDays(startDate, i),
        workoutCompleted: i < 3, // First 3 days completed
        weight: i < 3 ? 175.5 - (i * 0.5) : null, // Sample weights decreasing slightly
        workoutType: workoutData[i].workoutType
      }));
      
      setWeekData(initialData);
      setIsLoading(false);
    };

    initializeWeekData();
    
    return () => {
      setMounted(false);
    };
  }, [isLoggedIn, router, mounted]);

  const toggleWorkout = (index: number) => {
    setWeekData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        workoutCompleted: !newData[index].workoutCompleted,
      };
      return newData;
    });
  };

  const updateWeight = (index: number, weight: string) => {
    setWeekData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        weight: weight ? parseFloat(weight) : null,
      };
      return newData;
    });
  };

  const handleLogout = () => {
    isLoggingOut.current = true;
    logout();
    router.push('/');
  };

  const handleSaveDay = async (dayOfTheWeek: string, weight: number | null, workoutCompleted: boolean) => {
    try {
      // Call the function to save data to backend
      const result = await saveDayToBackend(
        dayOfTheWeek,
        weight,
        workoutCompleted
      );
      
      // Show success message
      alert(`Day ${dayOfTheWeek} saved successfully!`);
    } catch (error) {
      // Show error message
      alert(`Failed to save day data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loadingText}>Loading your fitness journey...</div>
      </div>
    );
  }

  const weekStartDate = weekData[0]?.date;
  const formattedWeekStart = format(weekStartDate || new Date(), 'MMMM d, yyyy');

  // Calculate max values for graphs
  const maxWorkoutCount = Math.max(...weeklyWorkoutData.map(item => item.count));
  const validWeights = weightTrendData.map(item => item.weight).filter((weight): weight is number => weight !== null);
  const minWeight = Math.min(...validWeights);
  const maxWeight = Math.max(...validWeights);
  const weightRange = maxWeight - minWeight;

  return (
    <div className={styles.dashboardContainer}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <a href="/" className={styles.navbarLogo}>OmniFit</a>
        <div className={styles.navbarLinks}>
          <a href="/dashboard" className={styles.navbarLink}>Dashboard</a>
          <a href="/workouts" className={styles.navbarLink}>My Workouts</a>
          <button onClick={handleLogout} className={styles.navbarLink}>
            Logout
          </button>
        </div>
      </nav>

      <div className={styles.contentContainer}>
        <div className={styles.weekGrid}>
          {weekData.map((day, index) => (
            <div key={index} className={styles.dayCard}>
              <div className={styles.dateHeader}>
                <div className={styles.dayName}>{format(day.date, 'EEE')}</div>
                <div className={styles.dayNumber}>{format(day.date, 'MMM d')}</div>
              </div>

              <div className={styles.workoutSection}>
                <div 
                  className={`${styles.checkbox} ${day.workoutCompleted ? styles.checked : ''}`}
                  onClick={() => toggleWorkout(index)}
                >
                  {day.workoutCompleted && <CheckIcon />}
                </div>
                <div className={styles.workoutLabel}>
                  {day.workoutCompleted ? 'Completed!' : 'Mark Complete'}
                </div>
                {day.workoutType && (
                  <div className={styles.workoutInfo}>
                    <div>{day.workoutType}</div>
                  </div>
                )}
              </div>

              <div className={styles.weightInput}>
                <label htmlFor={`weight-${day.date}`} className={styles.weightLabel}>
                  Weight (lbs)
                </label>
                <input
                  id={`weight-${day.date}`}
                  type="number"
                  value={day.weight || ''}
                  onChange={(e) => updateWeight(index, e.target.value)}
                  className={styles.weightField}
                  placeholder="Enter weight"
                />
                <button 
                  className={styles.saveDayButton}
                  onClick={() => {
                    // Get the day name (Monday, Tuesday, etc.)
                    const dayName = format(day.date, 'EEEE').toLowerCase();
                    handleSaveDay(dayName, day.weight, day.workoutCompleted);
                  }}
                >
                  Save Day
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.graphsSection}>
          {/* Workout Count Bar Graph */}
          <div className={styles.graphCard}>
            <h3 className={styles.graphTitle}>Weekly Exercise Count</h3>
            <div className={styles.graphContainer}>
              {weeklyWorkoutData.map((item, index) => {
                const barHeight = Math.max((item.count / maxWorkoutCount) * 100, 4);
                return (
                  <div key={index} className={styles.barContainer}>
                    <div 
                      className={styles.bar} 
                      style={{ height: `${barHeight}%` }}
                    />
                    <div className={styles.barValue}>{item.count}</div>
                    <div className={styles.barLabel}>{item.day}</div>
                  </div>
                );
              })}
            </div>
            <div className={styles.graphLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.legendColorBar}`}></div>
                <span>Exercises</span>
              </div>
            </div>
          </div>

          {/* Weight Trend Line Graph */}
          <div className={styles.graphCard}>
            <h3 className={styles.graphTitle}>Weight Trend</h3>
            <div className={styles.lineGraph}>
              {weightTrendData.map((item, index) => {
                const xPosition = (index / (weightTrendData.length - 1)) * 100;
                const yPosition = item.weight !== null 
                  ? 100 - ((item.weight - minWeight) / weightRange) * 100 
                  : 0;
                
                return (
                  <div 
                    key={index} 
                    className={styles.linePoint}
                    style={{ 
                      left: `${xPosition}%`, 
                      bottom: `${yPosition}%`,
                      opacity: item.weight !== null ? 1 : 0.3
                    }}
                  >
                    <div className={styles.linePointLabel}>{item.weight || '-'}</div>
                  </div>
                );
              })}
            </div>
            <div className={styles.dayLabels}>
              {weightTrendData.map((item, index) => (
                <div key={index} className={styles.dayLabel}>{item.day}</div>
              ))}
            </div>
            <div className={styles.graphLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.legendColorLine}`}></div>
                <span>Weight (lbs)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 