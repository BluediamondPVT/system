export interface AshapuraProject {
  id: string;
  name: string;
  tag?: 'CHSL' | 'SRA' | 'JV' | 'Free-Sale';
  location: string;
  zone: string;
  floorsAndWings: string;
  totalFloors: number;
  wings: string[];
  basePricePerSqft: number;
  rehabMembers?: number;
  freeSaleUnits: number;
  reraNumber: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  description: string;
}

export interface InventoryUnit {
  id: string;
  projectId: string;
  wing: string;
  floor: number;
  unitNumber: string;
  typology: '1BHK' | '2BHK' | '3BHK';
  carpetAreaSqft: number;
  basePricePerSqft: number;
  status: 'Available' | 'Hold' | 'Booked' | 'JV';
  tokenHolder?: string;
  tokenDate?: string;
}

export interface LeadProspect {
  id: string;
  name: string;
  phone: string;
  email?: string;
  projectId: string;
  projectName: string;
  configuration: string;
  budget: string;
  stage: 'NEW' | 'CONTACTED' | 'VISIT PLANNED' | 'NEGOTIATION' | 'BOOKED';
  source: 'Meta Ads' | 'Website' | '99acres' | 'Walk-in Malad HO' | 'Channel Partner';
  createdAt: string;
  notes?: string;
}

export interface DemandNotice {
  id: string;
  noticeCode: string;
  projectId: string;
  projectName: string;
  unitNumber: string;
  allottee: string;
  isHardshipAllowance?: boolean;
  category: 'Milestone Collection' | 'CHSL Hardship Rent' | 'Plinth Level' | 'Slab Casting';
  milestoneScope: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  dispatched: boolean;
}

export const ASHAPURA_PROJECTS: AshapuraProject[] = [
  {
    id: 'amar-chsl',
    name: 'Amar CHSL (Redevelopment)',
    tag: 'CHSL',
    location: 'Goregaon West, Mumbai',
    zone: 'Western Suburbs',
    floorsAndWings: '12 Floors (Tower 1)',
    totalFloors: 12,
    wings: ['Tower 1'],
    basePricePerSqft: 21500,
    rehabMembers: 20,
    freeSaleUnits: 22,
    reraNumber: 'P51800034291',
    status: 'Ongoing',
    description: 'Landmark society redevelopment project with premium 2 & 3 BHK rehab and free-sale inventory.',
  },
  {
    id: 'meghmala-crysta',
    name: 'Meghmala Crysta',
    location: 'Malad West, Mumbai',
    zone: 'Western Suburbs',
    floorsAndWings: '15 Floors (Wing A, Wing B)',
    totalFloors: 15,
    wings: ['Wing A', 'Wing B'],
    basePricePerSqft: 23500,
    freeSaleUnits: 150,
    reraNumber: 'P51800028914',
    status: 'Ongoing',
    description: 'Ultra-luxury high-rise tower located behind Inorbit Mall, Malad West.',
  },
  {
    id: 'navkar-heritage',
    name: 'Navkar Heritage',
    location: 'Goregaon West, Mumbai',
    zone: 'Western Suburbs',
    floorsAndWings: '14 Floors (Wing A)',
    totalFloors: 14,
    wings: ['Wing A'],
    basePricePerSqft: 22000,
    freeSaleUnits: 56,
    reraNumber: 'P51800031022',
    status: 'Ongoing',
    description: 'Boutique residential enclave offering vastu-compliant urban apartments.',
  },
  {
    id: 'bhagywan-primrose',
    name: 'Bhagywan Primrose',
    location: 'Bhandup East, Mumbai',
    zone: 'Central Suburbs',
    floorsAndWings: '18 Floors (Wing A, Wing B)',
    totalFloors: 18,
    wings: ['Wing A', 'Wing B'],
    basePricePerSqft: 16500,
    freeSaleUnits: 84,
    reraNumber: 'P51800045102',
    status: 'Ongoing',
    description: 'High-yield residential investment adjacent to Eastern Express Highway.',
  },
  {
    id: 'aloha-township',
    name: 'Aloha Township',
    tag: 'JV',
    location: 'Palghar West, Mumbai Suburban',
    zone: 'Palghar Division',
    floorsAndWings: '7 Floors (Cluster 1-4)',
    totalFloors: 7,
    wings: ['Cluster 1', 'Cluster 2'],
    basePricePerSqft: 4800,
    freeSaleUnits: 180,
    reraNumber: 'P51900019283',
    status: 'Ongoing',
    description: 'Integrated gated township community with modern club facilities & scenic views.',
  },
  {
    id: 'ronak-villa',
    name: 'Ronak Villa',
    tag: 'CHSL',
    location: 'Goregaon West, Mumbai',
    zone: 'Western Suburbs',
    floorsAndWings: '11 Floors (Tower 1)',
    totalFloors: 11,
    wings: ['Tower 1'],
    basePricePerSqft: 24000,
    rehabMembers: 16,
    freeSaleUnits: 18,
    reraNumber: 'P51800033100',
    status: 'Ongoing',
    description: 'Exclusive CHSL revival project offering deck apartments and rooftop amenities.',
  },
  {
    id: 'jay-gagan',
    name: 'Jay Gagan (Head Office & Tower)',
    location: 'Malad West, Liberty Garden, Mumbai',
    zone: 'Western Suburbs',
    floorsAndWings: '16 Floors (Commercial & Luxury Suites)',
    totalFloors: 16,
    wings: ['Main Wing'],
    basePricePerSqft: 25500,
    freeSaleUnits: 48,
    reraNumber: 'P51800019842',
    status: 'Completed',
    description: 'Corporate headquarters of Ashapura Builders with flagship commercial retail.',
  },
  {
    id: 'nishad-chsl',
    name: 'Nishad CHSL',
    tag: 'CHSL',
    location: 'Bandra West, Mumbai',
    zone: 'Western Suburbs',
    floorsAndWings: '10 Floors (Signature Tower)',
    totalFloors: 10,
    wings: ['Signature Wing'],
    basePricePerSqft: 38000,
    rehabMembers: 12,
    freeSaleUnits: 14,
    reraNumber: 'P51800049211',
    status: 'Upcoming',
    description: 'Super-prime redevelopment on Pali Hill extension.',
  },
  {
    id: 'diyana-villa',
    name: 'Diyana Villa',
    location: 'Goregaon West, Mumbai',
    zone: 'Western Suburbs',
    floorsAndWings: '12 Floors (Tower A)',
    totalFloors: 12,
    wings: ['Tower A'],
    basePricePerSqft: 22500,
    freeSaleUnits: 36,
    reraNumber: 'P51800037890',
    status: 'Ongoing',
    description: 'Contemporary deck residences near Link Road with smart automation.',
  },
  {
    id: 'riddhi-tower',
    name: 'Riddhi Tower',
    location: 'Kandivali West, Mumbai',
    zone: 'Western Suburbs',
    floorsAndWings: '16 Floors (Wing 1)',
    totalFloors: 16,
    wings: ['Wing 1'],
    basePricePerSqft: 20500,
    freeSaleUnits: 64,
    reraNumber: 'P51800021455',
    status: 'Ongoing',
    description: 'Family residences located 5 minutes from metro transit corridor.',
  },
];

// Generate dynamic stacking plan units for Meghmala Crysta (15 Floors, 5 Units per floor)
export function generateInitialInventory(): InventoryUnit[] {
  const units: InventoryUnit[] = [];
  const floors = 15;
  const baseRate = 23500;

  for (let floor = floors; floor >= 1; floor--) {
    for (let u = 1; u <= 5; u++) {
      const unitNum = `${floor}${u < 10 ? '0' + u : u}`;
      let typology: '1BHK' | '2BHK' | '3BHK' = '2BHK';
      let carpetArea = 740;

      if (u === 1 || u === 3) {
        typology = '1BHK';
        carpetArea = 485;
      } else if (u === 5) {
        typology = '3BHK';
        carpetArea = 1080;
      }

      // Default distribution matching Ashapura Stacking plan
      let status: 'Available' | 'Hold' | 'Booked' | 'JV' = 'Available';

      if (floor === 15 && u === 5) {
        status = 'JV';
      } else if (floor === 14 && u === 3) {
        status = 'Booked';
      } else if (floor === 13 && u === 1) {
        status = 'Booked';
      } else if (floor === 13 && u === 2) {
        status = 'Hold';
      } else if (floor === 12 && u === 4) {
        status = 'Booked';
      } else if (floor === 11 && u === 2) {
        status = 'Hold';
      } else if (floor === 10 && u === 5) {
        status = 'Booked';
      } else if (floor === 9 && u === 1) {
        status = 'Booked';
      } else if (floor === 8 && u === 3) {
        status = 'Hold';
      } else if (floor === 7 && u === 2) {
        status = 'Booked';
      } else if (floor === 6 && u === 4) {
        status = 'Hold';
      } else if (floor === 5 && u === 1) {
        status = 'Booked';
      } else if (floor === 4 && u === 3) {
        status = 'Booked';
      } else if (floor === 3 && u === 2) {
        status = 'Hold';
      } else if (floor === 2 && u === 5) {
        status = 'Booked';
      } else if (floor === 1 && u === 4) {
        status = 'Hold';
      }

      units.push({
        id: `unit-${unitNum}`,
        projectId: 'meghmala-crysta',
        wing: 'Wing A',
        floor,
        unitNumber: unitNum,
        typology,
        carpetAreaSqft: carpetArea,
        basePricePerSqft: baseRate,
        status,
      });
    }
  }

  return units;
}

export const INITIAL_LEADS: LeadProspect[] = [
  {
    id: 'lead-1',
    name: 'Rajesh Patel',
    phone: '+91 9876543210',
    email: 'rajesh.patel@gmail.com',
    projectId: 'meghmala-crysta',
    projectName: 'Meghmala Crysta (Malad W)',
    configuration: '2 BHK Layout',
    budget: '1.85 Cr',
    stage: 'NEW',
    source: 'Meta Ads',
    createdAt: '22 Sep 2026',
    notes: 'Interested in middle floors facing east. Looking for payment plan.',
  },
  {
    id: 'lead-2',
    name: 'Sneha Sharma',
    phone: '+91 9876543211',
    email: 'sneha.sharma@yahoo.co.in',
    projectId: 'amar-chsl',
    projectName: 'Amar CHSL (Goregaon W)',
    configuration: '2 BHK Layout',
    budget: '1.55 Cr',
    stage: 'CONTACTED',
    source: 'Website',
    createdAt: '21 Sep 2026',
    notes: 'Inquired about society redevelopment handover timelines.',
  },
  {
    id: 'lead-3',
    name: 'Amit Kumar',
    phone: '+91 9876543212',
    email: 'amit.kumar@outlook.com',
    projectId: 'bhagywan-primrose',
    projectName: 'Bhagywan Primrose (Bhandup)',
    configuration: '1 BHK Layout',
    budget: '95 Lacs',
    stage: 'VISIT PLANNED',
    source: '99acres',
    createdAt: '20 Sep 2026',
    notes: 'Site visit scheduled for Saturday 3:00 PM with sales manager.',
  },
  {
    id: 'lead-4',
    name: 'Priya Singh',
    phone: '+91 9876543213',
    email: 'priya.singh@gmail.com',
    projectId: 'navkar-heritage',
    projectName: 'Navkar Heritage (Goregaon W)',
    configuration: '2 BHK Layout',
    budget: '1.7 Cr',
    stage: 'NEGOTIATION',
    source: 'Walk-in Malad HO',
    createdAt: '19 Sep 2026',
    notes: 'Evaluating floor rise waiver for 12th floor unit.',
  },
  {
    id: 'lead-5',
    name: 'Vikas Jain',
    phone: '+91 9876543214',
    email: 'vikas.jain@jainfin.com',
    projectId: 'aloha-township',
    projectName: 'Aloha (Palghar)',
    configuration: '1 BHK Layout',
    budget: '32 Lacs',
    stage: 'BOOKED',
    source: 'Meta Ads',
    createdAt: '18 Sep 2026',
    notes: 'Token ₹1,00,000 received. Agreement execution in progress.',
  },
  {
    id: 'lead-6',
    name: 'Kavita Shah',
    phone: '+91 9820123456',
    email: 'kavita.shah@gmail.com',
    projectId: 'diyana-villa',
    projectName: 'Diyana Villa (Goregaon W)',
    configuration: '2 BHK Duplex Layout',
    budget: '1.9 Cr',
    stage: 'CONTACTED',
    source: 'Channel Partner',
    createdAt: '17 Sep 2026',
    notes: 'Broker referral via Apex Realty. Requested floor plan brochure.',
  },
  {
    id: 'lead-7',
    name: 'Suresh Mehta',
    phone: '+91 9819001122',
    email: 'suresh.mehta@yahoo.com',
    projectId: 'meghmala-crysta',
    projectName: 'Meghmala Crysta (Malad W)',
    configuration: '3 BHK Deck Layout',
    budget: '2.6 Cr',
    stage: 'NEW',
    source: 'Website',
    createdAt: '22 Sep 2026',
    notes: 'Looking for high floor 1405 or 1505.',
  },
  {
    id: 'lead-8',
    name: 'Ananya Deshmukh',
    phone: '+91 9920334455',
    email: 'ananya.deshmukh@gmail.com',
    projectId: 'amar-chsl',
    projectName: 'Amar CHSL (Goregaon W)',
    configuration: '3 BHK Layout',
    budget: '2.1 Cr',
    stage: 'VISIT PLANNED',
    source: 'Walk-in Malad HO',
    createdAt: '21 Sep 2026',
    notes: 'Family visit confirmed with Project Architect.',
  },
];

export const INITIAL_DEMANDS: DemandNotice[] = [
  {
    id: 'demand-1',
    noticeCode: 'D001',
    projectId: 'meghmala-crysta',
    projectName: 'Meghmala Crysta',
    unitNumber: 'Wing A-402',
    allottee: 'Rahul Sharma',
    category: 'Slab Casting',
    milestoneScope: '3rd Slab Casting (MahaRERA 35%)',
    amount: 1250000,
    dueDate: '27 Sep 2026',
    status: 'PENDING',
    dispatched: false,
  },
  {
    id: 'demand-2',
    noticeCode: 'D002',
    projectId: 'amar-chsl',
    projectName: 'Amar CHSL (Redev)',
    unitNumber: 'Rehab Allottees',
    allottee: 'Amar CHSL Society Corpus Fund',
    isHardshipAllowance: true,
    category: 'CHSL Hardship Rent',
    milestoneScope: 'Displacement Hardship Allowance (Q2)',
    amount: 1800000,
    dueDate: '20 Sep 2026',
    status: 'OVERDUE',
    dispatched: true,
  },
  {
    id: 'demand-3',
    noticeCode: 'D003',
    projectId: 'amar-chsl',
    projectName: 'Amar CHSL (Redev)',
    unitNumber: 'Tower 1-801',
    allottee: 'Vikram Aditya',
    category: 'Plinth Level',
    milestoneScope: 'Plinth Completion Milestone',
    amount: 1500000,
    dueDate: '12 Sep 2026',
    status: 'PAID',
    dispatched: true,
  },
  {
    id: 'demand-4',
    noticeCode: 'D004',
    projectId: 'bhagywan-primrose',
    projectName: 'Bhagywan Primrose',
    unitNumber: 'Wing B-105',
    allottee: 'Anita Desai',
    category: 'Milestone Collection',
    milestoneScope: 'Booking Agreement Execution',
    amount: 850000,
    dueDate: '25 Sep 2026',
    status: 'PENDING',
    dispatched: false,
  },
  {
    id: 'demand-5',
    noticeCode: 'D005',
    projectId: 'navkar-heritage',
    projectName: 'Navkar Heritage',
    unitNumber: 'Wing A-602',
    allottee: 'Sunil Chhabra',
    category: 'Slab Casting',
    milestoneScope: '7th Slab Superstructure Completion',
    amount: 1420000,
    dueDate: '30 Sep 2026',
    status: 'PENDING',
    dispatched: false,
  },
  {
    id: 'demand-6',
    noticeCode: 'D006',
    projectId: 'aloha-township',
    projectName: 'Aloha Township',
    unitNumber: 'Cluster 2-304',
    allottee: 'Manoj Parmar',
    category: 'Milestone Collection',
    milestoneScope: 'Brickwork & Internal Plaster',
    amount: 380000,
    dueDate: '15 Sep 2026',
    status: 'PAID',
    dispatched: true,
  },
];
