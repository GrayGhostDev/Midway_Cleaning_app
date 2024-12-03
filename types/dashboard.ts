export interface DashboardStats {
  totalRevenue: number;
  pendingTasks: number;
  activeCleaners: number;
  trends: {
    revenue: number;
    tasks: number;
    cleaners: number;
  };
}

export interface RevenueData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

export interface TasksResponse {
  tasks: {
    id: string;
    title: string;
    cleaner: {
      name: string | null;
    } | null;
    status: string;
    priority: string;
    dueDate: string | null;
    booking: {
      service: {
        name: string;
      };
    } | null;
  }[];
  totalPages: number;
}
