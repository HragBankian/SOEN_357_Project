'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../dashboard.module.css';
import { useAuth } from '../context/AuthContext';

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
    if (mounted && !isLoggedIn) {
      router.push('/login');
    }
    
    return () => {
      setMounted(false);
    };
  }, [isLoggedIn, router, mounted]);

  const handleLogout = () => {
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

  const handleSaveWorkouts = () => {
    // For now, just show what would be saved
    console.log('Saving workouts:', weekSchedule);
    alert('Workout plan saved successfully!');
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
        <h1 className={styles.title}>My Weekly Workout Plan</h1>
        
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