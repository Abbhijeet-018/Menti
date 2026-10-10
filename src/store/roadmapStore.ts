import { create } from 'zustand';
import type { Roadmap, NodeStatus, NodeExpansion, UserConstraints } from '@/lib/schemas';
import { calculateInitialStates, recalculateAvailability, calculateProgress } from '@/lib/graphLayout';

/* ========================================
   STORE INTERFACE
   ======================================== */

interface RoadmapState {
  // Core data
  roadmap: Roadmap | null;
  nodeStates: Record<string, NodeStatus>;
  nodeExpansions: Record<string, NodeExpansion>;

  // UI state
  selectedNodeId: string | null;
  isGenerating: boolean;
  isExpandingNode: boolean;
  generationError: string | null;
  dreamJob: string;
  constraints: UserConstraints;

  // Actions
  setDreamJob: (dreamJob: string) => void;
  setConstraints: (constraints: Partial<UserConstraints>) => void;
  setRoadmap: (roadmap: Roadmap) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationError: (error: string | null) => void;
  selectNode: (nodeId: string | null) => void;
  markCompleted: (nodeId: string) => void;
  markAsKnown: (nodeId: string) => void;
  markInProgress: (nodeId: string) => void;
  resetNode: (nodeId: string) => void;
  setNodeExpansion: (nodeId: string, expansion: NodeExpansion) => void;
  setIsExpandingNode: (isExpanding: boolean) => void;
  resetRoadmap: () => void;
  getProgress: () => { completed: number; total: number; percentage: number; phaseProgress: Record<number, { completed: number; total: number }> };

  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: (dreamJob: string) => boolean;
}

/* ========================================
   PERSISTENCE HELPERS
   ======================================== */

function getStorageKey(dreamJob: string): string {
  return `roadmap_${dreamJob.toLowerCase().replace(/\s+/g, '_').substring(0, 50)}`;
}

/* ========================================
   STORE
   ======================================== */

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  // Initial state
  roadmap: null,
  nodeStates: {},
  nodeExpansions: {},
  selectedNodeId: null,
  isGenerating: false,
  isExpandingNode: false,
  generationError: null,
  dreamJob: '',
  constraints: {
    hoursPerWeek: 15,
    targetMonths: null,
    knownSkills: [],
  },

  // Setters
  setDreamJob: (dreamJob) => set({ dreamJob }),

  setConstraints: (partial) =>
    set((state) => ({
      constraints: { ...state.constraints, ...partial },
    })),

  setRoadmap: (roadmap) => {
    const initialStates = calculateInitialStates(roadmap);
    set({
      roadmap,
      nodeStates: initialStates,
      nodeExpansions: {},
      selectedNodeId: null,
      generationError: null,
    });
    // Save after setting
    setTimeout(() => get().saveToLocalStorage(), 0);
  },

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setGenerationError: (error) => set({ generationError: error }),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  markCompleted: (nodeId) => {
    const { roadmap, nodeStates } = get();
    if (!roadmap) return;

    const updated = { ...nodeStates, [nodeId]: 'completed' as NodeStatus };
    const recalculated = recalculateAvailability(roadmap, updated);
    set({ nodeStates: recalculated });
    setTimeout(() => get().saveToLocalStorage(), 0);
  },

  markAsKnown: (nodeId) => {
    const { roadmap, nodeStates } = get();
    if (!roadmap) return;

    const updated = { ...nodeStates, [nodeId]: 'skipped' as NodeStatus };
    const recalculated = recalculateAvailability(roadmap, updated);
    set({ nodeStates: recalculated });
    setTimeout(() => get().saveToLocalStorage(), 0);
  },

  markInProgress: (nodeId) => {
    set((state) => ({
      nodeStates: { ...state.nodeStates, [nodeId]: 'inProgress' },
    }));
    setTimeout(() => get().saveToLocalStorage(), 0);
  },

  resetNode: (nodeId) => {
    const { roadmap, nodeStates } = get();
    if (!roadmap) return;

    const updated = { ...nodeStates, [nodeId]: 'available' as NodeStatus };
    const recalculated = recalculateAvailability(roadmap, updated);
    set({ nodeStates: recalculated });
    setTimeout(() => get().saveToLocalStorage(), 0);
  },

  setNodeExpansion: (nodeId, expansion) =>
    set((state) => ({
      nodeExpansions: { ...state.nodeExpansions, [nodeId]: expansion },
    })),

  setIsExpandingNode: (isExpanding) => set({ isExpandingNode: isExpanding }),

  resetRoadmap: () =>
    set({
      roadmap: null,
      nodeStates: {},
      nodeExpansions: {},
      selectedNodeId: null,
      generationError: null,
    }),

  getProgress: () => {
    const { roadmap, nodeStates } = get();
    if (!roadmap) return { completed: 0, total: 0, percentage: 0, phaseProgress: {} };
    return calculateProgress(roadmap, nodeStates);
  },

  // Persistence
  saveToLocalStorage: () => {
    const { dreamJob, roadmap, nodeStates, constraints } = get();
    if (!dreamJob || !roadmap) return;
    try {
      const key = getStorageKey(dreamJob);
      localStorage.setItem(
        key,
        JSON.stringify({ roadmap, nodeStates, constraints, savedAt: Date.now() })
      );
    } catch {
      // localStorage might be full or unavailable
    }
  },

  loadFromLocalStorage: (dreamJob) => {
    try {
      const key = getStorageKey(dreamJob);
      const stored = localStorage.getItem(key);
      if (!stored) return false;

      const data = JSON.parse(stored);
      if (data.roadmap && data.nodeStates) {
        set({
          roadmap: data.roadmap,
          nodeStates: data.nodeStates,
          constraints: data.constraints || get().constraints,
          dreamJob,
        });
        return true;
      }
    } catch {
      // Invalid data
    }
    return false;
  },
}));
