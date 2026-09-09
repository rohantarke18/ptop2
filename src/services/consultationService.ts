import { Consultation } from '../types';

let MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: 'pol-2026-01',
    title: 'Draft Municipal Framework for Urban Non-Motorized Transport & Pedestrian Priority Zones',
    department: 'Urban Development & Traffic Governance Directorate',
    topic: 'Sustainable Mobility & Pedestrian Safety',
    status: 'Active',
    summary:
      'Pedestrians and cyclists account for more than 52% of short intra-ward journeys within our city, yet receive less than 12% of dedicated roadway right-of-way. This policy framework proposes mandatory 2.0m unobstructed footpaths, raised tabletop pedestrian crossings near transit hubs, and phased weekend pedestrianization of heritage commercial streets.',
    deadline: '2026-09-30T23:59:59Z',
    totalResponses: 1420,
    questions: [
      {
        id: 'q-1',
        prompt:
          'Do you support the phased pedestrianization of high-density heritage commercial streets on weekend evenings with designated peripheral electric feeder shuttles?',
        type: 'single_choice',
        options: ['Strongly Support', 'Support with Conditional Delivery Hours', 'Oppose', 'Neutral / Undecided'],
        liveDistribution: {
          'Strongly Support': 860,
          'Support with Conditional Delivery Hours': 340,
          'Oppose': 140,
          'Neutral / Undecided': 80,
        },
      },
      {
        id: 'q-2',
        prompt:
          'How critical is the implementation of raised tabletop crossings near municipal primary schools and metro station nodes?',
        type: 'rating_scale',
        options: ['1 - Not Critical', '2 - Low Priority', '3 - Moderate', '4 - Very Important', '5 - Top Priority'],
        liveDistribution: {
          '5 - Top Priority': 980,
          '4 - Very Important': 310,
          '3 - Moderate': 90,
          '2 - Low Priority': 25,
          '1 - Not Critical': 15,
        },
      },
      {
        id: 'q-3',
        prompt:
          'Please share your recommendations regarding delivery vehicle loading bays and merchant goods movement during pedestrian-only hours.',
        type: 'open_text',
      },
    ],
  },
  {
    id: 'pol-2026-02',
    title: 'Compulsory Decentralized Greywater Treatment in New Commercial & High-Rise Residential Layouts',
    department: 'Water Supply & Sewerage Management Board',
    topic: 'Water Security & Resource Recycling',
    status: 'Active',
    summary:
      'To prevent groundwater depletion and mitigate stress on central sewage treatment plants, this policy mandates dual-piping greywater recycling systems in all residential complexes exceeding 50 units and commercial complexes exceeding 20,000 sq ft.',
    deadline: '2026-10-15T23:59:59Z',
    totalResponses: 2180,
    questions: [
      {
        id: 'q-water-1',
        prompt: 'Should the municipal corporation offer a 5% property tax rebate for societies achieving 100% on-site greywater reuse for flushing and landscaping?',
        type: 'single_choice',
        options: ['Yes, fiscal incentives will accelerate adoption', 'No, mandate without rebates', 'Offer accelerated building plan clearance instead'],
        liveDistribution: {
          'Yes, fiscal incentives will accelerate adoption': 1540,
          'No, mandate without rebates': 420,
          'Offer accelerated building plan clearance instead': 220,
        },
      },
      {
        id: 'q-water-2',
        prompt: 'What transitional grace period should existing apartment associations receive to retrofit tertiary greywater filtration?',
        type: 'single_choice',
        options: ['12 Months', '24 Months', '36 Months', 'Exempt existing buildings entirely'],
        liveDistribution: {
          '12 Months': 410,
          '24 Months': 1180,
          '36 Months': 490,
          'Exempt existing buildings entirely': 100,
        },
      },
    ],
  },
  {
    id: 'pol-2026-03',
    title: 'Designated Ward Vending Zones & Hawking Regulations under the Street Vendors Act',
    department: 'Social Welfare & Urban Livelihood Cell',
    topic: 'Public Space Sharing & Informal Economy',
    status: 'Under Deliberation',
    summary:
      'Spatial demarcation of non-motorized vending corridors to balance pedestrian walkway flow while protecting the livelihoods of over 18,000 registered street vendors.',
    deadline: '2026-08-31T23:59:59Z',
    totalResponses: 3120,
    questions: [
      {
        id: 'q-vend-1',
        prompt: 'Do you agree with fixed operating time slots (6:00 AM - 11:00 AM, 4:00 PM - 9:00 PM) for vegetable and perishable vendors in neighborhood residential streets?',
        type: 'single_choice',
        options: ['Agree', 'Partially Agree with local ward flexibility', 'Disagree'],
        liveDistribution: {
          'Agree': 1870,
          'Partially Agree with local ward flexibility': 840,
          'Disagree': 410,
        },
      },
    ],
  },
];

export const consultationService = {
  async getConsultations(): Promise<Consultation[]> {
    await new Promise((r) => setTimeout(r, 60));
    return [...MOCK_CONSULTATIONS];
  },

  async getConsultationById(id: string): Promise<Consultation | null> {
    await new Promise((r) => setTimeout(r, 50));
    const item = MOCK_CONSULTATIONS.find((c) => c.id === id);
    return item ? JSON.parse(JSON.stringify(item)) : null;
  },

  async submitResponse(
    consultationId: string,
    payload: {
      userName?: string;
      userRole?: string;
      ward?: string;
      answers: Record<string, any>;
    }
  ): Promise<{ id: string; recordedAt: string }> {
    await new Promise((r) => setTimeout(r, 150));
    const item = MOCK_CONSULTATIONS.find((c) => c.id === consultationId);
    if (!item) throw new Error('Consultation not found');

    item.totalResponses += 1;

    // Increment question distributions if chosen
    for (const [qid, answer] of Object.entries(payload.answers)) {
      const q = item.questions.find((quest) => quest.id === qid);
      if (q && q.liveDistribution && typeof answer === 'string') {
        q.liveDistribution[answer] = (q.liveDistribution[answer] || 0) + 1;
      }
    }

    return {
      id: `VOTE-REC-${Date.now().toString().slice(-6)}`,
      recordedAt: new Date().toISOString(),
    };
  },

  // Backward compatibility alias
  async submitFeedback(payload: any): Promise<Consultation> {
    const item = MOCK_CONSULTATIONS.find((c) => c.id === payload.consultationId);
    if (!item) throw new Error('Consultation not found');
    item.totalResponses += 1;
    return JSON.parse(JSON.stringify(item));
  },
};
