import { fetchAPI } from './api';

export interface Feedback {
  id: number;
  clientId: number;
  serviceId: number;
  rating: number;
  comment: string;
  category: string;
  status: 'new' | 'reviewed' | 'addressed';
  timestamp: string;
  assignedTo?: number;
  response?: {
    message: string;
    respondedBy: number;
    timestamp: string;
  };
}

export interface SatisfactionSurvey {
  id: number;
  template: {
    questions: Array<{
      id: string;
      type: 'rating' | 'text' | 'choice';
      text: string;
      options?: string[];
    }>;
    targetAudience: 'all' | 'specific';
    frequency: 'after-service' | 'monthly' | 'quarterly';
  };
  responses: Array<{
    clientId: number;
    answers: Record<string, any>;
    timestamp: string;
  }>;
}

export class FeedbackService {
  static async submitFeedback(feedback: Omit<Feedback, 'id' | 'timestamp' | 'status'>): Promise<Feedback> {
    return fetchAPI<Feedback>('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  static async getFeedback(params?: {
    status?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Feedback[]> {
    const queryParams = new URLSearchParams(params as Record<string, any>);
    return fetchAPI<Feedback[]>(`/feedback?${queryParams}`);
  }

  static async respondToFeedback(
    id: number,
    response: { message: string; respondedBy: number }
  ): Promise<Feedback> {
    return fetchAPI<Feedback>(`/feedback/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify(response),
    });
  }

  static async createSurvey(survey: Omit<SatisfactionSurvey, 'id' | 'responses'>): Promise<SatisfactionSurvey> {
    return fetchAPI<SatisfactionSurvey>('/feedback/surveys', {
      method: 'POST',
      body: JSON.stringify(survey),
    });
  }

  static async getSurveyResponses(surveyId: number): Promise<SatisfactionSurvey['responses']> {
    return fetchAPI<SatisfactionSurvey['responses']>(`/feedback/surveys/${surveyId}/responses`);
  }

  static async generateFeedbackReport(params: {
    type: 'summary' | 'detailed';
    period: 'daily' | 'weekly' | 'monthly';
    startDate: string;
    endDate: string;
  }): Promise<{
    metrics: {
      averageRating: number;
      responseRate: number;
      categoryBreakdown: Record<string, number>;
    };
    trends: Array<{
      date: string;
      rating: number;
      count: number;
    }>;
  }> {
    return fetchAPI('/feedback/reports', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}