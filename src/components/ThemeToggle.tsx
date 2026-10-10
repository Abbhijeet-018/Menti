'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ showLabel = true, className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Determine initial theme: check localStorage, otherwise default to light
    const savedTheme = localStorage.getItem('career_roadmapper_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('career_roadmapper_theme', nextTheme);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={`${styles.toggleBtn} ${className}`}
        aria-label="Toggle light or dark theme"
        disabled
      >
        <span className={styles.iconWrapper}>
          <Sun size={15} />
        </span>
        {showLabel && <span className={styles.label}>Light</span>}
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`${styles.toggleBtn} ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span
        className={styles.iconWrapper}
        style={{ transform: isDark ? 'rotate(360deg)' : 'rotate(0deg)' }}
      >
        {isDark ? <Moon size={15} /> : <Sun size={15} />}
      </span>
      {showLabel && (
        <span className={styles.label}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
}
