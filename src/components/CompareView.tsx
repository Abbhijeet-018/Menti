'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  GitCompare,
  ArrowRight,
  Sparkles,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useRoadmapStore } from '@/store/roadmapStore';
import { generateFallbackRoadmap } from '@/lib/fallbackRoadmaps';
import type { Roadmap } from '@/lib/schemas';
import styles from './CompareView.module.css';

interface CompareViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMPARISON_PRESETS = [
  'Frontend Engineer at FAANG',
  'ML Engineer at a healthcare AI company',
  'DevOps Lead at a Series-B SaaS company',
  'Full Stack Developer at a climate tech startup',
  'Startup CTO / Technical Co-Founder',
  'Data Scientist in Healthcare',
];

export default function CompareView({ isOpen, onClose }: CompareViewProps) {
  const storeRoadmap = useRoadmapStore((s) => s.roadmap);
  const currentRoadmap = storeRoadmap || generateFallbackRoadmap('Frontend Engineer at FAANG');
  const [targetRoleB, setTargetRoleB] = useState('DevOps Lead at a Series-B SaaS company');
  const [comparisonRoadmap, setComparisonRoadmap] = useState<Roadmap | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const runComparison = (roleToCompare: string) => {
    setIsComparing(true);
    // Generate comparison roadmap
    setTimeout(() => {
      const rmB = generateFallbackRoadmap(roleToCompare);
      setComparisonRoadmap(rmB);
      setIsComparing(false);
    }, 400);
  };

  if (!isOpen) return null;

  // Compute Overlap
  const nodesA = currentRoadmap.nodes;
  const nodesB = comparisonRoadmap ? comparisonRoadmap.nodes : [];

  // Extract keywords / labels
  const getKeywords = (label: string) =>
    label
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['with', 'from', 'into', 'your', 'first', 'core'].includes(w));

  const sharedSkills: { nodeA: string; nodeB: string; topic: string }[] = [];
  const uniqueToA: string[] = [];
  const uniqueToB: string[] = [];

  if (comparisonRoadmap) {
    const matchedB = new Set<string>();

    nodesA.forEach((nA) => {
      const keysA = getKeywords(nA.label);
      let match = null;

      for (const nB of nodesB) {
        const keysB = getKeywords(nB.label);
        const common = keysA.filter((k) => keysB.includes(k));
        if (
          common.length > 0 ||
          (nA.category === nB.category && nA.category.length > 3) ||
          nA.type === 'certification' && nB.type === 'certification'
        ) {
          match = { nodeA: nA.label, nodeB: nB.label, topic: common[0] || nA.category };
          matchedB.add(nB.id);
          break;
        }
      }

      if (match) {
        sharedSkills.push(match);
      } else {
        uniqueToA.push(nA.label);
      }
    });

    nodesB.forEach((nB) => {
      if (!matchedB.has(nB.id)) {
        uniqueToB.push(nB.label);
      }
    });
  }

  const overlapPercent = comparisonRoadmap
    ? Math.min(90, Math.round((sharedSkills.length / Math.max(nodesA.length, nodesB.length)) * 100))
    : 0;

  return (
    <AnimatePresence>
      <div className={styles.backdrop} onClick={onClose}>
        <motion.div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <div className={styles.iconBadge}>
                <GitCompare size={20} />
              </div>
              <div>
                <h2 className={styles.title}>Career Path Comparison</h2>
                <p className={styles.subtitle}>
                  Analyze transferable stepping stones, skill overlaps, and transition timelines
                </p>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>

          {/* Target Role Selector */}
          <div className={styles.selectorBar}>
            <div className={styles.targetCardA}>
              <span className={styles.cardTag}>Primary Goal (A)</span>
              <h4 className={styles.roleTitle}>{currentRoadmap.targetRole}</h4>
              <span className={styles.timelineBadge}>
                <Clock size={12} /> {currentRoadmap.estimatedTimeline}
              </span>
            </div>

            <div className={styles.vsBadge}>VS</div>

            <div className={styles.targetCardB}>
              <span className={styles.cardTag}>Compare Against (B)</span>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  className={styles.inputRole}
                  value={targetRoleB}
                  onChange={(e) => setTargetRoleB(e.target.value)}
                  placeholder="Enter role to compare..."
                />
                <button
                  className="btn btn-primary"
                  onClick={() => runComparison(targetRoleB)}
                  disabled={isComparing}
                >
                  <Sparkles size={14} /> Compare
                </button>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className={styles.presets}>
            <span className={styles.presetLabel}>Quick Presets:</span>
            {COMPARISON_PRESETS.map((preset) => (
              <button
                key={preset}
                className={`${styles.presetBtn} ${targetRoleB === preset ? styles.presetActive : ''}`}
                onClick={() => {
                  setTargetRoleB(preset);
                  runComparison(preset);
                }}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Comparison Results */}
          {comparisonRoadmap ? (
            <div className={styles.resultsArea}>
              {/* Overlap Summary Card */}
              <div className={styles.statsBanner}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{overlapPercent}%</div>
                  <div className={styles.statLabel}>Skill Synergy Overlap</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{sharedSkills.length}</div>
                  <div className={styles.statLabel}>Transferable Stepping Stones</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>~{Math.round(sharedSkills.length * 2.5)} wks</div>
                  <div className={styles.statLabel}>Estimated Time Saved</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{uniqueToB.length}</div>
                  <div className={styles.statLabel}>New Competencies Needed</div>
                </div>
              </div>

              {/* Transferable Skills Grid */}
              <div className={styles.comparisonGrid}>
                {/* Shared Column */}
                <div className={styles.gridColumn}>
                  <div className={`${styles.columnHeader} ${styles.headerShared}`}>
                    <CheckCircle2 size={16} />
                    <span>Transferable / Shared Pillars ({sharedSkills.length})</span>
                  </div>
                  <div className={styles.nodeList}>
                    {sharedSkills.map((pair, idx) => (
                      <div key={idx} className={styles.sharedNodeItem}>
                        <div className={styles.nodeItemTitle}>{pair.nodeA}</div>
                        <div className={styles.nodeItemSub}>
                          <ArrowRight size={11} /> Also applies to: {pair.nodeB}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unique to B Column */}
                <div className={styles.gridColumn}>
                  <div className={`${styles.columnHeader} ${styles.headerUnique}`}>
                    <TrendingUp size={16} />
                    <span>Skills Unique to {comparisonRoadmap.targetRole} ({uniqueToB.length})</span>
                  </div>
                  <div className={styles.nodeList}>
                    {uniqueToB.map((item, idx) => (
                      <div key={idx} className={styles.uniqueNodeItem}>
                        <div className={styles.nodeItemTitle}>{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Layers size={36} className={styles.emptyIcon} />
              <p>Select or type a career role above and click <strong>Compare</strong> to see overlap analysis.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
