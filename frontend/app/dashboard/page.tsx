'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { format, addDays } from 'date-fns';
import styles from '../dashboard.module.css';
import { useAuth } from '../context/AuthContext';
import {API_URL} from "@/utils/apiConnection";
import {DayTrackerModel} from '@/models/DayTrackerModel';

// Simple SVG icons
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
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
  { day: 'Mon', count: 4, details: 'Push' },
  { day: 'Tue', count: 3, details: 'Pull' },
  { day: 'Wed', count: 2, details: 'Legs' },
  { day: 'Thu', count: 1, details: 'Cardio' },
  { day: 'Fri', count: 4, details: 'Upper' },
  { day: 'Sat', count: 3, details: 'Pull' },
  { day: 'Sun', count: 2, details: 'Legs' }
];

// Function to save day data to backend (placeholder for future implementation)
const saveDay = async (day: string, weight: number | null, workoutIsComplete: boolean) => {
  try {
    // Step 1: Fetch all existing days
    const days: DayTrackerModel[] = await fetchDays();
    const existingDay = days.find(d => d.day_of_week.toLowerCase() === day.toLowerCase());

    if (!existingDay) {
      throw new Error(`No existing entry found for day: ${day}`);
    }

    // Step 2: Create updated object
    const updatedDay: DayTrackerModel = {
      ...existingDay,
      bodyweight: weight,
      workout_is_complete: workoutIsComplete,
    };

    // Step 3: Send PUT request to update the day
    const response = await fetch(`${API_URL}/api/Tracker/UpdateDay`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDay),
    });

    if (!response.ok) {
      throw new Error(`Failed to update day: ${day}`);
    }

    console.log(`Updated day ${day} successfully`);
    await fetchDays(); // Optionally refresh state
  } catch (error) {
    console.error('Error saving day data:', error);
    throw error;
  }
};

const fetchDays = async (): Promise<DayTrackerModel[]> => {
  try {
    const response = await fetch(`${API_URL}/api/Tracker/GetAllDays`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DayTrackerModel[] = await response.json();
    console.log('Day tracker data:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch day tracker data:', error);
    return [];
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const isLoggingOut = useRef(false);
  const [trackerData, setTrackerData] = useState<DayTrackerModel[]>([]);

  useEffect(() => {
    setMounted(true);
    if (mounted && !isLoggedIn && !isLoggingOut.current) {
      router.push('/login');
    }
    
    const loadData = async () => {
      try {
        const days = await fetchDays();
        setTrackerData(days);
        
        // Initialize week data starting from Monday April 7 to Sunday April 13, 2025
        const startDate = new Date(2025, 3, 7); // Month is 0-based, so 3 is April
        
        const initialData = Array.from({ length: 7 }, (_, i) => {
          const dayName = format(addDays(startDate, i), 'EEEE').toLowerCase();
          const dayData = days.find(d => d.day_of_week.toLowerCase() === dayName);
          const workoutInfo = weeklyWorkoutData[i];
          
          return {
            date: addDays(startDate, i),
            workoutCompleted: dayData?.workout_is_complete || false,
            weight: dayData?.bodyweight || null,
            workoutType: workoutInfo.details.split(',')[0], // First exercise as the type
            workoutDetails: workoutInfo.details
          };
        });
        
        setWeekData(initialData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();
    
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
      await saveDay(
        dayOfTheWeek,
        weight,
        workoutCompleted
      );
      
      // Refresh tracker data to update the weight trend graph
      const updatedDays = await fetchDays();
      setTrackerData(updatedDays);
      
      // Show success message
      alert(`Day ${dayOfTheWeek.charAt(0).toUpperCase() + dayOfTheWeek.slice(1)} saved successfully!`);
    } catch (error) {
      // Show error message
      alert(`Failed to save day data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSaveAllDays = async () => {
    try {
      // Create an array of promises for each day
      const savePromises = weekData.map(day => {
        const dayName = format(day.date, 'EEEE').toLowerCase();
        return saveDay(dayName, day.weight, day.workoutCompleted);
      });
      
      // Wait for all save operations to complete
      await Promise.all(savePromises);
      
      // Refresh tracker data to update the weight trend graph
      const updatedDays = await fetchDays();
      setTrackerData(updatedDays);
      
      // Show success message
      alert('All days saved successfully!');
    } catch (error) {
      // Show error message
      alert(`Failed to save days: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  // Calculate max values for graphs
  const weightTrendData = trackerData.map(day => ({
    day: day.day_of_week.substring(0, 3),
    weight: day.bodyweight
  }));

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
                    <div>{day.workoutDetails}</div>
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
                  ? ((item.weight - minWeight) / weightRange) * 100 
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
        
        <div className={styles.saveAllContainer}>
          <button 
            className={styles.saveAllButton}
            onClick={handleSaveAllDays}
          >
            Save All Days
          </button>
        </div>
      </div>
    </div>
  );
} 