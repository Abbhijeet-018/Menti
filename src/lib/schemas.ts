import { z } from 'zod';

/* ========================================
   ROADMAP NODE SCHEMA
   ======================================== */

export const RoadmapNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['milestone', 'skill', 'role', 'project', 'certification']),
  phase: z.number(),
  phaseName: z.string(),
  description: z.string(),
  timeEstimate: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  category: z.string(),
  isOptional: z.boolean(),
  prerequisites: z.array(z.string()),
});

export type RoadmapNode = z.infer<typeof RoadmapNodeSchema>;

/* ========================================
   PHASE SCHEMA
   ======================================== */

export const PhaseSchema = z.object({
  phaseNumber: z.number(),
  phaseName: z.string(),
  description: z.string(),
});

export type Phase = z.infer<typeof PhaseSchema>;

/* ========================================
   FULL ROADMAP SCHEMA
   ======================================== */

export const RoadmapSchema = z.object({
  targetRole: z.string(),
  estimatedTimeline: z.string(),
  phases: z.array(PhaseSchema),
  nodes: z.array(RoadmapNodeSchema),
});

export type Roadmap = z.infer<typeof RoadmapSchema>;

/* ========================================
   NODE EXPANSION (Actionable Details)
   ======================================== */

export const WeekendProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  estimatedHours: z.number(),
});

export const GithubRepoSchema = z.object({
  name: z.string(),
  url: z.string(),
  why: z.string(),
});

export const ResourceSchema = z.object({
  title: z.string(),
  url: z.string(),
  type: z.enum(['course', 'article', 'video', 'documentation']),
});

export const NodeExpansionSchema = z.object({
  weekendProject: WeekendProjectSchema,
  githubRepos: z.array(GithubRepoSchema),
  interviewQuestions: z.array(z.string()),
  resources: z.array(ResourceSchema),
  proTip: z.string(),
});

export type NodeExpansion = z.infer<typeof NodeExpansionSchema>;

/* ========================================
   APP STATE TYPES
   ======================================== */

export type NodeStatus = 'locked' | 'available' | 'inProgress' | 'completed' | 'skipped';

export interface NodeState {
  status: NodeStatus;
  completedAt?: number;
}

export interface UserConstraints {
  hoursPerWeek: number;
  targetMonths: number | null; // null = no limit
  knownSkills: string[];
}
