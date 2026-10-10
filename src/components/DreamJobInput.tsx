'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  MapPin,
  Zap,
} from 'lucide-react';
import { useRoadmapStore } from '@/store/roadmapStore';
import ThemeToggle from '@/components/ThemeToggle';
import styles from './DreamJobInput.module.css';

/* ========================================
   PLACEHOLDER EXAMPLES
   ======================================== */

const PLACEHOLDERS = [
  'Full Stack Developer at a climate tech startup',
  'UI/UX Designer for fintech apps',
  'ML Engineer at a healthcare AI company',
  'DevOps Lead at a Series-B SaaS company',
  'iOS Developer at a social media company',
  'Data Scientist in the renewable energy sector',
  'Backend Engineer at a fintech unicorn',
  'Product Manager at a Web3 startup',
];

const QUICK_TEMPLATES = [
  { label: 'Frontend Engineer at FAANG', icon: '🖥️' },
  { label: 'Data Scientist in Healthcare', icon: '🧬' },
  { label: 'ML Engineer at an AI Startup', icon: '🤖' },
  { label: 'DevOps Engineer at Fintech', icon: '⚙️' },
  { label: 'Mobile Developer at a Social App', icon: '📱' },
  { label: 'Startup CTO / Technical Co-Founder', icon: '🚀' },
];

/* ========================================
   LOADING MESSAGES
   ======================================== */

const LOADING_MESSAGES = [
  'Analysing your target role...',
  'Mapping required skills...',
  'Identifying stepping stones...',
  'Building your roadmap...',
  'Adding real certifications and projects...',
  'Almost there...',
];

/* ========================================
   COMPONENT
   ======================================== */

interface DreamJobInputProps {
  onGenerated: () => void;
  isHero?: boolean;
  showNav?: boolean;
  onSelectRole?: (role: string) => void;
}

export default function DreamJobInput({
  onGenerated,
  isHero = false,
  showNav = true,
  onSelectRole,
}: DreamJobInputProps) {
  const [input, setInput] = useState('');
  const [showConstraints, setShowConstraints] = useState(false);
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [targetMonths, setTargetMonths] = useState<number | null>(null);
  const [knownSkills, setKnownSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const isGenerating = useRoadmapStore((s) => s.isGenerating);
  const generationError = useRoadmapStore((s) => s.generationError);
  const setIsGenerating = useRoadmapStore((s) => s.setIsGenerating);
  const setGenerationError = useRoadmapStore((s) => s.setGenerationError);
  const setRoadmap = useRoadmapStore((s) => s.setRoadmap);
  const setDreamJob = useRoadmapStore((s) => s.setDreamJob);
  const setConstraints = useRoadmapStore((s) => s.setConstraints);

  // Cycle placeholders
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Cycle loading messages
  useEffect(() => {
    if (!isGenerating) {
      setLoadingMsgIdx(0);
      return;
    }
    const timer = setInterval(() => {
      setLoadingMsgIdx((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, 2500);
    return () => clearInterval(timer);
  }, [isGenerating]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !knownSkills.includes(trimmed)) {
      setKnownSkills([...knownSkills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setKnownSkills(knownSkills.filter((s) => s !== skill));
  };

  const handleGenerate = async () => {
    if (!input.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationError(null);
    setDreamJob(input.trim());
    setConstraints({
      hoursPerWeek,
      targetMonths,
      knownSkills,
    });

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamJob: input.trim(),
          constraints: {
            hoursPerWeek,
            targetMonths,
            knownSkills,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate roadmap');
      }

      const roadmap = await res.json();
      setRoadmap(roadmap);
      onGenerated();
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className={isHero ? styles.containerHero : styles.container}>
      {/* Top Navigation */}
      {showNav && (
        <header className={styles.topNav}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <MapPin size={18} />
            </div>
            <span>Career Roadmapper</span>
          </div>
          <ThemeToggle />
        </header>
      )}

      {/* Background Decorations */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.bgGlow3} />

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className={styles.header}>
          <motion.div
            className={styles.logoMark}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <MapPin size={28} />
          </motion.div>
          <h1 className={styles.title}>
            Reverse-engineer your{' '}
            <span className="gradient-text">dream career</span>
          </h1>
          <p className={styles.subtitle}>
            Enter your exact dream role. Our AI maps every realistic step to get there — 
            skills, projects, certifications, and intermediate roles.
          </p>
        </div>

        {/* Input */}
        <div className={styles.inputWrapper}>
          <div className={styles.inputContainer}>
            <Sparkles size={20} className={styles.inputIcon} />
            <input
              type="text"
              className={`${styles.dreamInput} input input-lg`}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
            />
          </div>

          {/* Constraints Toggle */}
          <button
            className={`${styles.constraintsToggle} btn btn-ghost`}
            onClick={() => setShowConstraints(!showConstraints)}
          >
            {showConstraints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Customise constraints
          </button>

          {/* Constraints Panel */}
          <AnimatePresence>
            {showConstraints && (
              <motion.div
                className={styles.constraintsPanel}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Hours per week */}
                <div className={styles.constraintRow}>
                  <label className={styles.constraintLabel}>
                    <Clock size={14} />
                    Hours per week: <strong>{hoursPerWeek}</strong>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className={styles.slider}
                  />
                </div>

                {/* Target timeline */}
                <div className={styles.constraintRow}>
                  <label className={styles.constraintLabel}>
                    <Calendar size={14} />
                    Target timeline
                  </label>
                  <select
                    className={`${styles.select} input`}
                    value={targetMonths ?? 'none'}
                    onChange={(e) =>
                      setTargetMonths(e.target.value === 'none' ? null : Number(e.target.value))
                    }
                  >
                    <option value="none">No limit</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="9">9 months</option>
                    <option value="12">12 months</option>
                    <option value="18">18 months</option>
                  </select>
                </div>

                {/* Known skills */}
                <div className={styles.constraintRow}>
                  <label className={styles.constraintLabel}>
                    <Zap size={14} />
                    Skills I already know
                  </label>
                  <div className={styles.skillInputRow}>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. React, Python, SQL..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <button className="btn btn-secondary" onClick={addSkill}>
                      Add
                    </button>
                  </div>
                  {knownSkills.length > 0 && (
                    <div className={styles.skillTags}>
                      {knownSkills.map((skill) => (
                        <span key={skill} className={styles.skillTag}>
                          {skill}
                          <button onClick={() => removeSkill(skill)}>
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <motion.button
            className={`${styles.generateBtn} btn btn-primary btn-lg`}
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className={styles.spinIcon} />
                {LOADING_MESSAGES[loadingMsgIdx]}
              </>
            ) : (
              <>
                Generate My Roadmap
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>

          {/* Error */}
          {generationError && (
            <motion.p
              className={styles.error}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {generationError}
            </motion.p>
          )}
        </div>

        {/* Quick Templates */}
        <div className={styles.templates}>
          <p className={styles.templatesLabel}>Or try one of these:</p>
          <div className={styles.templateGrid}>
            {QUICK_TEMPLATES.map((tpl) => (
              <motion.button
                key={tpl.label}
                className={styles.templateCard}
                onClick={() => {
                  setInput(tpl.label);
                  onSelectRole?.(tpl.label);
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={styles.templateIcon}>{tpl.icon}</span>
                <span className={styles.templateText}>{tpl.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
