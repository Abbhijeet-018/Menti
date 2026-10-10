'use client';

import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ArrowLeft,
  GitCompare,
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  Loader2,
  Maximize2,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

import CustomNode from './CustomNode';
import NodeDetailPanel from './NodeDetailPanel';
import ProgressTracker from './ProgressTracker';
import CompareView from './CompareView';
import ThemeToggle from './ThemeToggle';
import { useRoadmapStore } from '@/store/roadmapStore';
import { layoutRoadmap } from '@/lib/graphLayout';
import styles from './RoadmapGraph.module.css';

/* ========================================
   REGISTER CUSTOM NODE TYPES
   ======================================== */

const nodeTypes: NodeTypes = {
  roadmapNode: CustomNode,
};

/* ========================================
   INNER GRAPH COMPONENT
   ======================================== */

interface RoadmapGraphProps {
  embedded?: boolean;
  onExpandFullscreen?: () => void;
  onExitFullscreen?: () => void;
}

function RoadmapGraphInner({
  embedded = false,
  onExpandFullscreen,
  onExitFullscreen,
}: RoadmapGraphProps) {
  const roadmap = useRoadmapStore((s) => s.roadmap);
  const nodeStates = useRoadmapStore((s) => s.nodeStates);
  const selectedNodeId = useRoadmapStore((s) => s.selectedNodeId);
  const resetRoadmap = useRoadmapStore((s) => s.resetRoadmap);
  const setRoadmap = useRoadmapStore((s) => s.setRoadmap);
  const reactFlowInstance = useReactFlow();
  const hasFitted = useRef(false);

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Compute laid-out nodes and edges
  const { nodes, edges } = useMemo(() => {
    if (!roadmap) return { nodes: [], edges: [] };
    return layoutRoadmap(roadmap, nodeStates);
  }, [roadmap, nodeStates]);

  // Fit view on first render
  useEffect(() => {
    if (nodes.length > 0 && !hasFitted.current) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
        hasFitted.current = true;
      }, 300);
    }
  }, [nodes, reactFlowInstance]);

  // Handle clicks on empty canvas to deselect
  const onPaneClick = useCallback(() => {
    const store = useRoadmapStore.getState();
    if (store.selectedNodeId) {
      store.selectNode(null);
    }
  }, []);

  // Export as PNG
  const handleExportPng = async () => {
    const rfElement = document.querySelector('.react-flow') as HTMLElement | null;
    if (!rfElement) return;

    try {
      setIsExporting(true);
      showToast('Generating high-res PNG...');
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const dataUrl = await toPng(rfElement, {
        backgroundColor: isDark ? '#06060f' : '#f8fafc',
        quality: 0.95,
      });
      const fileName = `${(roadmap?.targetRole || 'career-roadmap')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')}-roadmap.png`;
      saveAs(dataUrl, fileName);
      showToast('Roadmap PNG exported successfully!');
    } catch (err) {
      console.error('Export error:', err);
      showToast('Could not export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Share Link
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  // Reset Progress
  const handleResetProgress = () => {
    if (roadmap && confirm('Reset all progress milestones to start fresh?')) {
      setRoadmap(roadmap);
      showToast('Progress reset!');
    }
  };

  if (!roadmap) return null;

  return (
    <div className={embedded ? styles.graphContainerEmbedded : styles.graphContainer}>
      {/* Toast Feedback */}
      {toastMsg && <div className={styles.toast}>{toastMsg}</div>}

      {/* Progress Tracker Overlay */}
      <div className={styles.progressOverlay}>
        <ProgressTracker />
      </div>

      {/* Top Actions Bar */}
      <div className={styles.topActions}>
        {embedded ? (
          onExpandFullscreen && (
            <button
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              onClick={onExpandFullscreen}
              title="Open full interactive canvas workspace"
            >
              <Maximize2 size={14} /> Fullscreen Studio
            </button>
          )
        ) : (
          <button
            className={styles.actionBtn}
            onClick={onExitFullscreen || resetRoadmap}
            title="Return to Overview / Generator"
          >
            <ArrowLeft size={14} /> Overview
          </button>
        )}

        <button
          className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
          onClick={() => setIsCompareOpen(true)}
          title="Compare with another career path"
        >
          <GitCompare size={14} /> Compare Careers
        </button>

        <button
          className={styles.actionBtn}
          onClick={handleExportPng}
          disabled={isExporting}
          title="Download as PNG image"
        >
          {isExporting ? <Loader2 size={14} className="spin" /> : <Download size={14} />}
          Export PNG
        </button>

        <button
          className={styles.actionBtn}
          onClick={handleShare}
          title="Copy shareable link"
        >
          <Share2 size={14} /> Share
        </button>

        <button
          className={styles.actionBtn}
          onClick={handleResetProgress}
          title="Reset your milestone checkboxes"
        >
          <RotateCcw size={14} />
        </button>

        <ThemeToggle showLabel={false} />
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.dotAvailable}`} />
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.dotInProgress}`} />
          <span>In Progress</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.dotCompleted}`} />
          <span>Completed</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.dotSkipped}`} />
          <span>Skipped</span>
        </div>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onPaneClick={onPaneClick}
        fitView
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(100, 116, 139, 0.15)"
        />
        <Controls
          showInteractive={false}
          position="bottom-left"
        />
        <MiniMap
          nodeColor={(node) => {
            const status = node.data?.status as string;
            if (status === 'completed') return '#22c55e';
            if (status === 'inProgress') return '#3b82f6';
            if (status === 'skipped') return '#64748b';
            return '#6366f1';
          }}
          maskColor="rgba(6, 6, 15, 0.85)"
          position="bottom-right"
        />
      </ReactFlow>

      {/* Detail Panel */}
      <NodeDetailPanel />

      {/* Target Role Label */}
      <div className={styles.targetLabel}>
        <span className={styles.targetLabelText}>
          🎯 {roadmap.targetRole}
        </span>
        <span className={styles.targetTimeline}>
          Est. {roadmap.estimatedTimeline}
        </span>
      </div>

      {/* Comparison Modal */}
      <CompareView
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
    </div>
  );
}

/* ========================================
   WRAPPED EXPORT COMPONENT
   ======================================== */

export default function RoadmapGraph(props: RoadmapGraphProps) {
  return (
    <ReactFlowProvider>
      <RoadmapGraphInner {...props} />
    </ReactFlowProvider>
  );
}
