export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
}

export interface DashboardStats {
  metrics: DashboardMetric[];
  recentBookings: Booking[];
  chartData: ChartData;
}

export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RevenueData {
  total: number;
  change: number;
  data: {
    date: string;
    amount: number;
  }[];
}

export interface TasksResponse {
  tasks: {
    id: string;
    title: string;
    status: string;
    assignee?: string;
    dueDate?: string;
  }[];
  total: number;
  page: number;
  pageSize: number;
}