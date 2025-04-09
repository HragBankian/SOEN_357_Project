'use client';

import { useRouter } from 'next/navigation';
import styles from './home.module.css';
import { useAuth } from './context/AuthContext';

// SVG icons
const WorkoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.featureIcon}>
    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
  </svg>
);

const TrackerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.featureIcon}>
    <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
  </svg>
);

const AchievementIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.featureIcon}>
    <path fillRule="evenodd" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" clipRule="evenodd" />
  </svg>
);

interface IconProps {
  className?: string;
}

const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push('/login');
    }
  };

  const handleWorkoutsClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push('/login');
    }
  };

  return (
    <div className={styles.homeContainer}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <a href="/" className={styles.navbarLogo}>OmniFit</a>
        <div className={styles.navbarLinks}>
          <a 
            href="/dashboard" 
            className={styles.navbarLink}
            onClick={handleDashboardClick}
          >
            Dashboard
          </a>
          <a 
            href="/workouts" 
            className={styles.navbarLink}
            onClick={handleWorkoutsClick}
          >
            My Workouts
          </a>
          {isLoggedIn ? (
            <button onClick={handleLogout} className={styles.navbarLink}>
              Logout
            </button>
          ) : (
            <a href="/login" className={styles.navbarLink}>Login</a>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className={styles.heroSection}
        style={{
          backgroundImage: 'url(/images/gym.jpg)'
        }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Transform Your Fitness Journey</h1>
          <p className={styles.heroSubtitle}>
            OmniFit revolutionizes fitness tracking by combining gamification and adaptive workout recommendations. 
            Experience a dynamic, engaging fitness journey that keeps you motivated and helps you achieve your goals.
          </p>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className={styles.valueProposition}>
        <div className={styles.valueGrid}>
          <div className={styles.valueCard}>
            <WorkoutIcon />
            <h3 className={styles.valueTitle}>Adaptive Workouts</h3>
            <p className={styles.valueDescription}>
              Our intelligent system adapts to your progress, providing personalized workout recommendations that evolve with your fitness level. 
              Experience workouts that are always challenging yet achievable.
            </p>
          </div>
          <div className={styles.valueCard}>
            <TrackerIcon />
            <h3 className={styles.valueTitle}>Comprehensive Tracking</h3>
            <p className={styles.valueDescription}>
              Monitor your progress with detailed workout tracking, weight monitoring, and performance analytics. 
              Stay on top of your fitness goals with our intuitive tracking system.
            </p>
          </div>
          <div className={styles.valueCard}>
            <AchievementIcon />
            <h3 className={styles.valueTitle}>Gamified Experience</h3>
            <p className={styles.valueDescription}>
              Stay motivated with our XP system, achievements, and weekly challenges. 
              Transform your fitness journey into an engaging game that rewards your progress.
            </p>
          </div>
        </div>
      </section>

      {/* Highlight Section */}
      <section className={styles.highlightSection}>
        <h2 className={styles.highlightTitle}>Why Choose OmniFit?</h2>
        <div className={styles.highlightContent}>
          <p>
            Based on extensive research in digital health and behavioral psychology, OmniFit is designed to address the key challenges in maintaining consistent fitness routines:
          </p>
          <div className={styles.featureHighlight}>
            <CheckIcon className={styles.featureHighlightIcon} />
            <span className={styles.featureHighlightText}>Self-Determination Theory Integration</span>
          </div>
          <div className={styles.featureHighlight}>
            <CheckIcon className={styles.featureHighlightIcon} />
            <span className={styles.featureHighlightText}>Dynamic Gamification System</span>
          </div>
          <div className={styles.featureHighlight}>
            <CheckIcon className={styles.featureHighlightIcon} />
            <span className={styles.featureHighlightText}>Personalized Workout Adaptations</span>
          </div>
          <div className={styles.featureHighlight}>
            <CheckIcon className={styles.featureHighlightIcon} />
            <span className={styles.featureHighlightText}>Progress-Based Rewards</span>
          </div>
          <div className={styles.featureHighlight}>
            <CheckIcon className={styles.featureHighlightIcon} />
            <span className={styles.featureHighlightText}>Intuitive Progress Tracking</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Key Features</h2>
        <div className={styles.featuresGrid}>
          <div className={`${styles.featureCard} ${styles.animateFadeInUp}`}>
            <WorkoutIcon />
            <h3 className={styles.featureTitle}>Personalized Workouts</h3>
            <p className={styles.featureDescription}>
              Follow our PPL (Push, Pull, Legs) split program with customizable workouts, exercise tracking, and smart recommendations.
            </p>
          </div>
          <div className={`${styles.featureCard} ${styles.animateFadeInUp}`} style={{ animationDelay: '0.2s' }}>
            <TrackerIcon />
            <h3 className={styles.featureTitle}>Progress Tracking</h3>
            <p className={styles.featureDescription}>
              Monitor your daily workouts, track your weight, and visualize your progress with our intuitive calendar and tracking system.
            </p>
          </div>
          <div className={`${styles.featureCard} ${styles.animateFadeInUp}`} style={{ animationDelay: '0.4s' }}>
            <AchievementIcon />
            <h3 className={styles.featureTitle}>Achievements & Challenges</h3>
            <p className={styles.featureDescription}>
              Earn XP, unlock achievements, and complete weekly challenges to stay motivated on your fitness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className={styles.featureDetailSection}>
        <div className={styles.featureDetailGrid}>
          {/* Personalized Workouts Detail */}
          <div className={styles.featureDetailCard}>
            <div className={`${styles.featureDetailContent} ${styles.animateSlideInLeft}`}>
              <h3 className={styles.featureDetailTitle}>Smart Workout Planning</h3>
              <p className={styles.featureDetailDescription}>
                Our intelligent system creates personalized workout plans based on your fitness level, goals, and progress. 
                Experience workouts that adapt to your performance and keep you challenged.
              </p>
              <ul className={styles.featureDetailList}>
                <li className={styles.featureDetailItem}>
                  <CheckIcon className={styles.featureDetailIcon} />
                  <span>Dynamic exercise recommendations</span>
                </li>
                <li className={styles.featureDetailItem}>
                  <CheckIcon className={styles.featureDetailIcon} />
                  <span>Progressive overload tracking</span>
                </li>
                <li className={styles.featureDetailItem}>
                  <CheckIcon className={styles.featureDetailIcon} />
                  <span>Form and technique guidance</span>
                </li>
              </ul>
            </div>
            <div className={`${styles.animateSlideInRight}`}>
              <img 
                src="/images/workout-planning.jpg" 
                alt="Workout Planning" 
                className={styles.featureDetailImage}
              />
            </div>
          </div>

          {/* Progress Tracking Detail */}
          <div className={styles.featureDetailCard}>
            <div className={`${styles.animateSlideInRight}`}>
              <img 
                src="/images/progress-tracking.jpg" 
                alt="Progress Tracking" 
                className={styles.featureDetailImage}
              />
            </div>
            <div className={`${styles.featureDetailContent} ${styles.animateSlideInLeft}`}>
              <h3 className={styles.featureDetailTitle}>Comprehensive Progress Analytics</h3>
              <p className={styles.featureDetailDescription}>
                Track every aspect of your fitness journey with our detailed analytics dashboard. 
                Visualize your progress and make data-driven decisions to optimize your workouts.
              </p>
              <ul className={styles.featureDetailList}>
                <li className={styles.featureDetailItem}>
                  <CheckIcon className={styles.featureDetailIcon} />
                  <span>Weight and body measurements tracking</span>
                </li>
                <li className={styles.featureDetailItem}>
                  <CheckIcon className={styles.featureDetailIcon} />
                  <span>Workout history and performance trends</span>
                </li>
                <li className={styles.featureDetailItem}>
                  <CheckIcon className={styles.featureDetailIcon} />
                  <span>Customizable progress reports</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Gamification Detail */}
          <div className={styles.featureDetailCard}>
            <div className={`${styles.featureDetailContent} ${styles.animateSlideInLeft}`}>
              <h3 className={styles.featureDetailTitle}>Engaging Gamification System</h3>
              <p className={styles.featureDetailDescription}>
                Stay motivated with our innovative gamification features that make fitness fun and rewarding. 
                Earn achievements, complete challenges, and level up your fitness journey.
              </p>
              <ul className={styles.featureDetailList}>
                <li className={styles.featureDetailItem}>
                  <CheckIcon className={styles.featureDetailIcon} />
                  <span>XP and leveling system</span>
                </li>
                <li className={styles.featureDetailItem}>
                  <CheckIcon className={styles.featureDetailIcon} />
                  <span>Weekly and monthly challenges</span>
                </li>
                <li className={styles.featureDetailItem}>
                  <CheckIcon className={styles.featureDetailIcon} />
                  <span>Social features and leaderboards</span>
                </li>
              </ul>
            </div>
            <div className={`${styles.animateSlideInRight}`}>
              <img 
                src="/images/gamification.jpg" 
                alt="Gamification Features" 
                className={styles.featureDetailImage}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 