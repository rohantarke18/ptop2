import {
  Problem,
  ProblemStatus,
  PriorityLevel,
  ProblemCategory,
  ResolutionEvidence,
  CitizenVerification,
  EvidenceItem,
} from '../types';

let MOCK_PROBLEMS: Problem[] = [
  {
    id: 'CIV-2026-001024',
    title: 'Persistent pothole hazard near University Main Gate',
    description:
      'Deep, widening potholes spanning 1.5 meters across the active bus and two-wheeler lane directly opposite the University north entry gate. During recent rains, water logging completely disguises the trench depth, causing multiple minor vehicular skids and peak-hour pedestrian bottlenecks.',
    category: 'Roads & Infrastructure',
    department: 'Municipal Road Maintenance & Civil Infrastructure',
    location: {
      address: 'University Road, Gate No. 2, opposite Central Library Crossing',
      landmark: 'University North Gate',
      ward: 'Ward 14 (Shivajinagar)',
      city: 'Pune',
      district: 'Pune Urban',
      state: 'Maharashtra',
      pincode: '411007',
      coordinates: { lat: 18.5314, lng: 73.8293 },
    },
    impactScope: 'Large community',
    urgency: 'High',
    priority: 'High',
    status: 'Citizen Verification',
    evidence: [
      {
        id: 'ev-1',
        name: 'road_pothole_depth_marker.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        size: 2450000,
        uploadedAt: '2026-08-28T09:15:00Z',
      },
      {
        id: 'ev-2',
        name: 'traffic_congestion_clip.mp4',
        type: 'video',
        url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
        size: 9800000,
        uploadedAt: '2026-08-28T09:18:00Z',
      },
    ],
    aiAssessment: {
      category: 'Roads & Infrastructure',
      suggestedDepartment: 'Municipal Road Maintenance & Civil Infrastructure',
      suggestedPriority: 'High',
      priorityScore: 87,
      reasoning: [
        'Significant public impact due to arterial transit route and high student pedestrian volume',
        'Physical safety hazard: Depth exceeds 15cm with recurrent water-logging risk',
        'Multiple reports clustered in 300m perimeter over the past 14 days',
        'Multi-angle visual evidence corroborating pavement structural failure',
      ],
      keyIdentifiedEntities: ['University Road', 'Pothole', 'Arterial Corridor', 'Student Transit Zone'],
      isPreliminary: true,
      generatedAt: '2026-08-28T09:18:30Z',
    },
    timeline: [
      {
        id: 't-1',
        step: '01',
        title: 'Problem Reported with Evidence',
        timestamp: '28 Aug 2026, 09:18 AM',
        status: 'Submitted',
        actorName: 'Aarav Deshmukh',
        actorRole: 'Reporting Citizen',
        notes: 'Citizen submitted detailed report with geo-tagged images and video evidence.',
      },
      {
        id: 't-2',
        step: '02',
        title: 'Preliminary AI Triage Complete',
        timestamp: '28 Aug 2026, 09:19 AM',
        status: 'Under Review',
        notes: 'AI scored urgency at 87/100 and routed case to Road Maintenance Dept.',
      },
      {
        id: 't-3',
        step: '03',
        title: 'Assigned to Executive Engineer',
        timestamp: '28 Aug 2026, 11:30 AM',
        department: 'Municipal Road Maintenance & Civil Infrastructure',
        actorName: 'Sanjay Shinde',
        actorRole: 'Executive Engineer (Zone 3)',
        status: 'Assigned',
        notes: 'Case docket generated under Work Order Reference WO-RD-2026-881. Site inspection scheduled.',
      },
      {
        id: 't-4',
        step: '04',
        title: 'On-Ground Remedial Work In Progress',
        timestamp: '29 Aug 2026, 02:40 PM',
        department: 'Municipal Road Maintenance & Civil Infrastructure',
        actorName: 'Sanjay Shinde',
        actorRole: 'Executive Engineer',
        status: 'In Progress',
        notes: 'Milling completed, sub-base compacted, wet-mix macadam and hot-mix bitumen overlay initiated.',
      },
      {
        id: 't-5',
        step: '05',
        title: 'Resolution Evidence Submitted by Department',
        timestamp: '31 Aug 2026, 04:15 PM',
        department: 'Municipal Road Maintenance & Civil Infrastructure',
        actorName: 'Sanjay Shinde',
        actorRole: 'Executive Engineer',
        status: 'Resolution Submitted',
        notes: 'Hot-mix asphalt patch laid and leveled to grade. Compaction testing verified. Citizen verification requested.',
      },
    ],
    assignedOfficer: {
      id: 'off-784',
      name: 'Sanjay Shinde',
      designation: 'Executive Engineer (Zone 3)',
      department: 'Municipal Road Maintenance & Civil Infrastructure',
    },
    deadline: '2026-09-02T18:00:00Z',
    createdAt: '2026-08-28T09:18:00Z',
    updatedAt: '2026-08-31T16:15:00Z',
    citizenName: 'Aarav Deshmukh',
    citizenPhoneMasked: '+91 98201 ****4',
    resolutionEvidence: {
      id: 'res-ev-1',
      submittedAt: '2026-08-31T16:15:00Z',
      submittedBy: 'Sanjay Shinde',
      officerDesignation: 'Executive Engineer (Zone 3)',
      notes:
        'Road surface excavated down to firm sub-grade. Dense bituminous macadam laid and compacted with 10-tonne roller. Edge sealing completed to prevent monsoon water ingress.',
      workOrderRef: 'WO-RD-2026-881',
      completionDate: '31 Aug 2026',
      media: [
        {
          id: 'res-img-1',
          name: 'completion_repaired_surface_gate2.jpg',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
          size: 3100000,
          uploadedAt: '2026-08-31T16:10:00Z',
        },
      ],
    },
    citizenVerification: {
      status: 'pending',
    },
    internalNotes: [
      {
        id: 'n-1',
        author: 'Sanjay Shinde (Executive Engineer)',
        note: 'Coordinated night-time bituminous laying to avoid stopping university transit.',
        timestamp: '29 Aug 2026, 06:10 PM',
      },
    ],
  },
  {
    id: 'CIV-2026-001089',
    title: 'Overflowing waste collection container in Ward 12 market lane',
    description:
      'The secondary community waste bin at vegetable market junction has not been cleared for four consecutive days. Waste is spilling onto the pedestrian pathway, causing intense foul smell and blocking drainage inlets.',
    category: 'Sanitation & Solid Waste',
    department: 'Solid Waste Management & Public Health Department',
    location: {
      address: 'Shop No. 42, Subhash Chowk Vegetable Market, Ward 12',
      landmark: 'Behind Old Post Office',
      ward: 'Ward 12 (Central)',
      city: 'Pune',
      district: 'Pune Urban',
      state: 'Maharashtra',
      pincode: '411002',
      coordinates: { lat: 18.5196, lng: 73.8553 },
    },
    impactScope: 'Large community',
    urgency: 'High',
    priority: 'High',
    status: 'In Progress',
    evidence: [
      {
        id: 'ev-3',
        name: 'overflowing_garbage_bin.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
        size: 1980000,
        uploadedAt: '2026-09-02T08:10:00Z',
      },
    ],
    aiAssessment: {
      category: 'Sanitation & Solid Waste',
      suggestedDepartment: 'Solid Waste Management & Public Health Department',
      suggestedPriority: 'High',
      priorityScore: 82,
      reasoning: [
        'Public health risk due to food/organic waste accumulation near fresh food vendors',
        'Secondary hazard: Impending drainage grate blockage ahead of forecasted rain',
        'Commercial high footfall zone',
      ],
      keyIdentifiedEntities: ['Vegetable Market', 'Solid Waste', 'Health Hazard'],
      isPreliminary: true,
      generatedAt: '2026-09-02T08:11:00Z',
    },
    timeline: [
      {
        id: 't-6',
        step: '01',
        title: 'Problem Logged by Citizen',
        timestamp: '02 Sep 2026, 08:10 AM',
        status: 'Submitted',
        actorName: 'Priya Joshi',
        actorRole: 'Local Resident',
      },
      {
        id: 't-7',
        step: '02',
        title: 'Assigned to Ward Sanitary Inspector',
        timestamp: '02 Sep 2026, 09:30 AM',
        department: 'Solid Waste Management',
        actorName: 'M. V. Deshpande',
        actorRole: 'Sanitary Inspector',
        status: 'Assigned',
        notes: 'Special compactor truck dispatched for clearing bin and sanitizing boundary.',
      },
      {
        id: 't-8',
        step: '03',
        title: 'Field Team on Site',
        timestamp: '03 Sep 2026, 07:00 AM',
        department: 'Solid Waste Management',
        status: 'In Progress',
        notes: 'Clearing commenced; lime powder disinfection scheduled immediately after.',
      },
    ],
    assignedOfficer: {
      id: 'off-411',
      name: 'M. V. Deshpande',
      designation: 'Sanitary Inspector (Ward 12)',
      department: 'Solid Waste Management',
    },
    deadline: '2026-09-04T12:00:00Z',
    createdAt: '2026-09-02T08:10:00Z',
    updatedAt: '2026-09-03T07:00:00Z',
    citizenName: 'Priya Joshi',
    citizenPhoneMasked: '+91 94220 ****1',
  },
  {
    id: 'CIV-2026-000955',
    title: 'Street lights non-operational along connecting road to Bus Terminal',
    description:
      'A continuous stretch of 8 LED street light poles (Pole #ST-40 to #ST-48) has been dark for over a week. This creates an unsafe transit corridor for women commuters arriving on night intercity buses.',
    category: 'Public Safety & Streetlighting',
    department: 'Electrical & Street Lighting Department',
    location: {
      address: 'Swargate Terminal Access Road, from Sub-Way exit to Rickshaw Stand',
      ward: 'Ward 21',
      city: 'Pune',
      district: 'Pune Urban',
      state: 'Maharashtra',
      pincode: '411042',
      coordinates: { lat: 18.5018, lng: 73.8586 },
    },
    impactScope: 'Large community',
    urgency: 'Critical',
    priority: 'Critical',
    status: 'Resolved',
    evidence: [
      {
        id: 'ev-4',
        name: 'dark_terminal_approach.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        size: 1540000,
        uploadedAt: '2026-08-15T20:30:00Z',
      },
    ],
    aiAssessment: {
      category: 'Public Safety & Streetlighting',
      suggestedDepartment: 'Electrical & Street Lighting Department',
      suggestedPriority: 'Critical',
      priorityScore: 94,
      reasoning: [
        'High vulnerability: Public transit terminus approach used by solo pedestrians and women at night',
        'Series fault covering 8 consecutive illumination points',
        'Direct correlation with reported night-time security apprehensions',
      ],
      keyIdentifiedEntities: ['Bus Terminal', 'Streetlight Failure', 'Public Safety', 'Night Transit'],
      isPreliminary: true,
      generatedAt: '2026-08-15T20:31:00Z',
    },
    timeline: [
      {
        id: 't-9',
        step: '01',
        title: 'Reported',
        timestamp: '15 Aug 2026, 08:30 PM',
        status: 'Submitted',
        actorName: 'Sneha Patil',
      },
      {
        id: 't-10',
        step: '02',
        title: 'Immediate Emergency Electrical Dispatch',
        timestamp: '16 Aug 2026, 09:00 AM',
        status: 'In Progress',
        department: 'Electrical Dept',
      },
      {
        id: 't-11',
        step: '03',
        title: 'Feeder Cable Repaired & Fixtures Replaced',
        timestamp: '17 Aug 2026, 05:45 PM',
        status: 'Resolution Submitted',
        department: 'Electrical Dept',
        notes: 'Underground phase cable splice replaced; all 8 luminaires tested operational.',
      },
      {
        id: 't-12',
        step: '04',
        title: 'Citizen Verified On-Site',
        timestamp: '18 Aug 2026, 09:15 PM',
        status: 'Resolved',
        actorName: 'Sneha Patil',
        notes: 'Citizen inspected corridor during night commute and confirmed all lights functioning brightly.',
      },
    ],
    assignedOfficer: {
      id: 'off-209',
      name: 'R. K. Verma',
      designation: 'Assistant Electrical Engineer',
      department: 'Electrical & Street Lighting Department',
    },
    deadline: '2026-08-18T18:00:00Z',
    createdAt: '2026-08-15T20:30:00Z',
    updatedAt: '2026-08-18T21:15:00Z',
    citizenName: 'Sneha Patil',
    citizenPhoneMasked: '+91 97631 ****8',
    resolutionEvidence: {
      id: 'res-ev-4',
      submittedAt: '2026-08-17T17:45:00Z',
      submittedBy: 'R. K. Verma',
      officerDesignation: 'Assistant Electrical Engineer',
      notes: 'Feeder line circuit breaker replaced. Continuous photometrics measured above 25 lux standard.',
      workOrderRef: 'WO-ELEC-4102',
      completionDate: '17 Aug 2026',
      media: [
        {
          id: 'res-img-4',
          name: 'illuminated_terminal_walkway.jpg',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
          size: 2100000,
          uploadedAt: '2026-08-17T17:40:00Z',
        },
      ],
    },
    citizenVerification: {
      status: 'verified',
      verifiedAt: '2026-08-18T21:15:00Z',
      satisfactionRating: 5,
      feedbackNotes: 'Verified during my 9 PM commute. All lights are operational and area feels significantly safer.',
    },
  },
  {
    id: 'CIV-2026-001150',
    title: 'Severe drinking water pressure disruption in Sector 4 Housing Colony',
    description:
      'Residents across 12 residential buildings have received low pressure or zero tap water during the designated 6-8 AM morning supply window for three consecutive days. Many working families have had to arrange private water tankers.',
    category: 'Water & Drainage',
    department: 'Water Supply & Sewerage Undertaking',
    location: {
      address: 'Near Water Tank Road, Sector 4, Kothrud',
      ward: 'Ward 08',
      city: 'Pune',
      district: 'Pune Urban',
      state: 'Maharashtra',
      pincode: '411038',
      coordinates: { lat: 18.5074, lng: 73.8077 },
    },
    impactScope: 'Multiple areas',
    urgency: 'Critical',
    priority: 'Critical',
    status: 'Under Review',
    evidence: [
      {
        id: 'ev-5',
        name: 'dry_tap_video.mp4',
        type: 'video',
        url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
        size: 7800000,
        uploadedAt: '2026-09-07T07:15:00Z',
      },
    ],
    aiAssessment: {
      category: 'Water & Drainage',
      suggestedDepartment: 'Water Supply & Sewerage Undertaking',
      suggestedPriority: 'Critical',
      priorityScore: 91,
      reasoning: [
        'Essential utility outage impacting residential cluster',
        'Vulnerability to unauthorized private tanker exploitation',
        'Potential mainline air-lock or booster valve failure identified in hydraulic telemetry',
      ],
      keyIdentifiedEntities: ['Drinking Water', 'Pipeline Pressure', 'Sector 4', 'Essential Service'],
      isPreliminary: true,
      generatedAt: '2026-09-07T07:16:00Z',
    },
    timeline: [
      {
        id: 't-13',
        step: '01',
        title: 'Reported by Citizen Group',
        timestamp: '07 Sep 2026, 07:15 AM',
        status: 'Submitted',
        actorName: 'Girish Kulkarni',
      },
      {
        id: 't-14',
        step: '02',
        title: 'AI Priority Flagging & Intake Triage',
        timestamp: '07 Sep 2026, 07:16 AM',
        status: 'Under Review',
        notes: 'Categorized as Critical drinking water disruption. Dispatched to Hydraulic Engineering team.',
      },
    ],
    deadline: '2026-09-09T18:00:00Z',
    createdAt: '2026-09-07T07:15:00Z',
    updatedAt: '2026-09-07T07:16:00Z',
    citizenName: 'Girish Kulkarni',
    citizenPhoneMasked: '+91 98901 ****2',
  },
  {
    id: 'CIV-2026-000812',
    title: 'Damaged chain-link fencing and playground equipment in Ward 19 Public Park',
    description:
      'Children play zone has broken swing anchor bolts and torn chain-link fence exposing sharp steel wires where stray dogs enter the children play area. Needs urgent structural repair.',
    category: 'Environment & Green Spaces',
    department: 'Garden & Public Parks Department',
    location: {
      address: 'Chhatrapati Shivaji Garden, Near Sub-Zonal Ward Office',
      ward: 'Ward 19',
      city: 'Pune',
      district: 'Pune Urban',
      state: 'Maharashtra',
      pincode: '411030',
      coordinates: { lat: 18.5122, lng: 73.8412 },
    },
    impactScope: 'My neighbourhood',
    urgency: 'Medium',
    priority: 'Medium',
    status: 'Assigned',
    evidence: [
      {
        id: 'ev-6',
        name: 'broken_swing_anchor.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
        size: 2150000,
        uploadedAt: '2026-08-20T11:00:00Z',
      },
    ],
    aiAssessment: {
      category: 'Environment & Green Spaces',
      suggestedDepartment: 'Garden & Public Parks Department',
      suggestedPriority: 'Medium',
      priorityScore: 68,
      reasoning: [
        'Moderate safety hazard for young children using playground equipment',
        'Enclosure perimeter breach allows stray animal entry into dedicated play zone',
      ],
      keyIdentifiedEntities: ['Playground', 'Children Safety', 'Municipal Garden'],
      isPreliminary: true,
      generatedAt: '2026-08-20T11:01:00Z',
    },
    timeline: [
      {
        id: 't-15',
        step: '01',
        title: 'Logged by Citizen',
        timestamp: '20 Aug 2026, 11:00 AM',
        status: 'Submitted',
        actorName: 'Aarav Deshmukh',
      },
      {
        id: 't-16',
        step: '02',
        title: 'Assigned to Garden Superintendent',
        timestamp: '21 Aug 2026, 10:30 AM',
        status: 'Assigned',
        department: 'Garden & Public Parks',
        actorName: 'Vandana Rao',
        notes: 'Material requisition raised for swing bearings and galvanized wire replacement.',
      },
    ],
    assignedOfficer: {
      id: 'off-512',
      name: 'Vandana Rao',
      designation: 'Assistant Garden Superintendent',
      department: 'Garden & Public Parks Department',
    },
    deadline: '2026-09-12T18:00:00Z',
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-08-21T10:30:00Z',
    citizenName: 'Aarav Deshmukh',
    citizenPhoneMasked: '+91 98201 ****4',
  },
  {
    id: 'CIV-2026-000780',
    title: 'Dangerous uncovered storm drainage trench along Tilak Road shopping footpath',
    description:
      'Heavy concrete slab over storm drain was removed during optic fiber laying and left open without safety barricades or reflective tape, directly on pedestrian path.',
    category: 'Roads & Infrastructure',
    department: 'Municipal Road Maintenance & Civil Infrastructure',
    location: {
      address: 'Opposite State Bank Branch, Tilak Road',
      ward: 'Ward 15',
      city: 'Pune',
      district: 'Pune Urban',
      state: 'Maharashtra',
      pincode: '411030',
      coordinates: { lat: 18.5085, lng: 73.8471 },
    },
    impactScope: 'Large community',
    urgency: 'Critical',
    priority: 'Critical',
    status: 'Resolved',
    evidence: [],
    aiAssessment: {
      category: 'Roads & Infrastructure',
      suggestedDepartment: 'Municipal Road Maintenance & Civil Infrastructure',
      suggestedPriority: 'Critical',
      priorityScore: 92,
      reasoning: ['Immediate fall hazard on commercial sidewalk', 'High pedestrian exposure at dusk'],
      keyIdentifiedEntities: ['Storm Drain', 'Footpath', 'Trench', 'Pedestrian Hazard'],
      isPreliminary: true,
      generatedAt: '2026-08-10T14:22:00Z',
    },
    timeline: [
      {
        id: 't-17',
        step: '01',
        title: 'Reported',
        timestamp: '10 Aug 2026, 02:20 PM',
        status: 'Submitted',
        actorName: 'Kunal Ranade',
      },
      {
        id: 't-18',
        step: '02',
        title: 'Barricaded & Slab Reinstalled',
        timestamp: '11 Aug 2026, 11:15 AM',
        status: 'Resolution Submitted',
        department: 'Road Maintenance',
      },
      {
        id: 't-19',
        step: '03',
        title: 'Citizen Confirmed Resolution',
        timestamp: '12 Aug 2026, 09:00 AM',
        status: 'Resolved',
        actorName: 'Kunal Ranade',
      },
    ],
    deadline: '2026-08-12T18:00:00Z',
    createdAt: '2026-08-10T14:20:00Z',
    updatedAt: '2026-08-12T09:00:00Z',
    citizenName: 'Kunal Ranade',
    citizenPhoneMasked: '+91 98811 ****5',
    citizenVerification: {
      status: 'verified',
      verifiedAt: '2026-08-12T09:00:00Z',
      satisfactionRating: 5,
      feedbackNotes: 'Promptly repaired with heavy pre-cast concrete lid and edge sealed.',
    },
  },
];

export interface ComplaintFilterOptions {
  search?: string;
  category?: ProblemCategory | 'All';
  department?: string | 'All';
  status?: ProblemStatus | 'All';
  priority?: PriorityLevel | 'All';
  ward?: string;
  sortBy?: 'newest' | 'oldest' | 'urgency';
}

export const complaintService = {
  async getComplaints(filters?: ComplaintFilterOptions): Promise<Problem[]> {
    await new Promise((r) => setTimeout(r, 100));
    let items = [...MOCK_PROBLEMS];

    if (!filters) return items;

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.address.toLowerCase().includes(q) ||
          p.location.ward.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== 'All') {
      items = items.filter((p) => p.category === filters.category);
    }

    if (filters.department && filters.department !== 'All') {
      items = items.filter((p) => p.department === filters.department);
    }

    if (filters.status && filters.status !== 'All') {
      items = items.filter((p) => p.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'All') {
      items = items.filter((p) => p.priority === filters.priority);
    }

    if (filters.sortBy === 'oldest') {
      items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filters.sortBy === 'urgency') {
      const urgencyRank: Record<PriorityLevel, number> = {
        Critical: 4,
        High: 3,
        Medium: 2,
        Low: 1,
      };
      items.sort((a, b) => urgencyRank[b.priority] - urgencyRank[a.priority]);
    } else {
      // newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return items;
  },

  async getComplaintById(id: string): Promise<Problem | null> {
    await new Promise((r) => setTimeout(r, 80));
    const item = MOCK_PROBLEMS.find((p) => p.id.toUpperCase() === id.toUpperCase());
    return item ? JSON.parse(JSON.stringify(item)) : null;
  },

  async submitComplaint(payload: Partial<Problem>): Promise<Problem> {
    await new Promise((r) => setTimeout(r, 350));
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const newId = `CIV-2026-00${randomSeq}`;
    const now = new Date().toISOString();

    // Generate realistic AI assessment
    const priorityScore =
      payload.urgency === 'Critical'
        ? 92
        : payload.urgency === 'High'
        ? 84
        : payload.urgency === 'Medium'
        ? 62
        : 38;

    const departmentMap: Record<ProblemCategory, string> = {
      'Roads & Infrastructure': 'Municipal Road Maintenance & Civil Infrastructure',
      'Water & Drainage': 'Water Supply & Sewerage Undertaking',
      'Sanitation & Solid Waste': 'Solid Waste Management & Public Health Department',
      'Public Transport & Traffic': 'Traffic Police & Urban Transit Cell',
      'Education & Facilities': 'Education & Municipal School Administration',
      'Healthcare & Sanitation': 'Public Health & Primary Care Directorate',
      'Public Safety & Streetlighting': 'Electrical & Street Lighting Department',
      'Environment & Green Spaces': 'Garden & Public Parks Department',
      'Civic & Revenue Services': 'Zonal Revenue & Citizen Service Center',
      'Other Civic Issues': 'Municipal Central Grievance Redressal Cell',
    };

    const targetDepartment =
      departmentMap[payload.category as ProblemCategory] ||
      'Municipal Central Grievance Redressal Cell';

    const newProblem: Problem = {
      id: newId,
      title: payload.title || 'Untitled Civic Complaint',
      description: payload.description || '',
      category: (payload.category as ProblemCategory) || 'Roads & Infrastructure',
      department: targetDepartment,
      location: payload.location || {
        address: 'Shivajinagar',
        ward: 'Ward 14',
        city: 'Pune',
        district: 'Pune Urban',
        state: 'Maharashtra',
        pincode: '411005',
      },
      impactScope: payload.impactScope || 'My neighbourhood',
      urgency: payload.urgency || 'Medium',
      priority: payload.urgency || 'Medium',
      status: 'Submitted',
      evidence: payload.evidence || [],
      aiAssessment: {
        category: (payload.category as ProblemCategory) || 'Roads & Infrastructure',
        suggestedDepartment: targetDepartment,
        suggestedPriority: payload.urgency || 'Medium',
        priorityScore,
        reasoning: [
          `Classified under ${payload.category} based on semantic description and keywords`,
          `Impact scope indicated: "${payload.impactScope}"`,
          `${payload.evidence?.length || 0} pieces of digital visual/document proof attached for preliminary verification`,
          'Preliminary advisory dispatch route calculated for prompt zonal action',
        ],
        keyIdentifiedEntities: [payload.category || 'General', payload.location?.city || 'Pune'],
        isPreliminary: true,
        generatedAt: now,
      },
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          step: '01',
          title: 'Problem Reported with Evidence',
          timestamp: 'Just now',
          status: 'Submitted',
          actorName: payload.citizenName || 'Citizen User',
          actorRole: 'Reporting Citizen',
          notes: 'Citizen submitted detailed report through CivicBridge web platform.',
        },
        {
          id: `t-${Date.now()}-2`,
          step: '02',
          title: 'Automated Preliminary AI Assessment',
          timestamp: 'Just now',
          status: 'Under Review',
          department: targetDepartment,
          notes: `Suggested dispatch to ${targetDepartment}. Priority score: ${priorityScore}/100.`,
        },
      ],
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
      updatedAt: now,
      citizenName: payload.citizenName || 'Citizen User',
      citizenPhoneMasked: payload.citizenPhoneMasked || '+91 98201 ****4',
      internalNotes: [],
    };

    MOCK_PROBLEMS = [newProblem, ...MOCK_PROBLEMS];
    return newProblem;
  },

  async updateStatus(id: string, newStatus: ProblemStatus, note?: string, actorName = 'Administrative Officer'): Promise<Problem> {
    await new Promise((r) => setTimeout(r, 120));
    const problem = MOCK_PROBLEMS.find((p) => p.id === id);
    if (!problem) throw new Error('Problem not found');

    problem.status = newStatus;
    problem.updatedAt = new Date().toISOString();

    const newTimelineEvent = {
      id: `t-${Date.now()}`,
      step: '04',
      title: `Status Updated to ${newStatus}`,
      timestamp: 'Just now',
      department: problem.department,
      actorName,
      actorRole: 'Administrative Officer',
      status: newStatus,
      notes: note || `Status transitioned to ${newStatus} in municipal management system.`,
    };

    problem.timeline.push(newTimelineEvent);
    return JSON.parse(JSON.stringify(problem));
  },

  async assignOfficer(
    id: string,
    officer: { id: string; name: string; designation: string; department: string },
    deadline?: string
  ): Promise<Problem> {
    await new Promise((r) => setTimeout(r, 150));
    const problem = MOCK_PROBLEMS.find((p) => p.id === id);
    if (!problem) throw new Error('Problem not found');

    problem.assignedOfficer = officer;
    problem.department = officer.department;
    if (deadline) problem.deadline = deadline;
    problem.status = 'Assigned';
    problem.updatedAt = new Date().toISOString();

    problem.timeline.push({
      id: `t-${Date.now()}`,
      step: '03',
      title: `Assigned to ${officer.name}`,
      timestamp: 'Just now',
      department: officer.department,
      actorName: officer.name,
      actorRole: officer.designation,
      status: 'Assigned',
      notes: `Official administrative assignment confirmed. Action target deadline: ${
        deadline ? new Date(deadline).toLocaleDateString() : 'Standard SLA'
      }.`,
    });

    return JSON.parse(JSON.stringify(problem));
  },

  async submitResolutionEvidence(
    id: string,
    evidence: {
      notes: string;
      submittedBy: string;
      officerDesignation: string;
      workOrderRef?: string;
      media: EvidenceItem[];
    }
  ): Promise<Problem> {
    await new Promise((r) => setTimeout(r, 200));
    const problem = MOCK_PROBLEMS.find((p) => p.id === id);
    if (!problem) throw new Error('Problem not found');

    const resolution: ResolutionEvidence = {
      id: `res-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      submittedBy: evidence.submittedBy,
      officerDesignation: evidence.officerDesignation,
      notes: evidence.notes,
      media: evidence.media,
      workOrderRef: evidence.workOrderRef,
      completionDate: new Date().toLocaleDateString(),
    };

    problem.resolutionEvidence = resolution;
    problem.status = 'Citizen Verification';
    problem.updatedAt = new Date().toISOString();

    problem.timeline.push({
      id: `t-${Date.now()}`,
      step: '05',
      title: 'Resolution Evidence Submitted by Department',
      timestamp: 'Just now',
      department: problem.department,
      actorName: evidence.submittedBy,
      actorRole: evidence.officerDesignation,
      status: 'Resolution Submitted',
      notes: `${evidence.notes} — Citizen verification phase initiated.`,
    });

    return JSON.parse(JSON.stringify(problem));
  },

  async verifyResolution(
    id: string,
    verification: {
      status: 'verified' | 'disputed';
      disputeReason?: string;
      feedbackNotes?: string;
      satisfactionRating?: number;
    }
  ): Promise<Problem> {
    await new Promise((r) => setTimeout(r, 200));
    const problem = MOCK_PROBLEMS.find((p) => p.id === id);
    if (!problem) throw new Error('Problem not found');

    const citizenVerification: CitizenVerification = {
      status: verification.status,
      verifiedAt: new Date().toISOString(),
      disputeReason: verification.disputeReason,
      feedbackNotes: verification.feedbackNotes,
      satisfactionRating: verification.satisfactionRating,
    };

    problem.citizenVerification = citizenVerification;
    problem.status = verification.status === 'verified' ? 'Resolved' : 'Reopened';
    problem.updatedAt = new Date().toISOString();

    problem.timeline.push({
      id: `t-${Date.now()}`,
      step: '06',
      title:
        verification.status === 'verified'
          ? 'Citizen Resolution Verification Confirmed'
          : 'Citizen Disputed Resolution — Case Reopened',
      timestamp: 'Just now',
      status: problem.status,
      actorName: problem.citizenName,
      actorRole: 'Reporting Citizen',
      notes:
        verification.status === 'verified'
          ? `Citizen confirmed on-ground resolution. Satisfaction: ${verification.satisfactionRating || 5}/5. Case closed.`
          : `Citizen reported: "${verification.disputeReason || 'Issue remains unresolved'}". Docket reopened for follow-up review.`,
    });

    return JSON.parse(JSON.stringify(problem));
  },

  async addInternalNote(
    id: string,
    author: string,
    arg3: string,
    arg4?: string
  ): Promise<Problem> {
    await new Promise((r) => setTimeout(r, 100));
    const problem = MOCK_PROBLEMS.find((p) => p.id === id);
    if (!problem) throw new Error('Problem not found');

    const note = arg4 !== undefined ? arg4 : arg3;
    const authorRole = arg4 !== undefined ? arg3 : '';

    if (!problem.internalNotes) problem.internalNotes = [];
    problem.internalNotes.unshift({
      id: `note-${Date.now()}`,
      author: authorRole ? `${author} (${authorRole})` : author,
      note,
      timestamp: new Date().toLocaleString(),
    });

    return JSON.parse(JSON.stringify(problem));
  },

  async submitResolution(
    id: string,
    evidence: {
      notes: string;
      submittedBy: string;
      officerDesignation: string;
      workOrderRef?: string;
      media: EvidenceItem[];
    }
  ): Promise<Problem> {
    return this.submitResolutionEvidence(id, evidence);
  },
};
