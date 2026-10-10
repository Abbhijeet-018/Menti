import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RoadmapSchema, NodeExpansionSchema, type UserConstraints } from './schemas';
import { generateFallbackRoadmap, generateFallbackNodeExpansion } from './fallbackRoadmaps';

/* ========================================
   AI CLIENTS (Groq Primary, Gemini Secondary)
   ======================================== */

function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Groq({ apiKey });
}

function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

/* ========================================
   SYSTEM PROMPTS
   ======================================== */

const ROADMAP_SYSTEM_PROMPT = `You are a career reverse-engineering AI. Given a user's exact dream job target, you must generate a detailed, realistic career roadmap as structured JSON.

CRITICAL RULES:
1. Generate 15-25 nodes organised into 4-6 phases (e.g., Foundation → Building Skills → Gaining Experience → Specialising → Job-Ready → Target Role).
2. Each node must be HIGHLY SPECIFIC to the user's target role, industry, and company type — NOT generic advice.
   - BAD: "Learn a frontend framework"
   - GOOD: "Build a carbon footprint dashboard with Next.js + D3.js" (for climate tech)
   - BAD: "Get a certification"
   - GOOD: "AWS Cloud Practitioner Certification" (for cloud roles)
3. Include a realistic MIX of node types:
   - "skill" — specific technical or soft skills to learn
   - "project" — concrete portfolio projects relevant to the target industry
   - "certification" — real, named certifications (not generic ones)
   - "role" — intermediate job positions to hold before the dream role
   - "milestone" — key achievement markers (e.g., "First open source contribution", "Land first internship")
4. Prerequisites must form a valid DAG (directed acyclic graph) — absolutely NO cycles. A node can only depend on nodes with a LOWER phase number or the same phase number but earlier in the list.
5. Include at least 2-3 nodes marked as isOptional: true for ambitious students.
6. Time estimates must be realistic for a college student.
7. Use REAL certifications, REAL tools, REAL technologies, and REAL job titles from the specific industry.
8. The first node(s) should have empty prerequisites arrays (they are the entry points).
9. Node IDs must follow the pattern: "node_001", "node_002", etc.

Return ONLY valid JSON matching this exact structure:
{
  "targetRole": "the user's dream role",
  "estimatedTimeline": "X-Y months",
  "phases": [
    { "phaseNumber": 1, "phaseName": "Phase Name", "description": "What this phase covers" }
  ],
  "nodes": [
    {
      "id": "node_001",
      "label": "Node Title",
      "type": "skill|project|certification|role|milestone",
      "phase": 1,
      "phaseName": "Phase Name",
      "description": "2-3 sentence description of what to do and why",
      "timeEstimate": "2-3 weeks",
      "difficulty": "beginner|intermediate|advanced",
      "category": "Category Name",
      "isOptional": false,
      "prerequisites": []
    }
  ]
}`;

const EXPAND_SYSTEM_PROMPT = `You are a career mentor AI. Given a specific roadmap node and the user's target role, generate highly specific, actionable advice.

RULES:
1. The weekend project must be directly relevant to both the skill AND the target industry.
2. GitHub repos must be REAL, well-known repositories that actually exist.
3. Interview questions must be specific to this exact skill, not generic.
4. Resources should include a mix of free courses, articles, and videos.
5. The pro tip should be insider advice that isn't obvious.

Return ONLY valid JSON:
{
  "weekendProject": {
    "title": "Project name",
    "description": "What to build and why it impresses recruiters",
    "techStack": ["tech1", "tech2"],
    "estimatedHours": 8
  },
  "githubRepos": [
    { "name": "repo-name", "url": "https://github.com/owner/repo", "why": "Why study this repo" }
  ],
  "interviewQuestions": ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"],
  "resources": [
    { "title": "Resource name", "url": "https://...", "type": "course|article|video|documentation" }
  ],
  "proTip": "An insider tip for mastering this skill"
}`;

const GROQ_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama3-70b-8192',
  'qwen/qwen3.8-27b',
];

/* ========================================
   GENERATE ROADMAP (Groq Primary)
   ======================================== */

export async function generateRoadmap(dreamJob: string, constraints?: UserConstraints) {
  let userPrompt = `Generate a career roadmap for this dream job: "${dreamJob}"`;

  if (constraints) {
    if (constraints.hoursPerWeek) {
      userPrompt += `\n\nThe user can dedicate ${constraints.hoursPerWeek} hours per week.`;
    }
    if (constraints.targetMonths) {
      userPrompt += ` They want to achieve this within ${constraints.targetMonths} months. Adjust the roadmap density accordingly.`;
    }
    if (constraints.knownSkills && constraints.knownSkills.length > 0) {
      userPrompt += `\n\nThe user already knows these skills: ${constraints.knownSkills.join(', ')}. Generate a roadmap that starts beyond these basics.`;
    }
  }

  // 1. Try Groq API (Ultra-Fast LPU Inference)
  const groq = getGroqClient();
  if (groq) {
    for (const modelName of GROQ_MODELS) {
      try {
        console.info(`Invoking Groq API (${modelName})...`);
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: ROADMAP_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          model: modelName,
          temperature: 0.5,
          response_format: { type: 'json_object' },
        });

        const responseText = completion.choices[0]?.message?.content;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          const validated = RoadmapSchema.safeParse(parsed);
          if (validated.success) {
            return validated.data;
          }
          console.warn('Groq Zod validation warnings:', validated.error.issues);
        }
      } catch (groqErr) {
        console.warn(`Groq model ${modelName} attempt failed:`, groqErr);
      }
    }
  }

  // 2. Secondary fallback: Gemini API
  const genAI = getGeminiClient();
  if (genAI) {
    const geminiModels = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.8-flash'];
    for (const geminiModel of geminiModels) {
      try {
        console.info(`Invoking Gemini API fallback (${geminiModel})...`);
        const model = genAI.getGenerativeModel({ model: geminiModel });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          systemInstruction: ROADMAP_SYSTEM_PROMPT,
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        });

        const responseText = result.response.text();
        const parsed = JSON.parse(responseText);
        const validated = RoadmapSchema.safeParse(parsed);
        if (validated.success) {
          return validated.data;
        }
      } catch (geminiErr) {
        console.warn(`Gemini model ${geminiModel} failed:`, geminiErr);
      }
    }
  }

  // 3. Built-in Deterministic Fallback Generator
  console.info('Using high-fidelity offline fallback roadmap.');
  return generateFallbackRoadmap(dreamJob, constraints);
}

/* ========================================
   EXPAND NODE (Actionable Details - Groq Primary)
   ======================================== */

export async function expandNode(nodeLabel: string, nodeDescription: string, targetRole: string) {
  const userPrompt = `Generate actionable advice for this career roadmap node:

Node: "${nodeLabel}"
Description: "${nodeDescription}"
User's Target Role: "${targetRole}"

Provide a weekend project idea, 3 distinct, real GitHub repos specifically about ${nodeLabel} to study, 5 interview questions, 3 learning resources, and a pro tip.`;

  // 1. Try Groq API
  const groq = getGroqClient();
  if (groq) {
    for (const modelName of GROQ_MODELS) {
      try {
        console.info(`Invoking Groq API for node expansion (${modelName})...`);
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: EXPAND_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          model: modelName,
          temperature: 0.5,
          response_format: { type: 'json_object' },
        });

        const responseText = completion.choices[0]?.message?.content;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          const validated = NodeExpansionSchema.safeParse(parsed);
          if (validated.success) {
            return validated.data;
          }
        }
      } catch (groqErr) {
        console.warn(`Groq expand model ${modelName} failed:`, groqErr);
      }
    }
  }

  // 2. Try Gemini API
  const genAI = getGeminiClient();
  if (genAI) {
    const geminiModels = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.8-flash'];
    for (const geminiModel of geminiModels) {
      try {
        const model = genAI.getGenerativeModel({ model: geminiModel });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          systemInstruction: EXPAND_SYSTEM_PROMPT,
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
          },
        });

        const responseText = result.response.text();
        const parsed = JSON.parse(responseText);
        const validated = NodeExpansionSchema.safeParse(parsed);
        if (validated.success) {
          return validated.data;
        }
      } catch (geminiErr) {
        console.warn(`Gemini expand ${geminiModel} failed:`, geminiErr);
      }
    }
  }

  // 3. Offline template
  return generateFallbackNodeExpansion(nodeLabel, nodeDescription, targetRole);
}
