'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../login.module.css';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Username' && password === 'Password') {
      login();
      router.push('/');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(/images/gym.jpg)'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Login Container */}
        <div className={styles.loginContainer}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeHeading}>
              Welcome to OmniFit!
            </h1>
            <p className={styles.welcomeText}>
              Your personal fitness companion.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                placeholder="Enter your username"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className={styles.button}
              >
                Login
              </button>
            </div>
          </form>

          <div className={styles.switchAccount}>
            <p className={styles.switchAccountText}>
              Don't have an account? <a href="/create-account" className={styles.switchAccountLink}>Create Account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 