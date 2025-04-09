'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../dashboard.module.css';
import { useAuth } from '../context/AuthContext';
import {API_URL} from "@/utils/apiConnection";

// Exercise type definition
interface Exercise {
  id: string;
  name: string;
  weight: string;
  sets: string;
  reps: string;
}

// Day data structure
interface DayExercises {
  dayName: string;
  exercises: Exercise[];
}

export default function WorkoutsPage() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isAddingTo, setIsAddingTo] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const isLoggingOut = useRef(false);
  
  // Sample exercise list (to be replaced with actual data later)
  const exerciseOptions = [
    "Bench Press", "Squats", "Deadlift", "Pull-ups", 
    "Push-ups", "Lunges", "Shoulder Press", "Bicep Curls",
    "Tricep Extensions", "Leg Press", "Calf Raises", "Sit-ups"
  ];
  
  // Initialize state with days of the week
  const [weekSchedule, setWeekSchedule] = useState<DayExercises[]>([
    { dayName: "Monday", exercises: [] },
    { dayName: "Tuesday", exercises: [] },
    { dayName: "Wednesday", exercises: [] },
    { dayName: "Thursday", exercises: [] },
    { dayName: "Friday", exercises: [] },
    { dayName: "Saturday", exercises: [] },
    { dayName: "Sunday", exercises: [] }
  ]);

  useEffect(() => {
    setMounted(true);
    if (mounted && !isLoggedIn && !isLoggingOut.current) {
      router.push('/login');
    }
    
    const fetchWorkouts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/Workout/GetAll`);
        const data = await res.json();
  
        const groupedByDay: { [day: string]: Exercise[] } = {};
  
        for (const item of data) {
          const exercises: Exercise[] = [];
  
          for (let i = 1; i <= 6; i++) {
            const name = item[`exercise_${i}`];
            const weight = item[`weight_${i}`];
            const sets = item[`sets_${i}`];
            const reps = item[`reps_${i}`];
  
            const isValid = name?.trim() !== '' && (weight !== 0 || sets !== 0 || reps !== 0);
            if (isValid) {
              exercises.push({
                id: `${item.id}_${i}`, // Use workout ID + index to keep unique
                name,
                weight: weight.toString(),
                sets: sets.toString(),
                reps: reps.toString(),
              });
            }
          }
  
          if (!groupedByDay[item.day_of_week]) {
            groupedByDay[item.day_of_week] = [];
          }
  
          groupedByDay[item.day_of_week].push(...exercises);
        }
  
        setWeekSchedule((prev) =>
          prev.map((day) => ({
            ...day,
            exercises: groupedByDay[day.dayName] || [],
          }))
        );
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
      }
    };
  
    if (mounted && isLoggedIn) {
      fetchWorkouts();
    }
    
    return () => {
      setMounted(false);
    };
  }, [isLoggedIn, router, mounted]);

  const handleLogout = () => {
    isLoggingOut.current = true;
    logout();
    router.push('/');
  };

  const toggleAddExercise = (dayName: string | null) => {
    setIsAddingTo(dayName);
  };

  const addExercise = (dayName: string, exerciseName: string) => {
    setWeekSchedule(prevSchedule => {
      return prevSchedule.map(day => {
        if (day.dayName === dayName) {
          // Check if already has 6 exercises
          if (day.exercises.length >= 6) {
            alert('Maximum 6 exercises allowed per day');
            return day;
          }
          
          return {
            ...day,
            exercises: [
              ...day.exercises,
              { id: Date.now().toString(), name: exerciseName, weight: '', sets: '', reps: '' }
            ]
          };
        }
        return day;
      });
    });
    setIsAddingTo(null);
  };

  const updateExerciseField = (dayName: string, exerciseId: string, field: 'weight' | 'sets' | 'reps', value: string) => {
    setWeekSchedule(prevSchedule => {
      return prevSchedule.map(day => {
        if (day.dayName === dayName) {
          return {
            ...day,
            exercises: day.exercises.map(exercise => {
              if (exercise.id === exerciseId) {
                return { ...exercise, [field]: value };
              }
              return exercise;
            })
          };
        }
        return day;
      });
    });
  };

  const removeExercise = (dayName: string, exerciseId: string) => {
    setWeekSchedule(prevSchedule => {
      return prevSchedule.map(day => {
        if (day.dayName === dayName) {
          return {
            ...day,
            exercises: day.exercises.filter(exercise => exercise.id !== exerciseId)
          };
        }
        return day;
      });
    });
  };

  const handleSaveWorkouts = async () => {
    try {
      // Only delete if we have something in the current schedule
      const hasAnyExercise = weekSchedule.some(day =>
        day.exercises.some(ex => ex.name.trim() !== '')
      );
  
      if (!hasAnyExercise) {
        alert("Nothing to save.");
        return;
      }
  
      // Step 1: Delete all existing workouts
      await fetch(`${API_URL}/api/Workout/DeleteAll`, {
        method: 'DELETE',
      });


      // Step 2: Re-add workouts day by day
      for (const day of weekSchedule) {
        const paddedExercises = [...day.exercises];
  
        // Pad up to 6 exercises with blanks
        while (paddedExercises.length < 6) {
          paddedExercises.push({
            id: '',
            name: '',
            weight: '0',
            sets: '0',
            reps: '0',
          });
        }
  
        const body = {
          day_of_week: day.dayName,
          ...Object.fromEntries(
            paddedExercises.flatMap((ex, idx) => [
              [`exercise_${idx + 1}`, ex.name],
              [`weight_${idx + 1}`, parseInt(ex.weight || '0')],
              [`sets_${idx + 1}`, parseInt(ex.sets || '0')],
              [`reps_${idx + 1}`, parseInt(ex.reps || '0')],
            ])
          ),
        };
  
        await fetch(`${API_URL}/api/Workout/AddWorkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
      }
  
      alert('Workout plan saved successfully!');
    } catch (err) {
      console.error('Error saving workouts:', err);
      alert('Failed to save workout plan.');
    }
  };
  

  const toggleRecommendations = () => {
    setShowRecommendations(!showRecommendations);
  };

  if (!mounted) {
    return null;
  }

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
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>My Weekly Workout Plan</h1>
          <button 
            className={styles.recommendationButton}
            onClick={toggleRecommendations}
          >
            Get Recommendations
          </button>
        </div>
        
        {showRecommendations && (
          <div className={styles.recommendationsBox}>
            <h3 className={styles.recommendationsTitle}>Workout Recommendations</h3>
            <div className={styles.recommendationsText}>
              <p>Based on your current workout plan, we recommend:</p>
              <ul>
                <li>Add Bicep Curls on Friday to balance your push and pull movements</li>
                <li>Consider moving Push-ups from Friday to Wednesday only to avoid training the same muscle groups too frequently</li>
                <li>Add Deadlifts on Monday to strengthen your posterior chain and complement your squat-focused leg day</li>
                <li>Separate your workouts into clear Push (Wednesday), Pull (Friday), and Legs (Monday) for better recovery</li>
                <li>Increase Pull-ups on Friday to better develop your back muscles</li>
              </ul>
              <p className={styles.recommendationsNote}>
                Note: These recommendations aim to balance your workout, prevent overtraining, and ensure all major muscle groups receive adequate attention.
              </p>
            </div>
            <button 
              className={styles.closeRecommendationsButton}
              onClick={toggleRecommendations}
            >
              Close
            </button>
          </div>
        )}
        
        <div className={styles.workoutGrid}>
          {weekSchedule.map((day) => (
            <div key={day.dayName} className={styles.workoutDayCard}>
              <h2 className={styles.dayTitle}>{day.dayName}</h2>
              
              <div className={styles.exerciseList}>
                {day.exercises.map((exercise) => (
                  <div key={exercise.id} className={styles.exerciseItem}>
                    <div className={styles.exerciseHeader}>
                      <h3 className={styles.exerciseName}>{exercise.name}</h3>
                      <button 
                        className={styles.removeButton}
                        onClick={() => removeExercise(day.dayName, exercise.id)}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className={styles.exerciseFields}>
                      <div className={styles.exerciseField}>
                        <label className={styles.exerciseLabel}>Weight (lbs)</label>
                        <input
                          type="number"
                          className={styles.exerciseInput}
                          value={exercise.weight}
                          onChange={(e) => updateExerciseField(day.dayName, exercise.id, 'weight', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className={styles.exerciseField}>
                        <label className={styles.exerciseLabel}>Sets</label>
                        <input
                          type="number"
                          className={styles.exerciseInput}
                          value={exercise.sets}
                          onChange={(e) => updateExerciseField(day.dayName, exercise.id, 'sets', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      
                      <div className={styles.exerciseField}>
                        <label className={styles.exerciseLabel}>Reps</label>
                        <input
                          type="number"
                          className={styles.exerciseInput}
                          value={exercise.reps}
                          onChange={(e) => updateExerciseField(day.dayName, exercise.id, 'reps', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {day.exercises.length < 6 && (
                isAddingTo === day.dayName ? (
                  <div className={styles.exerciseDropdown}>
                    <select 
                      className={styles.exerciseSelect}
                      onChange={(e) => addExercise(day.dayName, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select an exercise</option>
                      {exerciseOptions.map((exercise) => (
                        <option key={exercise} value={exercise}>
                          {exercise}
                        </option>
                      ))}
                    </select>
                    <button 
                      className={styles.cancelButton}
                      onClick={() => toggleAddExercise(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    className={styles.addExerciseButton}
                    onClick={() => toggleAddExercise(day.dayName)}
                  >
                    + Add Exercise
                  </button>
                )
              )}
            </div>
          ))}
        </div>
        
        <div className={styles.saveButtonContainer}>
          <button 
            className={styles.saveWorkoutsButton}
            onClick={handleSaveWorkouts}
          >
            Save Workout Plan
          </button>
        </div>
      </div>
    </div>
  );
} 