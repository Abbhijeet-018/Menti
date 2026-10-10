import dagre from 'dagre';
import type { Roadmap, RoadmapNode } from './schemas';
import type { Node, Edge } from '@xyflow/react';
import type { NodeStatus } from './schemas';

/* ========================================
   NODE DIMENSIONS BY TYPE
   ======================================== */

const NODE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  milestone: { width: 260, height: 110 },
  skill: { width: 240, height: 100 },
  role: { width: 250, height: 105 },
  project: { width: 250, height: 105 },
  certification: { width: 250, height: 105 },
};

/* ========================================
   EDGE STYLE HELPER
   ======================================== */

function getEdgeStyle(sourceStatus: NodeStatus, targetStatus: NodeStatus) {
  if (sourceStatus === 'completed' && targetStatus === 'completed') {
    return {
      stroke: 'rgba(34, 197, 94, 0.5)',
      strokeWidth: 2.5,
    };
  }
  if (sourceStatus === 'completed' && (targetStatus === 'available' || targetStatus === 'inProgress')) {
    return {
      stroke: 'rgba(99, 102, 241, 0.5)',
      strokeWidth: 2,
    };
  }
  return {
    stroke: 'rgba(100, 116, 139, 0.2)',
    strokeWidth: 1.5,
  };
}

/* ========================================
   LAYOUT ROADMAP WITH DAGRE
   ======================================== */

export interface LayoutResult {
  nodes: Node[];
  edges: Edge[];
}

export function layoutRoadmap(
  roadmap: Roadmap,
  nodeStates: Record<string, NodeStatus>
): LayoutResult {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'TB',
    ranksep: 140,
    nodesep: 80,
    marginx: 60,
    marginy: 60,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes
  roadmap.nodes.forEach((node: RoadmapNode) => {
    const dim = NODE_DIMENSIONS[node.type] || NODE_DIMENSIONS.skill;
    g.setNode(node.id, { width: dim.width, height: dim.height });
  });

  // Add edges from prerequisites
  roadmap.nodes.forEach((node: RoadmapNode) => {
    node.prerequisites.forEach((prereqId: string) => {
      // Validate the prerequisite exists
      if (roadmap.nodes.find((n: RoadmapNode) => n.id === prereqId)) {
        g.setEdge(prereqId, node.id);
      }
    });
  });

  // Run layout
  dagre.layout(g);

  // Build React Flow nodes
  const flowNodes: Node[] = roadmap.nodes.map((node: RoadmapNode) => {
    const dagreNode = g.node(node.id);
    const dim = NODE_DIMENSIONS[node.type] || NODE_DIMENSIONS.skill;
    const status = nodeStates[node.id] || 'locked';

    return {
      id: node.id,
      type: 'roadmapNode', // Custom node component
      position: {
        x: dagreNode.x - dim.width / 2,
        y: dagreNode.y - dim.height / 2,
      },
      data: {
        ...node,
        status,
      },
    };
  });

  // Build React Flow edges
  const flowEdges: Edge[] = [];
  roadmap.nodes.forEach((node: RoadmapNode) => {
    node.prerequisites.forEach((prereqId: string) => {
      if (roadmap.nodes.find((n: RoadmapNode) => n.id === prereqId)) {
        const sourceStatus = nodeStates[prereqId] || 'locked';
        const targetStatus = nodeStates[node.id] || 'locked';
        const style = getEdgeStyle(sourceStatus, targetStatus);
        const isAnimated = sourceStatus === 'completed' &&
          (targetStatus === 'available' || targetStatus === 'inProgress');

        flowEdges.push({
          id: `${prereqId}-${node.id}`,
          source: prereqId,
          target: node.id,
          type: 'smoothstep',
          animated: isAnimated,
          style,
          className: sourceStatus === 'completed' && targetStatus === 'completed' ? 'edge-completed' : '',
        });
      }
    });
  });

  return { nodes: flowNodes, edges: flowEdges };
}

/* ========================================
   CALCULATE INITIAL NODE STATES
   ======================================== */

export function calculateInitialStates(roadmap: Roadmap): Record<string, NodeStatus> {
  const states: Record<string, NodeStatus> = {};

  roadmap.nodes.forEach((node: RoadmapNode) => {
    // All nodes are unlocked and immediately open to explore and learn
    states[node.id] = 'available';
  });

  return states;
}

/* ========================================
   RECALCULATE AVAILABILITY (CASCADE)
   ======================================== */

export function recalculateAvailability(
  roadmap: Roadmap,
  currentStates: Record<string, NodeStatus>
): Record<string, NodeStatus> {
  const newStates = { ...currentStates };

  roadmap.nodes.forEach((node: RoadmapNode) => {
    const currentStatus = newStates[node.id];
    // If a node was previously locked or undefined, make it available
    if (!currentStatus || currentStatus === 'locked') {
      newStates[node.id] = 'available';
    }
  });

  return newStates;
}

/* ========================================
   CALCULATE PROGRESS
   ======================================== */

export function calculateProgress(
  roadmap: Roadmap,
  nodeStates: Record<string, NodeStatus>
): {
  completed: number;
  total: number;
  percentage: number;
  phaseProgress: Record<number, { completed: number; total: number }>;
} {
  const total = roadmap.nodes.filter((n: RoadmapNode) => !n.isOptional).length;
  const completed = roadmap.nodes.filter(
    (n: RoadmapNode) =>
      !n.isOptional &&
      (nodeStates[n.id] === 'completed' || nodeStates[n.id] === 'skipped')
  ).length;

  const phaseProgress: Record<number, { completed: number; total: number }> = {};
  roadmap.nodes.forEach((node: RoadmapNode) => {
    if (!phaseProgress[node.phase]) {
      phaseProgress[node.phase] = { completed: 0, total: 0 };
    }
    phaseProgress[node.phase].total++;
    if (nodeStates[node.id] === 'completed' || nodeStates[node.id] === 'skipped') {
      phaseProgress[node.phase].completed++;
    }
  });

  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    phaseProgress,
  };
}
