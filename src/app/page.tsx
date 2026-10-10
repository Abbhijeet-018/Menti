'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Sparkles,
  GitCompare,
  Layers,
  GitBranch,
  ShieldCheck,
  ArrowRight,
  Maximize2,
  MousePointerClick,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import DreamJobInput from '@/components/DreamJobInput';
import RoadmapGraph from '@/components/RoadmapGraph';
import CompareView from '@/components/CompareView';
import ThemeToggle from '@/components/ThemeToggle';
import { useRoadmapStore } from '@/store/roadmapStore';
import { generateFallbackRoadmap } from '@/lib/fallbackRoadmaps';
import styles from './page.module.css';

const DEMO_ROLES = [
  { id: 'faang', label: 'Frontend Engineer at FAANG', icon: '🖥️' },
  { id: 'ai', label: 'ML Engineer at an AI Startup', icon: '🤖' },
  { id: 'devops', label: 'DevOps Lead at Fintech', icon: '⚙️' },
  { id: 'data', label: 'Data Scientist in Healthcare', icon: '🧬' },
  { id: 'climate', label: 'Full Stack Developer at Climate Tech', icon: '🌱' },
];

export default function Home() {
  const roadmap = useRoadmapStore((s) => s.roadmap);
  const setRoadmap = useRoadmapStore((s) => s.setRoadmap);
  const [viewMode, setViewMode] = useState<'landing' | 'fullscreen'>('landing');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState(DEMO_ROLES[0].label);

  // Initialize with the first demo roadmap so the interactive canvas is immediately populated
  useEffect(() => {
    if (!roadmap) {
      const initial = generateFallbackRoadmap(DEMO_ROLES[0].label);
      setRoadmap(initial);
    }
  }, [roadmap, setRoadmap]);

  const handleSelectRole = (roleLabel: string) => {
    setActiveDemoRole(roleLabel);
    const newRoadmap = generateFallbackRoadmap(roleLabel);
    setRoadmap(newRoadmap);

    const el = document.getElementById('sandbox');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGenerated = () => {
    // Keep input box and landing page visible; smoothly scroll to live graph sandbox
    const el = document.getElementById('sandbox');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fullscreen studio view
  if (viewMode === 'fullscreen' && roadmap) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <RoadmapGraph
          embedded={false}
          onExitFullscreen={() => setViewMode('landing')}
        />
      </main>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* 1. STICKY NAVIGATION */}
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          <div
            className={styles.brand}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className={styles.brandIcon}>
              <MapPin size={18} />
            </div>
            <span>Career Roadmapper</span>
          </div>

          <nav className={styles.navLinks}>
            <a href="#generator" className={styles.navLink}>
              Role Generator
            </a>
            <a href="#sandbox" className={styles.navLink}>
              Interactive Graph
            </a>
            <a href="#features" className={styles.navLink}>
              Architecture
            </a>
            <a href="#compare" className={styles.navLink}>
              Compare Careers
            </a>
          </nav>

          <div className={styles.navActions}>
            <ThemeToggle showLabel={false} />
            <a href="#generator" className={`btn btn-primary ${styles.navCta}`}>
              Build My Path
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO & GENERATOR SECTION */}
      <section id="generator">
        <DreamJobInput
          isHero={true}
          showNav={false}
          onGenerated={handleGenerated}
          onSelectRole={handleSelectRole}
        />
      </section>

      {/* 3. LIVE INTERACTIVE GRAPH SANDBOX (ALL KEY COMPONENTS) */}
      <section id="sandbox" className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.badgePill}>
            <Sparkles size={13} />
            Live Graph Sandbox
          </div>
          <h2 className={styles.sectionTitle}>
            Inspect, Pan, and Test Prerequisites in Real-Time
          </h2>
          <p className={styles.sectionSubtitle}>
            Every career trajectory is a living dependency tree. Click any node to review actionable GitHub repositories, certifications, and technical interview questions.
          </p>
        </div>

        <div className={styles.sandboxContainer}>
          {/* Preset Role Switcher Tabs */}
          <div className={styles.roleTabsBar}>
            <span className={styles.roleTabLabel}>Select Path:</span>
            {DEMO_ROLES.map((demo) => {
              const isActive = activeDemoRole === demo.label;
              return (
                <button
                  key={demo.id}
                  className={`${styles.roleTab} ${isActive ? styles.roleTabActive : ''}`}
                  onClick={() => handleSelectRole(demo.label)}
                >
                  <span>{demo.icon}</span>
                  <span>{demo.label}</span>
                </button>
              );
            })}
          </div>

          {/* Embedded React Flow Canvas */}
          <RoadmapGraph
            embedded={true}
            onExpandFullscreen={() => setViewMode('fullscreen')}
          />

          {/* Canvas Tips & Quick Help */}
          <div className={styles.sandboxTipsRow}>
            <div className={styles.tipList}>
              <div className={styles.tipItem}>
                <MousePointerClick size={14} />
                <span>Click nodes for project blueprints & interview questions</span>
              </div>
              <div className={styles.tipItem}>
                <CheckCircle2 size={14} />
                <span>Mark completed to unlock downstream dependencies</span>
              </div>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => setIsCompareOpen(true)}
            >
              <GitCompare size={14} /> Launch Career Comparator
            </button>
          </div>
        </div>
      </section>

      {/* 4. ARCHITECTURE & SPECIFICATIONS (NO AI SLOP) */}
      <section id="features" className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.badgePill}>
            <Layers size={13} />
            System Architecture
          </div>
          <h2 className={styles.sectionTitle}>
            Engineered for Precision, Not Generic Advice
          </h2>
          <p className={styles.sectionSubtitle}>
            Most career guides provide vague reading lists. We construct structured, verifiable competency pipelines.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <GitBranch size={22} />
            </div>
            <h3 className={styles.featureHeading}>Topological DAG Ordering</h3>
            <p className={styles.featureBody}>
              Skills are organised into a Directed Acyclic Graph (DAG) with strict prerequisite chains. Advanced concepts remain locked until foundational competencies are verified.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <BookOpen size={22} />
            </div>
            <h3 className={styles.featureHeading}>Concrete Portfolio Targets</h3>
            <p className={styles.featureBody}>
              Every milestone links directly to production repositories to build from scratch, industry-recognized credentials, and mock technical interview questions.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <ShieldCheck size={22} />
            </div>
            <h3 className={styles.featureHeading}>Calculated Hour Allocations</h3>
            <p className={styles.featureBody}>
              Timelines adapt to your actual schedule (5 to 40 hrs/week). Mark what you already know to automatically bypass mastered nodes and compress your graduation date.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CAREER COMPARATOR SHOWCASE */}
      <section id="compare" className={styles.section}>
        <div className={styles.compareBanner}>
          <div className={styles.compareInfo}>
            <div className={styles.badgePill}>
              <GitCompare size={13} />
              Career Pivot Analysis
            </div>
            <h2 className={styles.compareTitle}>
              Pivoting Directions? Measure Your Overlap First
            </h2>
            <p className={styles.compareDesc}>
              Compare any two engineering paths side-by-side. Calculate shared foundation percentages, identify transferable skills, and evaluate the incremental study time needed to transition.
            </p>
            <div className={styles.compareStatsRow}>
              <div className={styles.statItem}>
                <span className={styles.statVal}>40-60%</span>
                <span className={styles.statLab}>Typical Shared Core</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>&lt; 300 hrs</span>
                <span className={styles.statLab}>Average Pivot Delta</span>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => setIsCompareOpen(true)}
          >
            <GitCompare size={16} /> Open Career Comparator
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* 6. CLEAN FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.footerBrandTitle}>Career Roadmapper</div>
            <p className={styles.footerBrandText}>
              Reverse-engineering dream tech roles into interactive visual skill trees with actionable milestones, real repositories, and interview rubrics.
            </p>
          </div>

          <div className={styles.footerMeta}>
            <span>All progress saved locally</span>
            <span>•</span>
            <span>React Flow DAG</span>
            <span>•</span>
            <span>Next.js Turbopack</span>
          </div>
        </div>
      </footer>

      {/* Comparison Modal */}
      <CompareView
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
    </div>
  );
}
