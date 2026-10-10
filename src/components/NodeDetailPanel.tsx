'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  SkipForward,
  RotateCcw,
  Clock,
  Hammer,
  GitBranch,
  HelpCircle,
  BookOpen,
  Lightbulb,
  ExternalLink,
  Play,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRoadmapStore } from '@/store/roadmapStore';
import { generateFallbackNodeExpansion } from '@/lib/fallbackRoadmaps';
import styles from './NodeDetailPanel.module.css';

export default function NodeDetailPanel() {
  const roadmap = useRoadmapStore((s) => s.roadmap);
  const selectedNodeId = useRoadmapStore((s) => s.selectedNodeId);
  const nodeStates = useRoadmapStore((s) => s.nodeStates);
  const nodeExpansions = useRoadmapStore((s) => s.nodeExpansions);
  const isExpandingNode = useRoadmapStore((s) => s.isExpandingNode);
  const selectNode = useRoadmapStore((s) => s.selectNode);
  const markCompleted = useRoadmapStore((s) => s.markCompleted);
  const markAsKnown = useRoadmapStore((s) => s.markAsKnown);
  const markInProgress = useRoadmapStore((s) => s.markInProgress);
  const resetNode = useRoadmapStore((s) => s.resetNode);
  const setNodeExpansion = useRoadmapStore((s) => s.setNodeExpansion);
  const setIsExpandingNode = useRoadmapStore((s) => s.setIsExpandingNode);

  const node = roadmap?.nodes.find((n) => n.id === selectedNodeId);
  const status = selectedNodeId ? nodeStates[selectedNodeId] : undefined;
  const expansion = selectedNodeId ? nodeExpansions[selectedNodeId] : undefined;

  const fetchedNodesRef = React.useRef<Set<string>>(new Set());

  // Fetch expansion when node is selected and not yet fetched
  useEffect(() => {
    if (!selectedNodeId || !node || !roadmap) return;

    // Provide instant tailored advice immediately so the user never sees empty UI
    if (!nodeExpansions[selectedNodeId]) {
      const instantFallback = generateFallbackNodeExpansion(
        node.label,
        node.description || '',
        roadmap.targetRole
      );
      setNodeExpansion(selectedNodeId, instantFallback);
    }

    // Only invoke AI expansion once per node
    if (fetchedNodesRef.current.has(selectedNodeId)) return;
    fetchedNodesRef.current.add(selectedNodeId);

    let isMounted = true;
    const fetchExpansion = async () => {
      setIsExpandingNode(true);
      try {
        const res = await fetch('/api/expand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nodeLabel: node.label,
            nodeDescription: node.description,
            targetRole: roadmap.targetRole,
          }),
        });

        if (!res.ok) throw new Error('Failed to expand node');

        const data = await res.json();
        if (isMounted && data && Array.isArray(data.githubRepos)) {
          setNodeExpansion(selectedNodeId, data);
        }
      } catch (error) {
        console.info('Using tailored fallback advice:', error);
      } finally {
        if (isMounted) {
          setIsExpandingNode(false);
        }
      }
    };

    fetchExpansion();

    return () => {
      isMounted = false;
    };
  }, [selectedNodeId, node?.label, roadmap?.targetRole]);

  return (
    <AnimatePresence mode="wait">
      {node && selectedNodeId && (
        <motion.div
          key={selectedNodeId}
          className={styles.panel}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        >
          {/* Close Button */}
          <button className={styles.closeBtn} onClick={() => selectNode(null)}>
            <X size={18} />
          </button>

          {/* Header */}
          <div className={styles.header}>
            <span className={`badge badge-${getTypeBadgeColor(node.type)}`}>
              {node.type}
            </span>
            <h3 className={styles.title}>{node.label}</h3>
            <p className={styles.description}>{node.description}</p>

            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <Clock size={13} />
                {node.timeEstimate}
              </span>
              <span className={styles.metaItem}>
                {node.difficulty}
              </span>
              <span className={styles.metaItem}>
                {node.category}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            {status !== 'completed' && status !== 'skipped' && (
              <>
                {status !== 'inProgress' && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => markInProgress(selectedNodeId)}
                  >
                    <Play size={14} /> Start Learning
                  </button>
                )}
                <button
                  className="btn btn-success"
                  onClick={() => {
                    markCompleted(selectedNodeId);
                    confetti({
                      particleCount: 75,
                      spread: 60,
                      origin: { y: 0.7 },
                      colors: ['#22c55e', '#6366f1', '#3b82f6', '#f59e0b'],
                    });
                  }}
                >
                  <Check size={14} /> Mark Complete
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => markAsKnown(selectedNodeId)}
                >
                  <SkipForward size={14} /> I Already Know This
                </button>
              </>
            )}
            {(status === 'completed' || status === 'skipped') && (
              <button
                className="btn btn-ghost"
                onClick={() => resetNode(selectedNodeId)}
              >
                <RotateCcw size={14} /> Reset
              </button>
            )}
          </div>

          {/* Expansion Content */}
          <div className={styles.expansionContent}>
            {isExpandingNode && !expansion ? (
              <div className={styles.loadingState}>
                <Loader2 size={24} className={styles.loadingSpinner} />
                <p>Generating actionable advice...</p>
              </div>
            ) : expansion ? (
              <>
                {/* Weekend Project */}
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <Hammer size={15} /> Weekend Project
                  </h4>
                  <div className={styles.projectCard}>
                    <h5>{expansion.weekendProject.title}</h5>
                    <p>{expansion.weekendProject.description}</p>
                    <div className={styles.techStack}>
                      {expansion.weekendProject.techStack.map((tech) => (
                        <span key={tech} className="badge badge-indigo">{tech}</span>
                      ))}
                    </div>
                    <span className={styles.hours}>
                      <Clock size={12} /> ~{expansion.weekendProject.estimatedHours}h
                    </span>
                  </div>
                </section>

                {/* GitHub Repos */}
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <GitBranch size={15} /> Repos to Study
                  </h4>
                  <div className={styles.repoList}>
                    {expansion.githubRepos.map((repo) => (
                      <a
                        key={repo.url}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.repoItem}
                      >
                        <div className={styles.repoName}>
                          {repo.name}
                          <ExternalLink size={11} />
                        </div>
                        <p className={styles.repoWhy}>{repo.why}</p>
                      </a>
                    ))}
                  </div>
                </section>

                {/* Interview Questions */}
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <HelpCircle size={15} /> Interview Questions
                  </h4>
                  <ol className={styles.questionList}>
                    {expansion.interviewQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ol>
                </section>

                {/* Resources */}
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <BookOpen size={15} /> Learning Resources
                  </h4>
                  <div className={styles.resourceList}>
                    {expansion.resources.map((res) => (
                      <a
                        key={res.url}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resourceItem}
                      >
                        <span className={`badge badge-${getResourceBadge(res.type)}`}>
                          {res.type}
                        </span>
                        <span>{res.title}</span>
                        <ExternalLink size={11} />
                      </a>
                    ))}
                  </div>
                </section>

                {/* Pro Tip */}
                <section className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <Lightbulb size={15} /> Pro Tip
                  </h4>
                  <div className={styles.proTip}>
                    {expansion.proTip}
                  </div>
                </section>
              </>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function getTypeBadgeColor(type: string): string {
  const map: Record<string, string> = {
    milestone: 'amber',
    skill: 'indigo',
    role: 'cyan',
    project: 'green',
    certification: 'purple',
  };
  return map[type] || 'indigo';
}

function getResourceBadge(type: string): string {
  const map: Record<string, string> = {
    course: 'indigo',
    article: 'green',
    video: 'red',
    documentation: 'cyan',
  };
  return map[type] || 'indigo';
}
