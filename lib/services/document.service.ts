import { fetchAPI } from './api';

export interface Document {
  id: number;
  title: string;
  type: 'policy' | 'procedure' | 'form' | 'report';
  category: string;
  content: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  metadata: {
    author: string;
    createdAt: string;
    lastModified: string;
    approvedBy?: string;
    approvedAt?: string;
    tags: string[];
  };
  permissions: {
    roles: string[];
    users: number[];
  };
}

export interface DocumentTemplate {
  id: number;
  name: string;
  type: string;
  content: string;
  variables: string[];
  defaultValues: Record<string, any>;
}

export class DocumentService {
  static async getDocuments(params?: {
    type?: string;
    category?: string;
    status?: string;
  }): Promise<Document[]> {
    const queryParams = new URLSearchParams(params as Record<string, any>);
    return fetchAPI<Document[]>(`/documents?${queryParams}`);
  }

  static async createDocument(doc: Omit<Document, 'id'>): Promise<Document> {
    return fetchAPI<Document>('/documents', {
      method: 'POST',
      body: JSON.stringify(doc),
    });
  }

  static async getTemplates(): Promise<DocumentTemplate[]> {
    return fetchAPI<DocumentTemplate[]>('/documents/templates');
  }

  static async generateDocument(
    templateId: number,
    data: Record<string, any>
  ): Promise<{ documentId: number; url: string }> {
    return fetchAPI('/documents/generate', {
      method: 'POST',
      body: JSON.stringify({ templateId, data }),
    });
  }

  static async archiveDocument(id: number): Promise<void> {
    return fetchAPI(`/documents/${id}/archive`, {
      method: 'PUT',
    });
  }

  static async searchDocuments(query: string): Promise<Document[]> {
    return fetchAPI<Document[]>(`/documents/search?q=${encodeURIComponent(query)}`);
  }
}