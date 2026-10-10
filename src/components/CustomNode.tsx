'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import {
  Target,
  Brain,
  Briefcase,
  Code2,
  Award,
  Lock,
  Check,
  SkipForward,
  Clock,
  Loader2,
} from 'lucide-react';
import { useRoadmapStore } from '@/store/roadmapStore';
import type { NodeStatus } from '@/lib/schemas';
import styles from './CustomNode.module.css';

/* ========================================
   TYPE ICONS
   ======================================== */

const typeIcons: Record<string, React.ReactNode> = {
  milestone: <Target size={16} />,
  skill: <Brain size={16} />,
  role: <Briefcase size={16} />,
  project: <Code2 size={16} />,
  certification: <Award size={16} />,
};

/* ========================================
   DIFFICULTY DOTS
   ======================================== */

function DifficultyDots({ level }: { level: string }) {
  const filled = level === 'beginner' ? 1 : level === 'intermediate' ? 2 : 3;
  return (
    <div className={styles.difficultyDots}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`${styles.dot} ${i <= filled ? styles.dotFilled : styles.dotEmpty}`}
        />
      ))}
    </div>
  );
}

/* ========================================
   STATUS INDICATOR
   ======================================== */

function StatusIndicator({ status }: { status: NodeStatus }) {
  if (status === 'completed') return <Check size={12} className={styles.statusIconCompleted} />;
  if (status === 'skipped') return <SkipForward size={12} className={styles.statusIconSkipped} />;
  if (status === 'inProgress') return <Loader2 size={12} className={styles.statusIconProgress} />;
  return null;
}

/* ========================================
   CUSTOM NODE COMPONENT
   ======================================== */

interface CustomNodeData {
  id: string;
  label: string;
  type: string;
  phase: number;
  phaseName: string;
  description: string;
  timeEstimate: string;
  difficulty: string;
  category: string;
  isOptional: boolean;
  status: NodeStatus;
  prerequisites: string[];
}

function CustomNodeComponent({ data }: { data: CustomNodeData }) {
  const selectNode = useRoadmapStore((s) => s.selectNode);
  const selectedNodeId = useRoadmapStore((s) => s.selectedNodeId);
  const isSelected = selectedNodeId === data.id;

  const handleClick = () => {
    selectNode(isSelected ? null : data.id);
  };

  return (
    <>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <motion.div
        className={`${styles.node} ${styles[`node_${data.type}`]} ${styles[`status_${data.status}`]} ${isSelected ? styles.nodeSelected : ''}`}
        onClick={handleClick}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ cursor: 'pointer' }}
      >
        {/* Header Row */}
        <div className={styles.nodeHeader}>
          <div className={styles.nodeTypeTag}>
            {typeIcons[data.type]}
            <span>{data.category}</span>
          </div>
          <StatusIndicator status={data.status} />
        </div>

        {/* Label */}
        <h4 className={`${styles.nodeLabel} ${data.status === 'skipped' ? styles.labelSkipped : ''}`}>
          {data.label}
        </h4>

        {/* Footer Row */}
        <div className={styles.nodeFooter}>
          <div className={styles.timeEstimate}>
            <Clock size={11} />
            <span>{data.timeEstimate}</span>
          </div>
          <DifficultyDots level={data.difficulty} />
        </div>

        {/* Optional Badge */}
        {data.isOptional && (
          <div className={styles.optionalBadge}>Optional</div>
        )}

        {/* Glow effect for available nodes */}
        {data.status === 'available' && <div className={styles.pulseRing} />}
      </motion.div>
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </>
  );
}

export default memo(CustomNodeComponent);
