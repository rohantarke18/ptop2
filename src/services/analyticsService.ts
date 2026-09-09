import { PublicMetrics } from '../types';

export interface DepartmentMetric {
  name: string;
  shortName: string;
  reported: number;
  resolved: number;
  overdue: number;
  avgDays: number;
  slaRate: number; // percentage
}

export interface TrendDataPoint {
  month: string;
  reported: number;
  resolved: number;
  verified: number;
}

export interface CategoryDistribution {
  name: string;
  count: number;
  color: string;
}

export interface WardMetric {
  ward: string;
  activeCount: number;
  resolvedCount: number;
  avgTimeDays: number;
}

export const analyticsService = {
  async getPublicMetrics(): Promise<PublicMetrics> {
    await new Promise((r) => setTimeout(r, 60));
    return {
      totalReported: 12481,
      totalResolved: 9842,
      verificationRate: 78.4,
      averageResolutionDays: 3.2,
      activeInResolution: 1947,
      overdueCount: 284,
    };
  },

  async getResolutionTrends(): Promise<TrendDataPoint[]> {
    await new Promise((r) => setTimeout(r, 70));
    return [
      { month: 'Mar', reported: 1120, resolved: 890, verified: 720 },
      { month: 'Apr', reported: 1340, resolved: 1080, verified: 890 },
      { month: 'May', reported: 1480, resolved: 1210, verified: 980 },
      { month: 'Jun', reported: 1920, resolved: 1540, verified: 1230 },
      { month: 'Jul', reported: 2310, resolved: 1890, verified: 1510 },
      { month: 'Aug', reported: 2450, resolved: 1980, verified: 1620 },
      { month: 'Sep', reported: 1861, resolved: 1252, verified: 992 },
    ];
  },

  async getDepartmentMetrics(): Promise<DepartmentMetric[]> {
    await new Promise((r) => setTimeout(r, 80));
    return [
      {
        name: 'Municipal Road Maintenance & Civil Infrastructure',
        shortName: 'Road Maintenance',
        reported: 4120,
        resolved: 3290,
        overdue: 112,
        avgDays: 3.6,
        slaRate: 88.4,
      },
      {
        name: 'Solid Waste Management & Public Health Department',
        shortName: 'Solid Waste',
        reported: 3410,
        resolved: 2980,
        overdue: 48,
        avgDays: 1.8,
        slaRate: 94.2,
      },
      {
        name: 'Water Supply & Sewerage Undertaking',
        shortName: 'Water Supply',
        reported: 2180,
        resolved: 1740,
        overdue: 62,
        avgDays: 2.9,
        slaRate: 89.1,
      },
      {
        name: 'Electrical & Street Lighting Department',
        shortName: 'Street Lighting',
        reported: 1620,
        resolved: 1410,
        overdue: 24,
        avgDays: 2.1,
        slaRate: 95.8,
      },
      {
        name: 'Garden & Public Parks Department',
        shortName: 'Parks & Greenery',
        reported: 610,
        resolved: 490,
        overdue: 18,
        avgDays: 4.8,
        slaRate: 84.6,
      },
      {
        name: 'Public Health & Primary Care Directorate',
        shortName: 'Public Health',
        reported: 541,
        resolved: 480,
        overdue: 20,
        avgDays: 2.4,
        slaRate: 91.5,
      },
    ];
  },

  async getCategoryDistribution(): Promise<CategoryDistribution[]> {
    await new Promise((r) => setTimeout(r, 60));
    return [
      { name: 'Roads & Infrastructure', count: 4120, color: '#2563eb' },
      { name: 'Solid Waste & Sanitation', count: 3410, color: '#059669' },
      { name: 'Water & Drainage', count: 2180, color: '#0284c7' },
      { name: 'Street Lighting & Safety', count: 1620, color: '#d97706' },
      { name: 'Public Transport & Traffic', count: 620, color: '#7c3aed' },
      { name: 'Parks & Environment', count: 610, color: '#16a34a' },
      { name: 'Healthcare & Primary Care', count: 541, color: '#e11d48' },
      { name: 'Others', count: 380, color: '#64748b' },
    ];
  },

  async getCategoryBreakdown(): Promise<CategoryDistribution[]> {
    return this.getCategoryDistribution();
  },

  async getDepartmentPerformance(): Promise<DepartmentMetric[]> {
    return this.getDepartmentMetrics();
  },

  async getWardMetrics(): Promise<WardMetric[]> {
    await new Promise((r) => setTimeout(r, 70));
    return [
      { ward: 'Ward 14 (Shivajinagar)', activeCount: 142, resolvedCount: 890, avgTimeDays: 2.8 },
      { ward: 'Ward 12 (Central Market)', activeCount: 210, resolvedCount: 940, avgTimeDays: 3.4 },
      { ward: 'Ward 08 (Kothrud)', activeCount: 98, resolvedCount: 780, avgTimeDays: 2.5 },
      { ward: 'Ward 21 (Swargate)', activeCount: 164, resolvedCount: 820, avgTimeDays: 3.1 },
      { ward: 'Ward 15 (Tilak Road)', activeCount: 115, resolvedCount: 710, avgTimeDays: 2.9 },
      { ward: 'Ward 03 (Aundh)', activeCount: 84, resolvedCount: 650, avgTimeDays: 2.2 },
    ];
  },
};
