'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2, Clock, Flame } from 'lucide-react';
import { useRoadmapStore } from '@/store/roadmapStore';
import styles from './ProgressTracker.module.css';

export default function ProgressTracker() {
  const roadmap = useRoadmapStore((s) => s.roadmap);
  const getProgress = useRoadmapStore((s) => s.getProgress);

  if (!roadmap) return null;

  const progress = getProgress();
  const phases = roadmap.phases;

  return (
    <div className={styles.tracker}>
      {/* Overall Progress */}
      <div className={styles.overallProgress}>
        <div className={styles.progressHeader}>
          <TrendingUp size={15} />
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressPercent}>{progress.percentage}%</span>
        </div>
        <div className={styles.progressBarOuter}>
          <motion.div
            className={styles.progressBarInner}
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className={styles.progressStats}>
          <span>
            <CheckCircle2 size={12} />
            {progress.completed}/{progress.total} steps
          </span>
          <span>
            <Clock size={12} />
            {roadmap.estimatedTimeline}
          </span>
        </div>
      </div>

      {/* Phase Breakdown */}
      <div className={styles.phases}>
        {phases.map((phase) => {
          const pp = progress.phaseProgress[phase.phaseNumber];
          if (!pp) return null;
          const phasePct = pp.total > 0 ? Math.round((pp.completed / pp.total) * 100) : 0;
          const isComplete = phasePct === 100;

          return (
            <div key={phase.phaseNumber} className={styles.phaseItem}>
              <div className={styles.phaseHeader}>
                <span className={styles.phaseName}>
                  {isComplete && <Flame size={11} className={styles.flameIcon} />}
                  {phase.phaseName}
                </span>
                <span className={styles.phasePct}>{phasePct}%</span>
              </div>
              <div className={styles.phaseBarOuter}>
                <motion.div
                  className={`${styles.phaseBarInner} ${isComplete ? styles.phaseBarComplete : ''}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${phasePct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: phase.phaseNumber * 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
