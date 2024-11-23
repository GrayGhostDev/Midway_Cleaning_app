import { fetchAPI } from './api';

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  enrolled: number;
  completion: number;
  status: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CreateCourseDTO {
  title: string;
  description: string;
  level: Course['level'];
  duration: string;
  maxEnrollment: number;
  prerequisites?: string;
}

export interface EmployeeProgress {
  employeeId: number;
  coursesCompleted: number;
  totalCourses: number;
  currentCourse: string;
  progress: number;
  hoursCompleted: number;
  certificates: number;
}

export class TrainingService {
  static async getCourses(): Promise<Course[]> {
    return fetchAPI<Course[]>('/courses');
  }

  static async createCourse(data: CreateCourseDTO): Promise<Course> {
    return fetchAPI<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getEmployeeProgress(employeeId: number): Promise<EmployeeProgress> {
    return fetchAPI<EmployeeProgress>(`/training/progress/${employeeId}`);
  }

  static async enrollEmployee(courseId: number, employeeId: number): Promise<void> {
    return fetchAPI<void>('/training/enroll', {
      method: 'POST',
      body: JSON.stringify({ courseId, employeeId }),
    });
  }

  static async updateProgress(
    courseId: number,
    employeeId: number,
    progress: number
  ): Promise<void> {
    return fetchAPI<void>('/training/progress', {
      method: 'PUT',
      body: JSON.stringify({ courseId, employeeId, progress }),
    });
  }
}