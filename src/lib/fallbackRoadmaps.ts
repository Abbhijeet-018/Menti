import type { Roadmap, NodeExpansion, UserConstraints } from './schemas';

/* ==========================================================================
   HIGH-FIDELITY FALLBACK / OFFLINE ROADMAP GENERATOR
   Ensures app works seamlessly out-of-the-box even without an API key.
   ========================================================================== */

export function generateFallbackRoadmap(dreamJob: string, constraints?: UserConstraints): Roadmap {
  const roleLower = dreamJob.toLowerCase();
  const hours = constraints?.hoursPerWeek || 15;
  const known = constraints?.knownSkills || [];

  if (roleLower.includes('climate') || roleLower.includes('energy')) {
    return getClimateTechRoadmap(dreamJob, hours, known);
  } else if (roleLower.includes('faang') || roleLower.includes('frontend')) {
    return getFrontendFAANGRoadmap(dreamJob, hours, known);
  } else if (roleLower.includes('health') || (roleLower.includes('ai') && roleLower.includes('health'))) {
    return getHealthcareAIRoadmap(dreamJob, hours, known);
  } else if (roleLower.includes('devops') || roleLower.includes('sre') || roleLower.includes('cloud')) {
    return getDevOpsRoadmap(dreamJob, hours, known);
  } else if (roleLower.includes('data') || roleLower.includes('scientist')) {
    return getDataScientistRoadmap(dreamJob, hours, known);
  } else if (roleLower.includes('cto') || roleLower.includes('founder')) {
    return getStartupCTORoadmap(dreamJob, hours, known);
  } else if (roleLower.includes('fintech') || roleLower.includes('finance')) {
    return getFintechRoadmap(dreamJob, hours, known);
  }

  return getGenericTechRoadmap(dreamJob, hours, known);
}

function getClimateTechRoadmap(targetRole: string, hours: number, known: string[]): Roadmap {
  return {
    targetRole,
    estimatedTimeline: hours >= 25 ? '6-8 months' : '10-14 months',
    phases: [
      { phaseNumber: 1, phaseName: 'Foundations & Energy Metrics', description: 'Core web fundamentals coupled with climate greenhouse gas (GHG) accounting standards.' },
      { phaseNumber: 2, phaseName: 'Full Stack Architecture & Geospatial Data', description: 'Interactive mapping, spatial queries, and responsive full-stack dashboards.' },
      { phaseNumber: 3, phaseName: 'Climate API Integrations & Streaming', description: 'Handling weather, solar irradiance, and carbon intensity grid APIs in real time.' },
      { phaseNumber: 4, phaseName: 'High-Impact Portfolio & Open Source', description: 'Building verifiable climate applications and contributing to public climate data repos.' },
      { phaseNumber: 5, phaseName: 'Target Role Stepping Stone & Placement', description: 'Targeted interviewing for green tech accelerators, B-Corps, and Series-A climate ventures.' },
    ],
    nodes: [
      {
        id: 'node_001',
        label: 'TypeScript & Modern React 19',
        type: 'skill',
        phase: 1,
        phaseName: 'Foundations & Energy Metrics',
        description: 'Master strict TypeScript patterns, modern state management, and reusable UI architecture.',
        timeEstimate: '3-4 weeks',
        difficulty: 'beginner',
        category: 'Frontend',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_002',
        label: 'GHG Protocol & Carbon Accounting Basics',
        type: 'skill',
        phase: 1,
        phaseName: 'Foundations & Energy Metrics',
        description: 'Understand Scope 1, 2, and 3 emissions math, emission factor databases, and carbon offset reporting.',
        timeEstimate: '2 weeks',
        difficulty: 'beginner',
        category: 'Domain Knowledge',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_003',
        label: 'Node.js & PostgreSQL with PostGIS',
        type: 'skill',
        phase: 2,
        phaseName: 'Full Stack Architecture & Geospatial Data',
        description: 'Store geospatial coordinates and perform boundary-based spatial emission calculations with PostGIS.',
        timeEstimate: '3-4 weeks',
        difficulty: 'intermediate',
        category: 'Backend',
        isOptional: false,
        prerequisites: ['node_001'],
      },
      {
        id: 'node_004',
        label: 'D3.js & Mapbox GL Geospatial Visualisation',
        type: 'skill',
        phase: 2,
        phaseName: 'Full Stack Architecture & Geospatial Data',
        description: 'Render chloropleth maps of carbon emission zones and dynamic time-series power grids.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'Data Visualisation',
        isOptional: false,
        prerequisites: ['node_001'],
      },
      {
        id: 'node_005',
        label: 'Carbon Footprint Interactive Dashboard',
        type: 'project',
        phase: 2,
        phaseName: 'Full Stack Architecture & Geospatial Data',
        description: 'Build a production Next.js app visualizing live supply chain scope emissions with D3 charts and PostGIS.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'Portfolio Project',
        isOptional: false,
        prerequisites: ['node_003', 'node_004', 'node_002'],
      },
      {
        id: 'node_006',
        label: 'Real-Time Grid Intensity & OpenMeteo APIs',
        type: 'skill',
        phase: 3,
        phaseName: 'Climate API Integrations & Streaming',
        description: 'Ingest live electricity grid emission feeds (WattTime/ElectricityMap) and solar forecasting data.',
        timeEstimate: '2-3 weeks',
        difficulty: 'intermediate',
        category: 'APIs & Streaming',
        isOptional: false,
        prerequisites: ['node_003'],
      },
      {
        id: 'node_007',
        label: 'AWS Certified Cloud Practitioner',
        type: 'certification',
        phase: 3,
        phaseName: 'Climate API Integrations & Streaming',
        description: 'Validate cloud infrastructure knowledge for deploying serverless climate data ingestion pipelines.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'Cloud Certification',
        isOptional: true,
        prerequisites: ['node_003'],
      },
      {
        id: 'node_008',
        label: 'Green Software Foundation Principles',
        type: 'milestone',
        phase: 3,
        phaseName: 'Climate API Integrations & Streaming',
        description: 'Adopt carbon-aware computing: scheduling CPU-intensive workloads during green energy surplus periods.',
        timeEstimate: '1-2 weeks',
        difficulty: 'intermediate',
        category: 'Best Practices',
        isOptional: false,
        prerequisites: ['node_006'],
      },
      {
        id: 'node_009',
        label: 'Contribute to Open Climate Fix',
        type: 'project',
        phase: 4,
        phaseName: 'High-Impact Portfolio & Open Source',
        description: 'Submit PRs to open-source solar PV forecasting tools and climate ML benchmark datasets.',
        timeEstimate: '4 weeks',
        difficulty: 'advanced',
        category: 'Open Source',
        isOptional: false,
        prerequisites: ['node_005', 'node_008'],
      },
      {
        id: 'node_010',
        label: 'IoT Telemetry Pipeline for Smart Solar Meters',
        type: 'project',
        phase: 4,
        phaseName: 'High-Impact Portfolio & Open Source',
        description: 'Implement MQTT + WebSockets pipeline delivering sub-second kilowatt consumption metrics.',
        timeEstimate: '3-4 weeks',
        difficulty: 'advanced',
        category: 'Portfolio Project',
        isOptional: false,
        prerequisites: ['node_006', 'node_005'],
      },
      {
        id: 'node_011',
        label: 'Junior Full Stack Engineer (Climate / Cleantech)',
        type: 'role',
        phase: 4,
        phaseName: 'High-Impact Portfolio & Open Source',
        description: 'First professional stepping stone: building reporting pipelines at an environmental consultancy or B-Corp.',
        timeEstimate: '6-9 months',
        difficulty: 'intermediate',
        category: 'Stepping Stone Role',
        isOptional: true,
        prerequisites: ['node_009', 'node_010'],
      },
      {
        id: 'node_012',
        label: 'System Design for High-Throughput Climate Data',
        type: 'skill',
        phase: 5,
        phaseName: 'Target Role Stepping Stone & Placement',
        description: 'Master time-series partitioning, Redis caching for live feeds, and distributed worker queues.',
        timeEstimate: '3 weeks',
        difficulty: 'advanced',
        category: 'System Design',
        isOptional: false,
        prerequisites: ['node_010'],
      },
      {
        id: 'node_013',
        label: 'Green Tech Interview Case Studies & Whiteboarding',
        type: 'milestone',
        phase: 5,
        phaseName: 'Target Role Stepping Stone & Placement',
        description: 'Prepare for real-world design rounds: ESG audit logging, real-time grid alerts, and scalable SaaS multi-tenancy.',
        timeEstimate: '2-3 weeks',
        difficulty: 'advanced',
        category: 'Interview Prep',
        isOptional: false,
        prerequisites: ['node_012'],
      },
      {
        id: 'node_014',
        label: targetRole,
        type: 'role',
        phase: 5,
        phaseName: 'Target Role Stepping Stone & Placement',
        description: 'Congratulations! Stepping into your dream role building sustainable software for global climate impact.',
        timeEstimate: 'Target Role',
        difficulty: 'advanced',
        category: 'Dream Goal',
        isOptional: false,
        prerequisites: ['node_013'],
      },
    ],
  };
}

function getFrontendFAANGRoadmap(targetRole: string, hours: number, known: string[]): Roadmap {
  return {
    targetRole,
    estimatedTimeline: hours >= 25 ? '7-9 months' : '10-14 months',
    phases: [
      { phaseNumber: 1, phaseName: 'Deep Web Fundamentals & DSA', description: 'JavaScript runtime mechanics, DOM tree rendering algorithms, and Big-O complexity.' },
      { phaseNumber: 2, phaseName: 'Advanced React Internals & Architecture', description: 'Fiber reconciler, concurrent rendering, memory leak debugging, and micro-frontends.' },
      { phaseNumber: 3, phaseName: 'Web Performance & Large-Scale Systems', description: 'Core Web Vitals, bundle tree-shaking, streaming SSR, and edge compute rendering.' },
      { phaseNumber: 4, phaseName: 'Production Flagship Projects', description: 'Architecting complex client apps: real-time collaborative whiteboards and spreadsheet engines.' },
      { phaseNumber: 5, phaseName: 'FAANG Loop & System Design Mastery', description: 'Frontend system design interviews, behavioral leadership principles, and offer negotiation.' },
    ],
    nodes: [
      {
        id: 'node_001',
        label: 'JS Engine Deep Dive (V8 & Event Loop)',
        type: 'skill',
        phase: 1,
        phaseName: 'Deep Web Fundamentals & DSA',
        description: 'Master microtasks vs macrotasks, call stack execution, garbage collection, and prototype chains.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'Language Core',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_002',
        label: 'Frontend Data Structures & Algorithms',
        type: 'skill',
        phase: 1,
        phaseName: 'Deep Web Fundamentals & DSA',
        description: 'Trie autocomplete, DOM tree BFS/DFS traversals, interval scheduling, and LRU caches in TypeScript.',
        timeEstimate: '4 weeks',
        difficulty: 'intermediate',
        category: 'Algorithms',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_003',
        label: 'React 19 Concurrent Internals & Fiber',
        type: 'skill',
        phase: 2,
        phaseName: 'Advanced React Internals & Architecture',
        description: 'Understand how React schedules priorities, transitions, Suspense boundaries, and memoization traps.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'Framework',
        isOptional: false,
        prerequisites: ['node_001'],
      },
      {
        id: 'node_004',
        label: 'State Machines & Complex State (XState / Zustand)',
        type: 'skill',
        phase: 2,
        phaseName: 'Advanced React Internals & Architecture',
        description: 'Model deterministic user flows with finite state machines and lean, immutable store patterns.',
        timeEstimate: '2-3 weeks',
        difficulty: 'intermediate',
        category: 'Architecture',
        isOptional: false,
        prerequisites: ['node_003'],
      },
      {
        id: 'node_005',
        label: 'Core Web Vitals & Profiling Optimization',
        type: 'skill',
        phase: 3,
        phaseName: 'Web Performance & Large-Scale Systems',
        description: 'Diagnose INP, LCP, CLS, long tasks via Chrome DevTools Performance Profiler, and reduce TBT.',
        timeEstimate: '3 weeks',
        difficulty: 'advanced',
        category: 'Performance',
        isOptional: false,
        prerequisites: ['node_003'],
      },
      {
        id: 'node_006',
        label: 'Web Accessibility (WCAG 2.2 AAA & ARIA)',
        type: 'skill',
        phase: 3,
        phaseName: 'Web Performance & Large-Scale Systems',
        description: 'Build keyboard focus traps, screen-reader announced live regions, and high-contrast accessible widgets.',
        timeEstimate: '2 weeks',
        difficulty: 'intermediate',
        category: 'Accessibility',
        isOptional: true,
        prerequisites: ['node_001'],
      },
      {
        id: 'node_007',
        label: 'Real-Time Collaborative Canvas App',
        type: 'project',
        phase: 4,
        phaseName: 'Production Flagship Projects',
        description: 'Build a Figma-like vector board with WebSockets, CRDTs (Yjs), and WebGL rendering for thousands of shapes.',
        timeEstimate: '4-5 weeks',
        difficulty: 'advanced',
        category: 'Portfolio Flagship',
        isOptional: false,
        prerequisites: ['node_004', 'node_005'],
      },
      {
        id: 'node_008',
        label: 'High-Volume Infinite Virtualized Grid',
        type: 'project',
        phase: 4,
        phaseName: 'Production Flagship Projects',
        description: 'Custom windowing engine rendering 1,000,000 spreadsheet rows at constant 60 FPS without DOM thrashing.',
        timeEstimate: '3 weeks',
        difficulty: 'advanced',
        category: 'Performance Project',
        isOptional: false,
        prerequisites: ['node_005', 'node_002'],
      },
      {
        id: 'node_009',
        label: 'Frontend System Design at Scale',
        type: 'skill',
        phase: 5,
        phaseName: 'FAANG Loop & System Design Mastery',
        description: 'Design Newsfeed, Chat, Typeahead, and Photo Upload for 500M+ users with caching, polling, and pagination.',
        timeEstimate: '3-4 weeks',
        difficulty: 'advanced',
        category: 'System Design',
        isOptional: false,
        prerequisites: ['node_007', 'node_008'],
      },
      {
        id: 'node_010',
        label: 'FAANG Behavioral & Leadership Principles',
        type: 'milestone',
        phase: 5,
        phaseName: 'FAANG Loop & System Design Mastery',
        description: 'Craft 12+ STAR method stories demonstrating customer obsession, technical disagreement, and ownership.',
        timeEstimate: '2 weeks',
        difficulty: 'intermediate',
        category: 'Interview Preparation',
        isOptional: false,
        prerequisites: ['node_009'],
      },
      {
        id: 'node_011',
        label: targetRole,
        type: 'role',
        phase: 5,
        phaseName: 'FAANG Loop & System Design Mastery',
        description: 'Landing an offer at Meta, Google, Apple, Amazon, or Netflix as an L4/L5 Frontend Engineer.',
        timeEstimate: 'Target Goal',
        difficulty: 'advanced',
        category: 'Dream Goal',
        isOptional: false,
        prerequisites: ['node_010'],
      },
    ],
  };
}

function getHealthcareAIRoadmap(targetRole: string, hours: number, known: string[]): Roadmap {
  return {
    targetRole,
    estimatedTimeline: hours >= 25 ? '8-10 months' : '12-16 months',
    phases: [
      { phaseNumber: 1, phaseName: 'Medical Informatics & Math Foundations', description: 'Linear algebra, probabilistic modeling, DICOM imaging formats, and HIPAA compliance.' },
      { phaseNumber: 2, phaseName: 'Computer Vision & Deep Learning in Radiology', description: 'PyTorch, segmentation (U-Net, MONAI), and transfer learning for pathology detection.' },
      { phaseNumber: 3, phaseName: 'Clinical NLP & Electronic Health Records', description: 'ClinicalBERT, BioGPT, medical entity recognition, and FHIR standard data modeling.' },
      { phaseNumber: 4, phaseName: 'FDA Regulated MLOps & Clinical Validation', description: 'Model interpretability (SHAP/Grad-CAM), drift detection, and reproducible pipeline validation.' },
      { phaseNumber: 5, phaseName: 'Healthcare AI Placement & Clinical Trials', description: 'Landing roles at diagnostics AI startups, biotech unicorns, and academic medical centers.' },
    ],
    nodes: [
      {
        id: 'node_001',
        label: 'Advanced PyTorch & Medical Image Formats',
        type: 'skill',
        phase: 1,
        phaseName: 'Medical Informatics & Math Foundations',
        description: 'Master tensor manipulation, 3D volumetric data processing, and DICOM / NIfTI file parsers.',
        timeEstimate: '3-4 weeks',
        difficulty: 'intermediate',
        category: 'Framework & Data',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_002',
        label: 'HIPAA, GDPR & Medical Ethics for Engineers',
        type: 'milestone',
        phase: 1,
        phaseName: 'Medical Informatics & Math Foundations',
        description: 'Understand patient privacy, de-identification algorithms, and ethical bias in diagnostic training data.',
        timeEstimate: '2 weeks',
        difficulty: 'beginner',
        category: 'Compliance',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_003',
        label: 'MONAI Framework for Healthcare Imaging',
        type: 'skill',
        phase: 2,
        phaseName: 'Computer Vision & Deep Learning in Radiology',
        description: 'Leverage NVIDIA MONAI for organ segmentation, lesion detection, and specialized medical transforms.',
        timeEstimate: '3-4 weeks',
        difficulty: 'advanced',
        category: 'Deep Learning',
        isOptional: false,
        prerequisites: ['node_001'],
      },
      {
        id: 'node_004',
        label: 'Brain Tumor MRI Segmentation App',
        type: 'project',
        phase: 2,
        phaseName: 'Computer Vision & Deep Learning in Radiology',
        description: 'Train a 3D U-Net on BraTS dataset with Dice score > 0.88; deploy web viewer with Grad-CAM overlays.',
        timeEstimate: '4 weeks',
        difficulty: 'advanced',
        category: 'Portfolio Project',
        isOptional: false,
        prerequisites: ['node_003', 'node_002'],
      },
      {
        id: 'node_005',
        label: 'Clinical NLP & FHIR Interoperability',
        type: 'skill',
        phase: 3,
        phaseName: 'Clinical NLP & Electronic Health Records',
        description: 'Extract ICD-10 billing codes and medical dosages from doctor clinical notes using ClinicalBERT.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'NLP & Data Standards',
        isOptional: false,
        prerequisites: ['node_001'],
      },
      {
        id: 'node_006',
        label: 'Automated Clinical Trial Matcher',
        type: 'project',
        phase: 3,
        phaseName: 'Clinical NLP & Electronic Health Records',
        description: 'RAG pipeline matching patient EHR records against ClinicalTrials.gov eligibility criteria.',
        timeEstimate: '3 weeks',
        difficulty: 'advanced',
        category: 'Portfolio Project',
        isOptional: false,
        prerequisites: ['node_005'],
      },
      {
        id: 'node_007',
        label: 'Model Explainability (SHAP, LIME, Grad-CAM)',
        type: 'skill',
        phase: 4,
        phaseName: 'FDA Regulated MLOps & Clinical Validation',
        description: 'Doctors reject black-box models. Produce pixel-level attribution maps justifying every diagnostic output.',
        timeEstimate: '2-3 weeks',
        difficulty: 'advanced',
        category: 'Explainable AI',
        isOptional: false,
        prerequisites: ['node_004'],
      },
      {
        id: 'node_008',
        label: 'AWS Certified Machine Learning - Specialty',
        type: 'certification',
        phase: 4,
        phaseName: 'FDA Regulated MLOps & Clinical Validation',
        description: 'Industry-standard certification validating end-to-end cloud ML pipelines and secure model deployment.',
        timeEstimate: '4 weeks',
        difficulty: 'advanced',
        category: 'Certification',
        isOptional: true,
        prerequisites: ['node_007'],
      },
      {
        id: 'node_009',
        label: 'Junior ML Engineer (HealthTech / Biotech)',
        type: 'role',
        phase: 4,
        phaseName: 'FDA Regulated MLOps & Clinical Validation',
        description: 'First job role contributing to preclinical screening or medical imaging QA pipelines.',
        timeEstimate: '6-12 months',
        difficulty: 'intermediate',
        category: 'Stepping Stone Role',
        isOptional: true,
        prerequisites: ['node_006', 'node_007'],
      },
      {
        id: 'node_010',
        label: targetRole,
        type: 'role',
        phase: 5,
        phaseName: 'Healthcare AI Placement & Clinical Trials',
        description: 'Full-fledged ML Engineer driving clinical-grade AI diagnostics in healthcare enterprises.',
        timeEstimate: 'Target Goal',
        difficulty: 'advanced',
        category: 'Dream Goal',
        isOptional: false,
        prerequisites: ['node_007'],
      },
    ],
  };
}

function getDevOpsRoadmap(targetRole: string, hours: number, known: string[]): Roadmap {
  return {
    targetRole,
    estimatedTimeline: hours >= 25 ? '6-8 months' : '9-12 months',
    phases: [
      { phaseNumber: 1, phaseName: 'Linux Internals & Containerization', description: 'Kernel namespaces, cgroups, systemd, networking layers, and Docker container hardening.' },
      { phaseNumber: 2, phaseName: 'Kubernetes Orchestration & Helm', description: 'Pods, ingress controllers, statefulsets, custom resource definitions (CRDs), and operators.' },
      { phaseNumber: 3, phaseName: 'Infrastructure as Code (Terraform) & Cloud', description: 'Multi-region VPC provisioning, AWS IAM least-privilege, and GitOps with ArgoCD.' },
      { phaseNumber: 4, phaseName: 'Observability & SRE Reliability Engineering', description: 'Prometheus metrics, Grafana alerting, OpenTelemetry distributed tracing, and chaos testing.' },
      { phaseNumber: 5, phaseName: 'Senior DevOps Leadership & Scaling', description: 'Zero-downtime blue/green deployments, SOC2 compliance automation, and incident post-mortems.' },
    ],
    nodes: [
      {
        id: 'node_001',
        label: 'Linux Kernel & System Administration',
        type: 'skill',
        phase: 1,
        phaseName: 'Linux Internals & Containerization',
        description: 'Master bash scripting, IPTables, socket debugging with strace, and process limits.',
        timeEstimate: '3 weeks',
        difficulty: 'beginner',
        category: 'OS Core',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_002',
        label: 'Docker & Multi-Stage Rootless Containers',
        type: 'skill',
        phase: 1,
        phaseName: 'Linux Internals & Containerization',
        description: 'Build minimal scratch images, scan for CVE vulnerabilities with Trivy, and avoid security leaks.',
        timeEstimate: '2 weeks',
        difficulty: 'beginner',
        category: 'Containers',
        isOptional: false,
        prerequisites: ['node_001'],
      },
      {
        id: 'node_003',
        label: 'Certified Kubernetes Administrator (CKA)',
        type: 'certification',
        phase: 2,
        phaseName: 'Kubernetes Orchestration & Helm',
        description: 'The gold standard practical exam testing cluster architecture, storage, and node troubleshooting.',
        timeEstimate: '5 weeks',
        difficulty: 'intermediate',
        category: 'Certification',
        isOptional: false,
        prerequisites: ['node_002'],
      },
      {
        id: 'node_004',
        label: 'GitOps Continuous Delivery with ArgoCD',
        type: 'skill',
        phase: 2,
        phaseName: 'Kubernetes Orchestration & Helm',
        description: 'Automate declarative Kubernetes cluster states synchronized with GitHub version control.',
        timeEstimate: '2 weeks',
        difficulty: 'intermediate',
        category: 'CI/CD',
        isOptional: false,
        prerequisites: ['node_003'],
      },
      {
        id: 'node_005',
        label: 'Terraform Associate (003) Certification',
        type: 'certification',
        phase: 3,
        phaseName: 'Infrastructure as Code (Terraform) & Cloud',
        description: 'Demonstrate mastery of modular infrastructure, remote state locking, and cloud abstraction.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'IaC Certification',
        isOptional: true,
        prerequisites: ['node_001'],
      },
      {
        id: 'node_006',
        label: 'Production Multi-Region VPC on AWS',
        type: 'project',
        phase: 3,
        phaseName: 'Infrastructure as Code (Terraform) & Cloud',
        description: 'Provision automated high-availability EKS cluster with NAT gateways, bastion hosts, and secret management.',
        timeEstimate: '3-4 weeks',
        difficulty: 'advanced',
        category: 'Portfolio Project',
        isOptional: false,
        prerequisites: ['node_003', 'node_005'],
      },
      {
        id: 'node_007',
        label: 'Prometheus & OpenTelemetry Full Stack Observability',
        type: 'skill',
        phase: 4,
        phaseName: 'Observability & SRE Reliability Engineering',
        description: 'Instrument custom RED metrics (Rate, Errors, Duration) and distributed traces across microservices.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'Observability',
        isOptional: false,
        prerequisites: ['node_004', 'node_006'],
      },
      {
        id: 'node_008',
        label: 'Chaos Engineering with Chaos Mesh',
        type: 'project',
        phase: 4,
        phaseName: 'Observability & SRE Reliability Engineering',
        description: 'Inject network packet drops and node evictions to verify automated self-healing and alert routing.',
        timeEstimate: '2-3 weeks',
        difficulty: 'advanced',
        category: 'SRE Project',
        isOptional: false,
        prerequisites: ['node_007'],
      },
      {
        id: 'node_009',
        label: 'Cloud Infrastructure / SRE Engineer',
        type: 'role',
        phase: 4,
        phaseName: 'Observability & SRE Reliability Engineering',
        description: 'Junior or Mid role managing uptime, incident response on-call rotations, and cloud cost optimization.',
        timeEstimate: '6-12 months',
        difficulty: 'intermediate',
        category: 'Stepping Stone Role',
        isOptional: true,
        prerequisites: ['node_008'],
      },
      {
        id: 'node_010',
        label: targetRole,
        type: 'role',
        phase: 5,
        phaseName: 'Senior DevOps Leadership & Scaling',
        description: 'Directing DevOps automation, security audits, and infrastructure strategy for high-growth tech.',
        timeEstimate: 'Target Goal',
        difficulty: 'advanced',
        category: 'Dream Goal',
        isOptional: false,
        prerequisites: ['node_008'],
      },
    ],
  };
}

function getDataScientistRoadmap(targetRole: string, hours: number, known: string[]): Roadmap {
  return {
    targetRole,
    estimatedTimeline: hours >= 25 ? '6-8 months' : '9-12 months',
    phases: [
      { phaseNumber: 1, phaseName: 'Statistical Inference & Python Analytics', description: 'Probability distributions, hypothesis testing, Pandas vectorization, and data wrangling.' },
      { phaseNumber: 2, phaseName: 'Machine Learning Algorithms & Feature Engineering', description: 'Scikit-learn, XGBoost, hyperparameter tuning with Optuna, and cross-validation.' },
      { phaseNumber: 3, phaseName: 'Deep Learning & Unstructured Data', description: 'Neural networks, embeddings, vector search, and transfer learning.' },
      { phaseNumber: 4, phaseName: 'Production Analytics & Business Impact', description: 'A/B testing frameworks, uplift modeling, dashboarding (Streamlit), and SQL optimization.' },
      { phaseNumber: 5, phaseName: 'Data Science Career Placement', description: 'Technical case study presentations, product sense interviews, and target company placement.' },
    ],
    nodes: [
      {
        id: 'node_001',
        label: 'Advanced Python, NumPy & Vectorization',
        type: 'skill',
        phase: 1,
        phaseName: 'Statistical Inference & Python Analytics',
        description: 'Write performant data processing code avoiding slow Python loops using vectorized operations.',
        timeEstimate: '3 weeks',
        difficulty: 'beginner',
        category: 'Programming',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_002',
        label: 'Bayesian & Frequentist Statistics',
        type: 'skill',
        phase: 1,
        phaseName: 'Statistical Inference & Python Analytics',
        description: 'Master p-values, confidence intervals, power analysis, and experiment sample size calculation.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'Math & Stats',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_003',
        label: 'Supervised Learning & Gradient Boosting (XGBoost)',
        type: 'skill',
        phase: 2,
        phaseName: 'Machine Learning Algorithms & Feature Engineering',
        description: 'Build robust classification and regression pipelines with cross-validation and feature selection.',
        timeEstimate: '4 weeks',
        difficulty: 'intermediate',
        category: 'Machine Learning',
        isOptional: false,
        prerequisites: ['node_001', 'node_002'],
      },
      {
        id: 'node_004',
        label: 'Customer Churn & Lifetime Value Predictor',
        type: 'project',
        phase: 2,
        phaseName: 'Machine Learning Algorithms & Feature Engineering',
        description: 'End-to-end ML model deployed with FastAPI predicting subscriber churn probability with SHAP insights.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'Portfolio Project',
        isOptional: false,
        prerequisites: ['node_003'],
      },
      {
        id: 'node_005',
        label: 'A/B Experimentation Engine & Causal Inference',
        type: 'skill',
        phase: 3,
        phaseName: 'Deep Learning & Unstructured Data',
        description: 'Design rigorous randomized trials, mitigate network interference effects, and compute CUPED variance reduction.',
        timeEstimate: '3 weeks',
        difficulty: 'advanced',
        category: 'Product Analytics',
        isOptional: false,
        prerequisites: ['node_002', 'node_004'],
      },
      {
        id: 'node_006',
        label: 'Semantic Search Engine with Vector Embeddings',
        type: 'project',
        phase: 3,
        phaseName: 'Deep Learning & Unstructured Data',
        description: 'Build hybrid BM25 + dense neural embedding retriever with Qdrant for 100K+ document corpus.',
        timeEstimate: '3-4 weeks',
        difficulty: 'advanced',
        category: 'Portfolio Project',
        isOptional: false,
        prerequisites: ['node_003'],
      },
      {
        id: 'node_007',
        label: 'Junior Data Analyst / Associate Scientist',
        type: 'role',
        phase: 4,
        phaseName: 'Production Analytics & Business Impact',
        description: 'Entry-level industry role translating business queries to metric dashboards and exploratory models.',
        timeEstimate: '6-9 months',
        difficulty: 'intermediate',
        category: 'Stepping Stone Role',
        isOptional: true,
        prerequisites: ['node_004'],
      },
      {
        id: 'node_008',
        label: targetRole,
        type: 'role',
        phase: 5,
        phaseName: 'Data Science Career Placement',
        description: 'Guiding quantitative strategic decisions and production AI algorithms in your dream role.',
        timeEstimate: 'Target Goal',
        difficulty: 'advanced',
        category: 'Dream Goal',
        isOptional: false,
        prerequisites: ['node_005', 'node_006'],
      },
    ],
  };
}

function getStartupCTORoadmap(targetRole: string, hours: number, known: string[]): Roadmap {
  return {
    targetRole,
    estimatedTimeline: '12-18 months',
    phases: [
      { phaseNumber: 1, phaseName: 'Full-Stack Rapid Prototyping', description: 'Next.js, Tailwind, Supabase, and shipping MVP apps in under 48 hours.' },
      { phaseNumber: 2, phaseName: 'Scalable System Architecture & Cloud', description: 'Designing serverless, caching, database indexing, and fault tolerance on modest budgets.' },
      { phaseNumber: 3, phaseName: 'Product Engineering & User Analytics', description: 'PostHog analytics, customer discovery interviews, funnel optimization, and telemetry.' },
      { phaseNumber: 4, phaseName: 'Hiring, Tech Debt & Engineering Culture', description: 'Code review practices, sprint management, hiring first 3 engineers, and vendor negotiation.' },
      { phaseNumber: 5, phaseName: 'Fundraising & Technical Leadership', description: 'Technical due diligence, SOC2 audits, investor pitch decks, and company launch.' },
    ],
    nodes: [
      {
        id: 'node_001',
        label: 'Zero-to-One Full Stack Framework (Next.js & Supabase)',
        type: 'skill',
        phase: 1,
        phaseName: 'Full-Stack Rapid Prototyping',
        description: 'Ship database schema, authentication, storage, and reactive UI from a single unified repository.',
        timeEstimate: '3 weeks',
        difficulty: 'beginner',
        category: 'Prototyping',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_002',
        label: 'Stripe Billing & SaaS Subscriptions',
        type: 'skill',
        phase: 1,
        phaseName: 'Full-Stack Rapid Prototyping',
        description: 'Implement usage-based billing, webhook idempotency, recurring subscriptions, and customer portal.',
        timeEstimate: '2 weeks',
        difficulty: 'intermediate',
        category: 'Monetization',
        isOptional: false,
        prerequisites: ['node_001'],
      },
      {
        id: 'node_003',
        label: 'Launch First Live Micro-SaaS MVP',
        type: 'milestone',
        phase: 1,
        phaseName: 'Full-Stack Rapid Prototyping',
        description: 'Deploy real product to ProductHunt / Twitter; acquire first 5 paying test users.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'Entrepreneurship',
        isOptional: false,
        prerequisites: ['node_002'],
      },
      {
        id: 'node_004',
        label: 'Pragmatic System Design on a Shoestring Budget',
        type: 'skill',
        phase: 2,
        phaseName: 'Scalable System Architecture & Cloud',
        description: 'Avoid premature Kubernetes overhead; leverage Cloudflare Workers, Upstash Redis, and Vercel edge.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'Architecture',
        isOptional: false,
        prerequisites: ['node_003'],
      },
      {
        id: 'node_005',
        label: 'Hiring & Engineering Management Playbook',
        type: 'skill',
        phase: 4,
        phaseName: 'Hiring, Tech Debt & Engineering Culture',
        description: 'Designing take-home tests, structuring equity packages (ESOP), and maintaining team velocity.',
        timeEstimate: '2-3 weeks',
        difficulty: 'intermediate',
        category: 'Management',
        isOptional: false,
        prerequisites: ['node_004'],
      },
      {
        id: 'node_006',
        label: targetRole,
        type: 'role',
        phase: 5,
        phaseName: 'Fundraising & Technical Leadership',
        description: 'Leading technology vision, product roadmap, and engineering organization as Technical Co-Founder.',
        timeEstimate: 'Target Goal',
        difficulty: 'advanced',
        category: 'Dream Goal',
        isOptional: false,
        prerequisites: ['node_005'],
      },
    ],
  };
}

function getFintechRoadmap(targetRole: string, hours: number, known: string[]): Roadmap {
  return {
    targetRole,
    estimatedTimeline: hours >= 25 ? '7-9 months' : '10-14 months',
    phases: [
      { phaseNumber: 1, phaseName: 'Financial Data & Strong Consistency', description: 'Double-entry bookkeeping math, ledger schemas, ACID transaction guarantees, and precision math.' },
      { phaseNumber: 2, phaseName: 'Distributed Ledger & Event Streaming', description: 'Kafka event sourcing, idempotency keys, banking APIs (Plaid), and fraud detection basics.' },
      { phaseNumber: 3, phaseName: 'Security, PCI-DSS & KYC Compliance', description: 'Encryption at rest/transit, cryptographic tokenization, secret vaults, and regulatory audits.' },
      { phaseNumber: 4, phaseName: 'Ultra-Reliable Financial Microservices', description: 'Building resilient payment gateways, ledger engines, and real-time reconciliation systems.' },
      { phaseNumber: 5, phaseName: 'Fintech Leadership & Unicorn Placement', description: 'Interview loops at Stripe, Plaid, Brex, Robinhood, or high-frequency trading shops.' },
    ],
    nodes: [
      {
        id: 'node_001',
        label: 'Double-Entry Bookkeeping & Ledger Math',
        type: 'skill',
        phase: 1,
        phaseName: 'Financial Data & Strong Consistency',
        description: 'Every transaction has equal debit and credit; avoid floating-point errors by using integer cents or Decimal128.',
        timeEstimate: '2-3 weeks',
        difficulty: 'intermediate',
        category: 'Fintech Math',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_002',
        label: 'ACID PostgreSQL & Row-Level Locking',
        type: 'skill',
        phase: 1,
        phaseName: 'Financial Data & Strong Consistency',
        description: 'Prevent race conditions, account balance overdrafts, and phantom reads using FOR UPDATE locks.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'Databases',
        isOptional: false,
        prerequisites: ['node_001'],
      },
      {
        id: 'node_003',
        label: 'Apache Kafka Event Sourcing for Transactions',
        type: 'skill',
        phase: 2,
        phaseName: 'Distributed Ledger & Event Streaming',
        description: 'Publish immutable transaction events with consumer group rebalances and exactly-once processing semantics.',
        timeEstimate: '4 weeks',
        difficulty: 'advanced',
        category: 'Event Streaming',
        isOptional: false,
        prerequisites: ['node_002'],
      },
      {
        id: 'node_004',
        label: 'Double-Entry Immutable Bank Ledger Engine',
        type: 'project',
        phase: 2,
        phaseName: 'Distributed Ledger & Event Streaming',
        description: 'Build a high-throughput financial ledger handling 5,000 tx/sec with guaranteed zero discrepancies.',
        timeEstimate: '4 weeks',
        difficulty: 'advanced',
        category: 'Portfolio Project',
        isOptional: false,
        prerequisites: ['node_002', 'node_003'],
      },
      {
        id: 'node_005',
        label: 'PCI-DSS v4.0 & Vault Secret Management',
        type: 'milestone',
        phase: 3,
        phaseName: 'Security, PCI-DSS & KYC Compliance',
        description: 'Zero cardholder data storage: client tokenization, HashiCorp Vault secrets, and TLS 1.3 mTLS.',
        timeEstimate: '3 weeks',
        difficulty: 'advanced',
        category: 'Compliance & Security',
        isOptional: false,
        prerequisites: ['node_002'],
      },
      {
        id: 'node_006',
        label: 'Real-Time Fraud Detection Engine',
        type: 'project',
        phase: 4,
        phaseName: 'Ultra-Reliable Financial Microservices',
        description: 'Score velocity risks, geolocation anomalies, and IP blacklists using Redis sliding window counters.',
        timeEstimate: '3-4 weeks',
        difficulty: 'advanced',
        category: 'Portfolio Project',
        isOptional: false,
        prerequisites: ['node_004', 'node_005'],
      },
      {
        id: 'node_007',
        label: targetRole,
        type: 'role',
        phase: 5,
        phaseName: 'Fintech Leadership & Unicorn Placement',
        description: 'Building the future of modern banking, payments, and global settlement infrastructure.',
        timeEstimate: 'Target Goal',
        difficulty: 'advanced',
        category: 'Dream Goal',
        isOptional: false,
        prerequisites: ['node_006'],
      },
    ],
  };
}

function getGenericTechRoadmap(targetRole: string, hours: number, known: string[]): Roadmap {
  return {
    targetRole,
    estimatedTimeline: hours >= 25 ? '6-8 months' : '9-12 months',
    phases: [
      { phaseNumber: 1, phaseName: 'Foundational Knowledge', description: `Core engineering fundamentals, programming languages, and tools required for ${targetRole}.` },
      { phaseNumber: 2, phaseName: 'Core Competencies & Frameworks', description: 'Intermediate domain-specific tooling, architecture paradigms, and testing.' },
      { phaseNumber: 3, phaseName: 'Production Flagship Projects', description: 'Showcase applications demonstrating practical mastery of the stack.' },
      { phaseNumber: 4, phaseName: 'Industry Certifications & Stepping Stones', description: 'Recognized industry credentials and intermediate roles leading to the target role.' },
      { phaseNumber: 5, phaseName: 'Target Role Placement', description: `Final interview preparation, portfolio presentation, and landing ${targetRole}.` },
    ],
    nodes: [
      {
        id: 'node_001',
        label: `Core Programming Fundamentals for ${targetRole}`,
        type: 'skill',
        phase: 1,
        phaseName: 'Foundational Knowledge',
        description: 'Master clean architecture, algorithms, and type-safe development practices.',
        timeEstimate: '3-4 weeks',
        difficulty: 'beginner',
        category: 'Core Fundamentals',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_002',
        label: 'Modern Version Control & CI/CD Workflows',
        type: 'skill',
        phase: 1,
        phaseName: 'Foundational Knowledge',
        description: 'Git branching models, GitHub Actions automation, pull request workflows, and automated testing.',
        timeEstimate: '2 weeks',
        difficulty: 'beginner',
        category: 'DevOps & Tooling',
        isOptional: false,
        prerequisites: [],
      },
      {
        id: 'node_003',
        label: `Core Frameworks & Architecture for ${targetRole}`,
        type: 'skill',
        phase: 2,
        phaseName: 'Core Competencies & Frameworks',
        description: 'Deep dive into standard tools, libraries, and design patterns utilized in production environments.',
        timeEstimate: '4 weeks',
        difficulty: 'intermediate',
        category: 'Frameworks',
        isOptional: false,
        prerequisites: ['node_001'],
      },
      {
        id: 'node_004',
        label: 'Production-Grade Showcase Project',
        type: 'project',
        phase: 3,
        phaseName: 'Production Flagship Projects',
        description: `Build and deploy an end-to-end full application tailored specifically to the requirements of ${targetRole}.`,
        timeEstimate: '4 weeks',
        difficulty: 'intermediate',
        category: 'Portfolio',
        isOptional: false,
        prerequisites: ['node_003', 'node_002'],
      },
      {
        id: 'node_005',
        label: 'Industry-Recognized Cloud Certification',
        type: 'certification',
        phase: 4,
        phaseName: 'Industry Certifications & Stepping Stones',
        description: 'Validate your architecture and cloud deployment capabilities with an accredited certificate.',
        timeEstimate: '3 weeks',
        difficulty: 'intermediate',
        category: 'Certification',
        isOptional: true,
        prerequisites: ['node_004'],
      },
      {
        id: 'node_006',
        label: 'Advanced System Design & Scalability',
        type: 'skill',
        phase: 4,
        phaseName: 'Industry Certifications & Stepping Stones',
        description: 'Distributed systems, caching strategies, database optimization, and high-availability patterns.',
        timeEstimate: '3 weeks',
        difficulty: 'advanced',
        category: 'System Design',
        isOptional: false,
        prerequisites: ['node_004'],
      },
      {
        id: 'node_007',
        label: targetRole,
        type: 'role',
        phase: 5,
        phaseName: 'Target Role Placement',
        description: `Landing your target dream position as ${targetRole}.`,
        timeEstimate: 'Target Goal',
        difficulty: 'advanced',
        category: 'Dream Goal',
        isOptional: false,
        prerequisites: ['node_006'],
      },
    ],
  };
}

/* ==========================================================================
   FALLBACK NODE EXPANSION
   ========================================================================== */

function resolveSpecificRepos(nodeLabel: string, text: string) {
  if (text.includes('next.js') || text.includes('nextjs')) {
    return [
      { name: 'vercel/next.js', url: 'https://github.com/vercel/next.js', why: 'Official Next.js framework repository demonstrating App Router, SSR, and Turbopack internals.' },
      { name: 'shadcn-ui/ui', url: 'https://github.com/shadcn-ui/ui', why: 'Production-ready accessible component system engineered with Radix and Tailwind for Next.js.' },
      { name: 'leerob/site', url: 'https://github.com/leerob/site', why: 'Real-world production Next.js portfolio and architecture reference.' },
    ];
  }
  if (text.includes('postgis') || text.includes('mapbox') || text.includes('d3') || text.includes('geospatial') || text.includes('mapping')) {
    return [
      { name: 'd3/d3', url: 'https://github.com/d3/d3', why: 'Definitive JavaScript library for bespoke data-driven geospatial and chart visualisations.' },
      { name: 'mapbox/mapbox-gl-js', url: 'https://github.com/mapbox/mapbox-gl-js', why: 'High-performance WebGL vector tile map renderer for interactive GIS data.' },
      { name: 'postgis/postgis', url: 'https://github.com/postgis/postgis', why: 'Industry-standard spatial database extender for PostgreSQL boundary queries.' },
    ];
  }
  if (text.includes('ghg') || text.includes('carbon') || text.includes('climate') || text.includes('solar') || text.includes('iot')) {
    return [
      { name: 'openclimatefix/predict_pv_yield', url: 'https://github.com/openclimatefix/predict_pv_yield', why: 'Open-source solar PV energy forecasting pipelines using machine learning.' },
      { name: 'electricitymaps/electricitymaps-contrib', url: 'https://github.com/electricitymaps/electricitymaps-contrib', why: 'Real-time global electricity grid carbon intensity visualizer and data pipelines.' },
      { name: 'climategpt/climategpt', url: 'https://github.com/climategpt/climategpt', why: 'Open environmental models and climate accounting protocol benchmarks.' },
    ];
  }
  if (text.includes('redis')) {
    return [
      { name: 'redis/redis', url: 'https://github.com/redis/redis', why: 'In-memory data structure store used as a database, cache, and message broker.' },
      { name: 'redis/node-redis', url: 'https://github.com/redis/node-redis', why: 'High-performance Node.js Redis client with connection pooling and clustering.' },
      { name: 'upstash/ratelimit', url: 'https://github.com/upstash/ratelimit', why: 'Serverless rate limiter built on top of Redis sliding window algorithms.' },
    ];
  }
  if (text.includes('postgres') || text.includes('sql') || text.includes('database')) {
    return [
      { name: 'postgres/postgres', url: 'https://github.com/postgres/postgres', why: 'Relational database engine with ACID transactions, WAL logging, and query planning.' },
      { name: 'prisma/prisma', url: 'https://github.com/prisma/prisma', why: 'Next-generation TypeScript ORM and schema migration tool.' },
      { name: 'brianc/node-postgres', url: 'https://github.com/brianc/node-postgres', why: 'Battle-tested PostgreSQL client for Node.js handling raw queries and connection pooling.' },
    ];
  }
  if (text.includes('docker') || text.includes('container')) {
    return [
      { name: 'docker/awesome-compose', url: 'https://github.com/docker/awesome-compose', why: 'Curated collection of production Docker Compose multi-container setups.' },
      { name: 'moby/moby', url: 'https://github.com/moby/moby', why: 'Open-source application container framework powering Docker engine internals.' },
      { name: 'hexops/dockerfile', url: 'https://github.com/hexops/dockerfile', why: 'Production Dockerfile best practices and minimal image size recipes.' },
    ];
  }
  if (text.includes('kubernetes') || text.includes('k8s')) {
    return [
      { name: 'kubernetes/kubernetes', url: 'https://github.com/kubernetes/kubernetes', why: 'Container orchestration engine, API server, and controller manager source.' },
      { name: 'argoproj/argo-cd', url: 'https://github.com/argoproj/argo-cd', why: 'Declarative GitOps continuous delivery tool for Kubernetes clusters.' },
      { name: 'ahmetb/kubernetes-network-policy-recipes', url: 'https://github.com/ahmetb/kubernetes-network-policy-recipes', why: 'Security blueprints for pod-to-pod network policy isolation.' },
    ];
  }
  if (text.includes('terraform')) {
    return [
      { name: 'hashicorp/terraform', url: 'https://github.com/hashicorp/terraform', why: 'Declarative Infrastructure as Code engine and provider ecosystem.' },
      { name: 'antonbabenko/terraform-aws-devops', url: 'https://github.com/antonbabenko/terraform-aws-devops', why: 'Industry-standard Terraform modules for production cloud infrastructure.' },
      { name: 'runatlantis/atlantis', url: 'https://github.com/runatlantis/atlantis', why: 'Terraform pull request automation and locking server.' },
    ];
  }
  if (text.includes('graphql')) {
    return [
      { name: 'graphql/graphql-js', url: 'https://github.com/graphql/graphql-js', why: 'Reference implementation of GraphQL specification for JavaScript.' },
      { name: 'apollographql/apollo-server', url: 'https://github.com/apollographql/apollo-server', why: 'Production-ready GraphQL server for Node.js microservices.' },
      { name: 'urql-graphql/urql', url: 'https://github.com/urql-graphql/urql', why: 'Highly customizable, lightweight GraphQL client for React.' },
    ];
  }
  if (text.includes('tailwind') || text.includes('css')) {
    return [
      { name: 'tailwindlabs/tailwindcss', url: 'https://github.com/tailwindlabs/tailwindcss', why: 'Utility-first CSS framework source code, JIT engine, and design tokens.' },
      { name: 'tailwindlabs/headlessui', url: 'https://github.com/tailwindlabs/headlessui', why: 'Completely unstyled, fully accessible UI components engineered for Tailwind.' },
      { name: 'sindresorhus/modern-normalize', url: 'https://github.com/sindresorhus/modern-normalize', why: 'Clean browser normalization layer for modern CSS rendering.' },
    ];
  }
  if (text.includes('state') || text.includes('zustand') || text.includes('redux') || text.includes('xstate')) {
    return [
      { name: 'pmndrs/zustand', url: 'https://github.com/pmndrs/zustand', why: 'Bear necessities for state management in React, with zero unnecessary re-renders.' },
      { name: 'statelyai/xstate', url: 'https://github.com/statelyai/xstate', why: 'Actor model and state machines for deterministic user flows and logic.' },
      { name: 'reduxjs/redux-toolkit', url: 'https://github.com/reduxjs/redux-toolkit', why: 'Standard approach for writing modern Redux logic with RTK Query.' },
    ];
  }
  if (text.includes('algorithm') || text.includes('dsa') || text.includes('leetcode')) {
    return [
      { name: 'trekhleb/javascript-algorithms', url: 'https://github.com/trekhleb/javascript-algorithms', why: 'Algorithms and data structures implemented in JavaScript with explanations.' },
      { name: 'kamyu104/LeetCode-Solutions', url: 'https://github.com/kamyu104/LeetCode-Solutions', why: 'Clean, optimal solutions to standard FAANG interview questions.' },
      { name: 'TheAlgorithms/Python', url: 'https://github.com/TheAlgorithms/Python', why: 'Comprehensive repository of data structure algorithms in Python.' },
    ];
  }
  if (text.includes('system design') || text.includes('architecture')) {
    return [
      { name: 'donnemartin/system-design-primer', url: 'https://github.com/donnemartin/system-design-primer', why: 'The premier open-source guide to designing large-scale distributed systems.' },
      { name: 'karanpratapsingh/system-design', url: 'https://github.com/karanpratapsingh/system-design', why: 'Visual diagrams and real-world system architecture breakdowns.' },
      { name: 'binhnguyennus/awesome-scalability', url: 'https://github.com/binhnguyennus/awesome-scalability', why: 'Patterns and principles for building high-availability architectures.' },
    ];
  }
  if (text.includes('react')) {
    return [
      { name: 'facebook/react', url: 'https://github.com/facebook/react', why: 'Core React source code, Fiber reconciler, and hook implementation details.' },
      { name: 'alan2207/bulletproof-react', url: 'https://github.com/alan2207/bulletproof-react', why: 'Scalable production React folder structure and architectural design.' },
      { name: 'TanStack/query', url: 'https://github.com/TanStack/query', why: 'Powerful asynchronous state management for TS/JS, SSR, and caching.' },
    ];
  }
  if (text.includes('typescript')) {
    return [
      { name: 'microsoft/TypeScript', url: 'https://github.com/microsoft/TypeScript', why: 'The TypeScript language compiler, type checker, and AST definition.' },
      { name: 'type-challenges/type-challenges', url: 'https://github.com/type-challenges/type-challenges', why: 'Collection of TypeScript type challenges to master generic types and inference.' },
      { name: 'colinhacks/zod', url: 'https://github.com/colinhacks/zod', why: 'TypeScript-first schema declaration and validation with static type inference.' },
    ];
  }
  if (text.includes('python') || text.includes('fastapi')) {
    return [
      { name: 'tiangolo/fastapi', url: 'https://github.com/tiangolo/fastapi', why: 'Modern, high-performance web framework for building APIs with Python.' },
      { name: 'pydantic/pydantic', url: 'https://github.com/pydantic/pydantic', why: 'Data validation and settings management using Python type annotations.' },
      { name: 'psf/black', url: 'https://github.com/psf/black', why: 'The uncompromising Python code formatter adhering to PEP 8 standards.' },
    ];
  }
  if (text.includes('pytorch') || text.includes('machine learning') || text.includes('ai') || text.includes('huggingface')) {
    return [
      { name: 'huggingface/transformers', url: 'https://github.com/huggingface/transformers', why: 'State-of-the-art machine learning model architectures and pipelines.' },
      { name: 'pytorch/pytorch', url: 'https://github.com/pytorch/pytorch', why: 'Tensors and dynamic neural networks in Python with strong GPU acceleration.' },
      { name: 'vllm-project/vllm', url: 'https://github.com/vllm-project/vllm', why: 'High-throughput and memory-efficient LLM serving engine.' },
    ];
  }
  if (text.includes('interview') || text.includes('portfolio') || text.includes('role')) {
    return [
      { name: 'jwasham/coding-interview-university', url: 'https://github.com/jwasham/coding-interview-university', why: 'Multi-month study plan for becoming a software engineer at top tech companies.' },
      { name: 'resume/resume.github.com', url: 'https://github.com/resume/resume.github.com', why: 'Formatting and portfolio standards for top software engineering applications.' },
      { name: 'yangshun/tech-interview-handbook', url: 'https://github.com/yangshun/tech-interview-handbook', why: 'Curated technical interview preparation materials for busy engineers.' },
    ];
  }

  // Dynamic fallback topic search URL for the specific node
  const slug = encodeURIComponent(nodeLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  return [
    {
      name: `${slug}-showcase`,
      url: `https://github.com/topics/${slug}`,
      why: `Production-ready open source projects and reference patterns specifically demonstrating ${nodeLabel}.`,
    },
    {
      name: `awesome-${slug}`,
      url: `https://github.com/search?q=${encodeURIComponent(nodeLabel)}+stars:%3E1000`,
      why: `Highly starred open source repositories validating industry usage of ${nodeLabel}.`,
    },
    {
      name: 'kamranahmedse/developer-roadmap',
      url: 'https://github.com/kamranahmedse/developer-roadmap',
      why: `Community roadmaps and benchmark repositories showing where ${nodeLabel} fits in modern stacks.`,
    },
  ];
}

export function generateFallbackNodeExpansion(
  nodeLabel: string,
  nodeDescription: string,
  targetRole: string
): NodeExpansion {
  const text = `${nodeLabel} ${nodeDescription} ${targetRole}`.toLowerCase();
  const specificRepos = resolveSpecificRepos(nodeLabel, text);

  // 1. React / Next.js / Frontend / CSS / State Management
  if (
    text.includes('react') ||
    text.includes('next.js') ||
    text.includes('frontend') ||
    text.includes('css') ||
    text.includes('tailwind') ||
    text.includes('ui') ||
    text.includes('zustand') ||
    text.includes('redux')
  ) {
    return {
      weekendProject: {
        title: `${nodeLabel} — Production Design System & State Architecture`,
        description: `Build a modular, accessible component library implementing ${nodeLabel} with clean state separation and zero layout shift.`,
        techStack: ['TypeScript', 'React 19', 'Next.js', 'Tailwind CSS'],
        estimatedHours: 6,
      },
      githubRepos: specificRepos,
      interviewQuestions: [
        `How does React 19 handle concurrency and server actions under high user load?`,
        `What strategies do you use to diagnose and eliminate unnecessary component re-renders?`,
        `How do you architect reusable UI components to ensure strict WCAG accessibility and responsive design?`,
        `Explain the trade-offs between Client Components and Server Components for dynamic data fetching.`,
        `How would you test this component using React Testing Library and Playwright?`,
      ],
      resources: [
        {
          title: 'React Official Documentation (react.dev)',
          url: 'https://react.dev',
          type: 'documentation',
        },
        {
          title: 'Next.js Production Architecture Best Practices',
          url: 'https://nextjs.org/docs',
          type: 'documentation',
        },
        {
          title: 'Web Dev Performance Masterclass',
          url: 'https://web.dev/explore/fast',
          type: 'article',
        },
      ],
      proTip: `Senior frontend interviewers check if you understand the browser render tree and memory footprint, not just JSX syntax. Be prepared to discuss paint cycles, layout thrashing, and bundle splitting.`,
    };
  }

  // 2. TypeScript / JavaScript Core
  if (text.includes('typescript') || text.includes('javascript') || text.includes('ecmascript')) {
    return {
      weekendProject: {
        title: `${nodeLabel} — Type-Safe Schema Validator & AST Tool`,
        description: `Create an end-to-end type-safe schema validator with inference utilities and zero external dependencies.`,
        techStack: ['TypeScript', 'Node.js', 'Vitest'],
        estimatedHours: 6,
      },
      githubRepos: specificRepos,
      interviewQuestions: [
        `What is the difference between type narrowing, type assertions, and user-defined type guards?`,
        `How do conditional and mapped types work under the hood in TypeScript?`,
        `Explain how TypeScript covariance and contravariance apply to function arguments and return types.`,
        `How do you optimize TypeScript compilation speed in large monorepos?`,
        `How does the JavaScript V8 engine optimize hidden classes and inline caches?`,
      ],
      resources: [
        {
          title: 'TypeScript Handbook (Official)',
          url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
          type: 'documentation',
        },
        {
          title: 'Total TypeScript Core Articles',
          url: 'https://www.totaltypescript.com',
          type: 'article',
        },
      ],
      proTip: `Avoid overusing 'any' or aggressive type assertions ('as unknown as T') in interviews. Show that you can model complex domain invariants using discriminated unions.`,
    };
  }

  // 3. Machine Learning / AI / Deep Learning / PyTorch / LLM / NLP
  if (
    text.includes('ml') ||
    text.includes('machine learning') ||
    text.includes('deep learning') ||
    text.includes('pytorch') ||
    text.includes('ai') ||
    text.includes('llm') ||
    text.includes('vision') ||
    text.includes('nlp')
  ) {
    return {
      weekendProject: {
        title: `${nodeLabel} — End-to-End Inference & Fine-Tuning Pipeline`,
        description: `Implement and benchmark an inference service with streaming token generation, vector search, and evaluation metrics.`,
        techStack: ['Python', 'PyTorch', 'Hugging Face', 'FastAPI', 'Qdrant'],
        estimatedHours: 8,
      },
      githubRepos: specificRepos,
      interviewQuestions: [
        `How do you mitigate catastrophic forgetting and gradient vanishing/exploding during training?`,
        `Explain the mathematical mechanics behind multi-head attention and scaled dot-product attention.`,
        `What strategies do you employ to reduce inference latency and GPU memory allocation (e.g. quantization, KV cache)?`,
        `How do you evaluate generative model outputs systematically without human-in-the-loop bottlenecks?`,
        `Describe how you debug a model when training loss plateaus prematurely.`,
      ],
      resources: [
        {
          title: 'PyTorch Official Tutorials',
          url: 'https://pytorch.org/tutorials',
          type: 'documentation',
        },
        {
          title: 'Hugging Face Deep Learning Course',
          url: 'https://huggingface.co/learn',
          type: 'course',
        },
      ],
      proTip: `For ML roles, interviewers care heavily about production data drift, model latency budgets, and real-world inference costs, not just raw benchmark accuracy.`,
    };
  }

  // 4. DevOps / Cloud / Kubernetes / Docker / CI/CD / SRE
  if (
    text.includes('devops') ||
    text.includes('kubernetes') ||
    text.includes('docker') ||
    text.includes('cloud') ||
    text.includes('terraform') ||
    text.includes('aws') ||
    text.includes('sre') ||
    text.includes('ci/cd')
  ) {
    return {
      weekendProject: {
        title: `${nodeLabel} — Automated GitOps Infrastructure & Canary Delivery`,
        description: `Set up a self-healing Kubernetes cluster configuration with automated container build pipelines and Prometheus metrics.`,
        techStack: ['Kubernetes', 'Docker', 'Terraform', 'Helm', 'GitHub Actions'],
        estimatedHours: 7,
      },
      githubRepos: specificRepos,
      interviewQuestions: [
        `How do you implement zero-downtime rolling upgrades and automated canary rollbacks in Kubernetes?`,
        `Explain how Linux cgroups and namespaces isolate containers at the operating system level.`,
        `How do you manage secret rotation and state locking across distributed Terraform modules?`,
        `Walk through your protocol for diagnosing a CrashLoopBackOff or OOMKilled pod.`,
        `How would you architect a disaster recovery multi-region failover strategy with RPO < 5 mins?`,
      ],
      resources: [
        {
          title: 'Kubernetes Official Documentation',
          url: 'https://kubernetes.io/docs',
          type: 'documentation',
        },
        {
          title: 'Google SRE Book (Free Online)',
          url: 'https://sre.google/sre-book/table-of-contents',
          type: 'article',
        },
      ],
      proTip: `DevOps interviewers love hearing about failure modes: postmortems, automated rollbacks, and idempotency in your scripts. Emphasize observability over manual tinkering.`,
    };
  }

  // 5. Backend / APIs / Node.js / Go / Databases / Distributed Systems
  if (
    text.includes('backend') ||
    text.includes('api') ||
    text.includes('database') ||
    text.includes('sql') ||
    text.includes('postgres') ||
    text.includes('redis') ||
    text.includes('microservice') ||
    text.includes('node')
  ) {
    return {
      weekendProject: {
        title: `${nodeLabel} — High-Throughput Event-Driven Microservice`,
        description: `Design and build a scalable REST/gRPC backend service handling concurrent transactions with distributed locking and caching.`,
        techStack: ['TypeScript', 'Fastify', 'PostgreSQL', 'Redis', 'Docker'],
        estimatedHours: 7,
      },
      githubRepos: specificRepos,
      interviewQuestions: [
        `How do you design database indexes to prevent table scans on high-cardinality queries?`,
        `Explain the difference between optimistic locking and pessimistic locking under high concurrency.`,
        `How do you prevent cache penetration, cache stampede, and cache avalanche in distributed systems?`,
        `What are the trade-offs between gRPC and REST APIs in inter-service communication?`,
        `How do you handle idempotency for payment and billing endpoints in distributed architectures?`,
      ],
      resources: [
        {
          title: 'Use The Index, Luke! (SQL Performance Guide)',
          url: 'https://use-the-index-luke.com',
          type: 'article',
        },
        {
          title: 'System Design Primer (Architecture Case Studies)',
          url: 'https://github.com/donnemartin/system-design-primer',
          type: 'documentation',
        },
      ],
      proTip: `In backend interviews, always clarify throughput requirements (QPS), read/write ratios, and consistency guarantees (ACID vs BASE) before proposing a database schema.`,
    };
  }

  // 6. Data Science / Analytics / Python / Pandas / ETL
  if (
    text.includes('data') ||
    text.includes('scientist') ||
    text.includes('analytics') ||
    text.includes('pandas') ||
    text.includes('pipeline')
  ) {
    return {
      weekendProject: {
        title: `${nodeLabel} — Automated ETL Pipeline & Statistical Model`,
        description: `Construct an automated data ingestion and cleaning workflow with automated data quality checks and actionable visual dashboards.`,
        techStack: ['Python', 'Pandas', 'DuckDB', 'dbt', 'Streamlit'],
        estimatedHours: 6,
      },
      githubRepos: specificRepos,
      interviewQuestions: [
        `How do you detect and handle data leakage between training and validation splits?`,
        `Explain how vectorization in Pandas and NumPy avoids Python GIL performance bottlenecks.`,
        `What is the difference between Type I and Type II errors, and how do you calibrate your decision threshold?`,
        `How do you structure automated tests for data pipelines to prevent schema drift?`,
        `When would you choose DuckDB over traditional PostgreSQL for analytical workloads?`,
      ],
      resources: [
        {
          title: 'Python Data Science Handbook',
          url: 'https://jakevdp.github.io/PythonDataScienceHandbook',
          type: 'article',
        },
        {
          title: 'dbt Best Practices and Analytics Engineering',
          url: 'https://docs.getdbt.com/best-practices',
          type: 'documentation',
        },
      ],
      proTip: `Interviewers look for business impact: explain how your model or data pipeline translates directly into saved revenue, reduced churn, or operational efficiency.`,
    };
  }

  // 7. Systems / Rust / Go / C++ / Low-Level
  if (
    text.includes('rust') ||
    text.includes('golang') ||
    text.includes('c++') ||
    text.includes('systems') ||
    text.includes('embedded') ||
    text.includes('concurrency')
  ) {
    return {
      weekendProject: {
        title: `${nodeLabel} — High-Throughput Async Networking Engine`,
        description: `Implement a multi-threaded asynchronous task queue with zero memory copies and lock-free data structures.`,
        techStack: ['Rust', 'Tokio', 'TCP/IP', 'Criterion'],
        estimatedHours: 8,
      },
      githubRepos: specificRepos,
      interviewQuestions: [
        `How does the Rust borrow checker enforce thread safety and prevent data races at compile time?`,
        `Explain how memory allocation works across the stack vs heap in low-latency systems.`,
        `What are lock-free data structures and how do CPU atomic operations (CAS) enable them?`,
        `How do you profile cache misses and branch mispredictions using perf and flamegraphs?`,
        `Explain how epoll/kqueue event loops handle thousands of non-blocking sockets concurrently.`,
      ],
      resources: [
        {
          title: 'The Rust Programming Language (The Book)',
          url: 'https://doc.rust-lang.org/book',
          type: 'documentation',
        },
        {
          title: 'Rust By Example',
          url: 'https://doc.rust-lang.org/rust-by-example',
          type: 'documentation',
        },
      ],
      proTip: `Be prepared to discuss memory layouts, pointer arithmetic, and CPU cache line alignment. Low-level systems engineering is all about mechanical sympathy with the underlying hardware.`,
    };
  }

  // 8. Default Tailored Fallback (Context-Specific)
  return {
    weekendProject: {
      title: `${nodeLabel} — Hands-On Production Milestone`,
      description: `Architect a functioning showcase project that implements ${nodeLabel} to demonstrate competency for ${targetRole}.`,
      techStack: ['TypeScript', 'Next.js', 'Docker', 'PostgreSQL'],
      estimatedHours: 7,
    },
    githubRepos: specificRepos,
    interviewQuestions: [
      `How does ${nodeLabel} solve core architectural bottlenecks for a ${targetRole}?`,
      `What are the most common production failure modes associated with this skill and how do you safeguard against them?`,
      `How do you benchmark and monitor this technology in a live production environment?`,
      `Describe a challenging problem you solved using this competency.`,
      `What alternatives exist for this approach and what criteria determine when to choose which?`,
    ],
    resources: [
      {
        title: `${nodeLabel} Technical Reference Guide`,
        url: 'https://developer.mozilla.org',
        type: 'documentation',
      },
      {
        title: 'System Design & Scalability Architecture Primer',
        url: 'https://github.com/donnemartin/system-design-primer',
        type: 'article',
      },
    ],
    proTip: `When interviewers ask about ${nodeLabel}, frame your answer around business impact, reliability, and maintainability. Show that you think like a staff engineer.`,
  };
}
