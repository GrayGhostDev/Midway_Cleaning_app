import { FeedbackService } from '../feedback.service';
import { fetchAPI } from '../api';

jest.mock('../api', () => ({
  fetchAPI: jest.fn(),
}));

const mockFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

describe('FeedbackService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitFeedback', () => {
    it('should submit customer feedback', async () => {
      const feedbackData = {
        clientId: 1,
        serviceId: 2,
        rating: 5,
        comment: 'Great service!',
        category: 'cleaning',
        assignedTo: 3,
      };
      const mockResponse = { id: 1, ...feedbackData, status: 'new', timestamp: '2024-02-01' };
      mockFetchAPI.mockResolvedValue(mockResponse);

      const result = await FeedbackService.submitFeedback(feedbackData);

      expect(mockFetchAPI).toHaveBeenCalledWith('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedbackData),
      });
      expect(result.status).toBe('new');
    });
  });

  describe('getFeedback', () => {
    it('should fetch feedback without filters', async () => {
      const mockFeedback = [{ id: 1, rating: 5, status: 'new' }];
      mockFetchAPI.mockResolvedValue(mockFeedback);

      const result = await FeedbackService.getFeedback();

      expect(mockFetchAPI).toHaveBeenCalledWith(expect.stringContaining('/feedback'));
      expect(result).toEqual(mockFeedback);
    });

    it('should fetch feedback with filters', async () => {
      mockFetchAPI.mockResolvedValue([]);

      await FeedbackService.getFeedback({ status: 'reviewed', category: 'cleaning' });

      expect(mockFetchAPI).toHaveBeenCalledWith(
        expect.stringContaining('status=reviewed')
      );
    });
  });

  describe('respondToFeedback', () => {
    it('should respond to feedback', async () => {
      const response = { message: 'Thank you for your feedback!', respondedBy: 1 };
      const mockResult = { id: 1, status: 'addressed', response: { ...response, timestamp: '2024-02-02' } };
      mockFetchAPI.mockResolvedValue(mockResult);

      const result = await FeedbackService.respondToFeedback(1, response);

      expect(mockFetchAPI).toHaveBeenCalledWith('/feedback/1/respond', {
        method: 'POST',
        body: JSON.stringify(response),
      });
      expect(result.status).toBe('addressed');
    });
  });

  describe('createSurvey', () => {
    it('should create a satisfaction survey', async () => {
      const surveyData = {
        template: {
          questions: [
            { id: 'q1', type: 'rating' as const, text: 'Rate our service' },
            { id: 'q2', type: 'text' as const, text: 'Any comments?' },
          ],
          targetAudience: 'all' as const,
          frequency: 'after-service' as const,
        },
      };
      const mockResponse = { id: 1, ...surveyData, responses: [] };
      mockFetchAPI.mockResolvedValue(mockResponse);

      const result = await FeedbackService.createSurvey(surveyData);

      expect(mockFetchAPI).toHaveBeenCalledWith('/feedback/surveys', {
        method: 'POST',
        body: JSON.stringify(surveyData),
      });
      expect(result.responses).toEqual([]);
    });
  });

  describe('getSurveyResponses', () => {
    it('should fetch survey responses', async () => {
      const mockResponses = [
        { clientId: 1, answers: { q1: 5, q2: 'Excellent!' }, timestamp: '2024-02-01' },
      ];
      mockFetchAPI.mockResolvedValue(mockResponses);

      const result = await FeedbackService.getSurveyResponses(1);

      expect(mockFetchAPI).toHaveBeenCalledWith('/feedback/surveys/1/responses');
      expect(result).toEqual(mockResponses);
    });
  });

  describe('generateFeedbackReport', () => {
    it('should generate a feedback report', async () => {
      const params = {
        type: 'summary' as const,
        period: 'monthly' as const,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      const mockReport = {
        metrics: { averageRating: 4.5, responseRate: 0.75, categoryBreakdown: { cleaning: 10 } },
        trends: [{ date: '2024-01-15', rating: 4.5, count: 10 }],
      };
      mockFetchAPI.mockResolvedValue(mockReport);

      const result = await FeedbackService.generateFeedbackReport(params);

      expect(mockFetchAPI).toHaveBeenCalledWith('/feedback/reports', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      expect(result.metrics.averageRating).toBe(4.5);
    });
  });
});
