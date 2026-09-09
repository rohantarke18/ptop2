import {
  InnovationChallenge,
  InnovationSubmission,
  Innovation,
  InnovationComment,
  InnovationReview,
  InnovationStage,
  InnovationCategory,
} from '../types';

let MOCK_INNOVATIONS: Innovation[] = [
  {
    id: 'INV-2026-001',
    title: 'Ward 14 Decentralized Composting & Organic Biocycle Hub',
    description:
      'Community-managed anaerobic digestor micro-station utilizing discarded vegetable market peelings to create fortified organic fertilizer for public municipal gardens while mitigating landfill haulage emissions.',
    category: 'Waste Management & Circular Economy',
    stage: 'Under Review',
    submitterName: 'Priya Deshpande',
    submitterType: 'Civic Activist & Environmental Engineer',
    targetWard: 'Ward 14 (Shivajinagar)',
    costEstimate: '₹ 1,80,000 Initial CapEx',
    feasibilityScore: 88,
    votes: 342,
    hasVoted: false,
    createdAt: '2026-03-12T10:30:00Z',
    reviews: [
      {
        id: 'rev-01',
        reviewerName: 'Prof. S. Mehta',
        reviewerTitle: 'Senior Advisory Board Member, COEP Urban Cell',
        scores: {
          feasibility: 90,
          costEffectiveness: 85,
          communityImpact: 92,
          scalability: 84,
        },
        verdict: 'Recommended for Ward Pilot',
        comments:
          'Excellent micro-spatial zoning. Odor containment protocol is robust with bio-filtration charcoal beds.',
        reviewedAt: '2026-03-18',
      },
    ],
    comments: [
      {
        id: 'c-01',
        authorName: 'Rohan Joshi',
        authorRole: 'Resident Welfare Association President',
        content: 'Our society of 120 flats is eager to participate as the primary test substrate provider.',
        createdAt: '2026-03-15',
      },
    ],
  },
  {
    id: 'INV-2026-002',
    title: 'Solar Powered Smart Pedestrian Refuge Crossing Beacon',
    description:
      'Pressure-sensor activated illuminated pedestrian tabletop crosswalk for high-speed arterial stretches near schools. Automatically warns approaching traffic 50m in advance.',
    category: 'Mobility & Pedestrian Safety',
    stage: 'Pilot Approved',
    submitterName: 'Tech4Pune Student Collective',
    submitterType: 'Student Innovation Team',
    targetWard: 'Ward 22 (Kothrud)',
    costEstimate: '₹ 95,000 per junction',
    feasibilityScore: 92,
    votes: 512,
    hasVoted: true,
    createdAt: '2026-02-28T14:15:00Z',
    reviews: [],
    comments: [],
  },
  {
    id: 'INV-2026-003',
    title: 'Rainwater Injection Well Network along Sloped Arterials',
    description:
      'Perforated infiltration shafts with sand-gravel filter cones constructed adjacent to stormwater curbs to recharge drying ward borewells during torrential downpours.',
    category: 'Water Security & Conservation',
    stage: 'Proposed',
    submitterName: 'Hydrology Action Circle',
    submitterType: 'NGO & Community Group',
    targetWard: 'Ward 08 (Viman Nagar)',
    costEstimate: '₹ 2,40,000 for 4 shafts',
    feasibilityScore: 79,
    votes: 188,
    hasVoted: false,
    createdAt: '2026-03-22T08:45:00Z',
    reviews: [],
    comments: [],
  },
];

let MOCK_CHALLENGES: InnovationChallenge[] = [
  {
    id: 'chal-01',
    title: 'Mitigating Traffic Bottlenecks Around Secondary & Higher Educational Clusters',
    department: 'Traffic Police & Urban Transit Planning Directorate',
    category: 'Urban Mobility & Road Safety',
    focusArea: 'Traffic Flow & Pedestrian Safety',
    problemStatement:
      'Peak morning and afternoon transit hours witness severe congestion around school and university clusters due to uncoordinated drop-off zones, commercial auto-rickshaw staging, and lack of designated safe pedestrian corridors.',
    currentSituation:
      'Over 40,000 students commute daily through 6 major educational campuses situated along a 3km corridor, resulting in average peak transit delays of 28 minutes and elevated air particulate concentration during morning arrivals.',
    expectedOutcomes: [
      'Staggered arrival logistics and community drop-off circuit models',
      'Dynamic low-cost pedestrian and non-motorized transport priority interventions',
      'Data-informed scheduling with zero capital-intensive road widening requirements',
    ],
    submissionDeadline: '2026-10-15T23:59:59Z',
    evaluationCriteria: [
      { criterion: 'Public Need & Relevance', weight: 20, description: 'Direct alignment with peak commute hazards' },
      { criterion: 'Innovation & Fresh Thinking', weight: 20, description: 'Novel use of space, scheduling, or tech' },
      { criterion: 'Operational Feasibility', weight: 20, description: 'Ease of execution within existing civic bylaws' },
      { criterion: 'Implementation Capacity', weight: 15, description: 'Realistic resource, volunteer, or agency support' },
      { criterion: 'Potential Public Impact', weight: 15, description: 'Quantifiable reduction in transit friction' },
      { criterion: 'Cost Effectiveness', weight: 10, description: 'High benefit-to-expenditure ratio' },
    ],
    submissionsCount: 14,
    status: 'Open',
  },
  {
    id: 'chal-02',
    title: 'Decentralized Organic Waste Segregation & In-Ward Composting for Residential Societies',
    department: 'Solid Waste Management & Public Health Department',
    category: 'Sanitation & Environment',
    focusArea: 'Circular Bio-Economy',
    problemStatement:
      'Despite mandatory source-segregation bylaws, mixed municipal waste continues to burden central landfills, leading to increased transport fuel burn and greenhouse gas emissions.',
    currentSituation:
      'Only 34% of bulk waste generators compost on premises, primarily citing space constraints, odor mismanagement, and lack of operational training.',
    expectedOutcomes: [
      'Modular, compact micro-composting frameworks for apartment societies',
      'Community incentive models and digitized compliance tracking',
      'Odor-free, scalable microbiological or mechanical methods',
    ],
    submissionDeadline: '2026-11-01T23:59:59Z',
    evaluationCriteria: [
      { criterion: 'Public Need', weight: 20, description: 'Reduces municipal collection load' },
      { criterion: 'Innovation', weight: 20, description: 'Overcomes space and odor hurdles' },
      { criterion: 'Feasibility', weight: 20, description: 'Adaptable to typical 50-200 flat societies' },
      { criterion: 'Implementation Capacity', weight: 15, description: 'Maintenance independence' },
      { criterion: 'Potential Impact', weight: 15, description: 'Diversion of wet waste from landfills' },
      { criterion: 'Cost Effectiveness', weight: 10, description: 'Payback under 18 months' },
    ],
    submissionsCount: 9,
    status: 'Open',
  },
  {
    id: 'chal-03',
    title: 'Community-Driven Rainwater Harvesting & Groundwater Recharge Along Urban Slopes',
    department: 'Water Supply & Groundwater Resource Conservation Cell',
    category: 'Water & Environment',
    focusArea: 'Climate Resilience',
    problemStatement:
      'Urban runoff during heavy monsoon bursts causes street water-logging while the local water table depletes rapidly by March.',
    currentSituation:
      'Millions of liters of clean monsoon precipitation are lost into stormwater channels while surrounding borewells run dry before summer.',
    expectedOutcomes: [
      'Low-cost decentralized filtration and injection well systems',
      'Public park and open ground percolation basins',
      'Ward-level participatory maintenance models',
    ],
    submissionDeadline: '2026-09-30T23:59:59Z',
    evaluationCriteria: [
      { criterion: 'Public Need', weight: 20, description: 'Mitigates summer water deficit' },
      { criterion: 'Innovation', weight: 20, description: 'Affordable sediment filtration' },
      { criterion: 'Feasibility', weight: 20, description: 'Uses existing open spaces' },
      { criterion: 'Implementation Capacity', weight: 15, description: 'Community ownership' },
      { criterion: 'Potential Impact', weight: 15, description: 'Recharge volume per sq meter' },
      { criterion: 'Cost Effectiveness', weight: 10, description: 'Cost per 1,000 liters saved' },
    ],
    submissionsCount: 21,
    status: 'Under Review',
  },
];

let MOCK_SUBMISSIONS: InnovationSubmission[] = [
  {
    id: 'sub-01',
    challengeId: 'chal-01',
    challengeTitle: 'Mitigating Traffic Bottlenecks Around Secondary & Higher Educational Clusters',
    title: 'Dynamic Staggered School Bell Schedules & Coordinated Walking School Bus Corridors',
    problemAddressed:
      'Over 5 schools along Prabhat Road release students within a 15-minute overlap, inducing a paralyzing gridlock of private cars and autorickshaws.',
    description:
      'A two-pronged municipal strategy: (1) A data-driven 30-minute staggered dismissal schedule across adjacent campuses agreed upon via school consortium; (2) Establishing monitored "Walking School Bus" routes for students living within 800m, guided by senior student prefects and resident welfare volunteers.',
    expectedImpact:
      'Estimated 38% reduction in peak-hour vehicular density outside campus gates and 100% elimination of double-parking along arterial footpath corridors.',
    estimatedCost: '₹ 1,50,000 per ward cluster (signage, safety vests, communication kits)',
    implementationApproach:
      'Phase 1: Pilot across 3 schools over 6 weeks with police marshals. Phase 2: Rollout to all campuses with parent-teacher association coordinators.',
    demoLink: 'https://civicbridge.internal/demos/walking-bus-simulation',
    documents: [
      {
        id: 'doc-1',
        name: 'traffic_flow_simulation_data.pdf',
        type: 'document',
        url: '#',
        size: 1420000,
        uploadedAt: '2026-09-01T10:00:00Z',
      },
    ],
    submittedBy: {
      id: 'usr-student-01',
      name: 'Rohan Deshpande',
      affiliation: 'College of Engineering Urban Mobility Forum',
    },
    submittedAt: '2026-09-01T10:30:00Z',
    status: 'Under Evaluation',
    evaluationScores: {
      publicNeed: 18,
      innovation: 17,
      feasibility: 18,
      implementationCapacity: 13,
      potentialImpact: 14,
      costEffectiveness: 9,
      totalScore: 89,
      comments:
        'Outstanding operational design with minimal civil expenditure. The school consortium coordination model can be immediately tested in Zone 2.',
      evaluatedBy: 'Prof. Ananya Sen (Civic Advisory Committee)',
    },
  },
  {
    id: 'sub-02',
    challengeId: 'chal-01',
    challengeTitle: 'Mitigating Traffic Bottlenecks Around Secondary & Higher Educational Clusters',
    title: 'Smart RFID Pick-Up Queue Sequencing & Geo-Fenced Auto Staging Zones',
    problemAddressed: 'Unorganized parent vehicle queuing blocking emergency lanes.',
    description:
      'Deploying an open-source QR/RFID token dispatch where parents alert the classroom 5 minutes prior to reaching the gate. Students move to the departure bays in sequenced order.',
    expectedImpact: 'Reduces kerbside dwell time from 7.5 minutes to under 45 seconds per vehicle.',
    estimatedCost: '₹ 3,20,000 per school',
    implementationApproach: 'Lightweight mobile web app integrating existing school ERP IDs.',
    documents: [],
    submittedBy: {
      id: 'usr-tech-02',
      name: 'Aditi Vartak & Team',
      affiliation: 'CivicTech Youth Collective',
    },
    submittedAt: '2026-09-03T14:15:00Z',
    status: 'Submitted',
  },
];

export const innovationService = {
  async getChallenges(): Promise<InnovationChallenge[]> {
    await new Promise((r) => setTimeout(r, 80));
    return [...MOCK_CHALLENGES];
  },

  async getChallengeById(id: string): Promise<InnovationChallenge | null> {
    await new Promise((r) => setTimeout(r, 60));
    const challenge = MOCK_CHALLENGES.find((c) => c.id === id);
    return challenge ? { ...challenge } : null;
  },

  async getSubmissions(challengeId?: string): Promise<InnovationSubmission[]> {
    await new Promise((r) => setTimeout(r, 90));
    if (challengeId) {
      return MOCK_SUBMISSIONS.filter((s) => s.challengeId === challengeId);
    }
    return [...MOCK_SUBMISSIONS];
  },

  async submitSolution(payload: Partial<InnovationSubmission>): Promise<InnovationSubmission> {
    await new Promise((r) => setTimeout(r, 250));
    const newSubmission: InnovationSubmission = {
      id: `sub-${Date.now()}`,
      challengeId: payload.challengeId || 'chal-01',
      challengeTitle: payload.challengeTitle || 'Civic Innovation Challenge',
      title: payload.title || 'Untitled Community Innovation',
      problemAddressed: payload.problemAddressed || '',
      description: payload.description || '',
      expectedImpact: payload.expectedImpact || '',
      estimatedCost: payload.estimatedCost || 'Budget to be finalized',
      implementationApproach: payload.implementationApproach || '',
      demoLink: payload.demoLink,
      documents: payload.documents || [],
      submittedBy: payload.submittedBy || {
        id: 'usr-cit-101',
        name: 'Aarav Deshmukh',
        affiliation: 'Citizen Innovator',
      },
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
    };

    MOCK_SUBMISSIONS = [newSubmission, ...MOCK_SUBMISSIONS];

    // Increment challenge count
    const ch = MOCK_CHALLENGES.find((c) => c.id === payload.challengeId);
    if (ch) ch.submissionsCount += 1;

    return newSubmission;
  },

  async evaluateSubmission(
    submissionId: string,
    scores: {
      publicNeed: number;
      innovation: number;
      feasibility: number;
      implementationCapacity: number;
      potentialImpact: number;
      costEffectiveness: number;
      comments: string;
      evaluatedBy: string;
    }
  ): Promise<InnovationSubmission> {
    await new Promise((r) => setTimeout(r, 180));
    const sub = MOCK_SUBMISSIONS.find((s) => s.id === submissionId);
    if (!sub) throw new Error('Submission not found');

    const totalScore =
      scores.publicNeed +
      scores.innovation +
      scores.feasibility +
      scores.implementationCapacity +
      scores.potentialImpact +
      scores.costEffectiveness;

    sub.evaluationScores = {
      ...scores,
      totalScore,
    };
    sub.status = totalScore >= 75 ? 'Shortlisted' : 'Under Evaluation';

    return JSON.parse(JSON.stringify(sub));
  },

  async getInnovations(): Promise<Innovation[]> {
    await new Promise((r) => setTimeout(r, 60));
    return [...MOCK_INNOVATIONS];
  },

  async getInnovationById(id: string): Promise<Innovation | null> {
    await new Promise((r) => setTimeout(r, 50));
    const item = MOCK_INNOVATIONS.find((inv) => inv.id === id);
    return item ? JSON.parse(JSON.stringify(item)) : null;
  },

  async submitInnovation(payload: Partial<Innovation>): Promise<Innovation> {
    await new Promise((r) => setTimeout(r, 150));
    const newInv: Innovation = {
      id: `INV-2026-${String(MOCK_INNOVATIONS.length + 1).padStart(3, '0')}`,
      title: payload.title || 'Untitled Community Innovation',
      description: payload.description || '',
      category: payload.category || 'Waste Management & Circular Economy',
      stage: 'Proposed',
      submitterName: payload.submitterName || 'Aarav Deshmukh',
      submitterType: payload.submitterType || 'Citizen Innovator',
      targetWard: payload.targetWard || 'Ward 14 (Shivajinagar)',
      costEstimate: payload.costEstimate || 'Under estimation',
      feasibilityScore: 78,
      votes: 1,
      hasVoted: true,
      createdAt: new Date().toISOString(),
      reviews: [],
      comments: [],
      attachments: payload.attachments || [],
    };

    MOCK_INNOVATIONS = [newInv, ...MOCK_INNOVATIONS];
    return newInv;
  },

  async upvoteInnovation(id: string): Promise<Innovation> {
    await new Promise((r) => setTimeout(r, 60));
    const item = MOCK_INNOVATIONS.find((inv) => inv.id === id);
    if (!item) throw new Error('Innovation not found');

    if (item.hasVoted) {
      item.votes -= 1;
      item.hasVoted = false;
    } else {
      item.votes += 1;
      item.hasVoted = true;
    }

    return JSON.parse(JSON.stringify(item));
  },

  async addComment(id: string, comment: Partial<InnovationComment>): Promise<Innovation> {
    await new Promise((r) => setTimeout(r, 100));
    const item = MOCK_INNOVATIONS.find((inv) => inv.id === id);
    if (!item) throw new Error('Innovation not found');

    const newComment: InnovationComment = {
      id: `comm-${Date.now()}`,
      userName: comment.userName || comment.authorName || 'Citizen Contributor',
      userRole: comment.userRole || comment.authorRole || 'citizen',
      comment: comment.comment || comment.content || '',
      authorName: comment.authorName || comment.userName || 'Citizen Contributor',
      authorRole: comment.authorRole || comment.userRole || 'citizen',
      content: comment.content || comment.comment || '',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    item.comments.unshift(newComment);
    return JSON.parse(JSON.stringify(item));
  },

  async addReview(id: string, review: Partial<InnovationReview>): Promise<Innovation> {
    await new Promise((r) => setTimeout(r, 120));
    const item = MOCK_INNOVATIONS.find((inv) => inv.id === id);
    if (!item) throw new Error('Innovation not found');

    const newReview: InnovationReview = {
      id: `rev-${Date.now()}`,
      reviewerName: review.reviewerName || 'Expert Evaluator',
      reviewerTitle: review.reviewerTitle || 'Civic Review Committee Member',
      feasibilityScore: review.feasibilityScore ?? review.scores?.feasibility ?? 85,
      costEffectivenessScore: review.costEffectivenessScore ?? review.scores?.costEffectiveness ?? 80,
      communityImpactScore: review.communityImpactScore ?? review.scores?.communityImpact ?? 85,
      overallScore: review.overallScore ?? 83,
      recommendation: review.recommendation || review.verdict || 'Recommended for Ward Pilot',
      verdict: (review.verdict || review.recommendation || 'Recommended for Ward Pilot') as any,
      comments: review.comments || '',
      createdAt: new Date().toISOString(),
      reviewedAt: new Date().toISOString().slice(0, 10),
      scores: review.scores || {
        feasibility: review.feasibilityScore ?? 85,
        costEffectiveness: review.costEffectivenessScore ?? 80,
        communityImpact: review.communityImpactScore ?? 85,
        scalability: 80,
      },
    };

    item.reviews.unshift(newReview);
    if (newReview.feasibilityScore) {
      item.feasibilityScore = newReview.feasibilityScore;
    }

    return JSON.parse(JSON.stringify(item));
  },

  async updateStage(id: string, stage: InnovationStage): Promise<Innovation> {
    await new Promise((r) => setTimeout(r, 80));
    const item = MOCK_INNOVATIONS.find((inv) => inv.id === id);
    if (!item) throw new Error('Innovation not found');

    item.stage = stage;
    return JSON.parse(JSON.stringify(item));
  },
};
