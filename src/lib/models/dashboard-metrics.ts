export interface DashboardMetrics {
  activeTasks: number;
  employeesOnDuty: number;
  completedToday: number;
  customerRating: number;
  trends: {
    tasks: string;
    employees: string;
    completion: string;
    rating: string;
  };
}
