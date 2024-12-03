import { Metadata } from 'next';
import { DocumentManager } from '@/components/dashboard/document-manager';

export const metadata: Metadata = {
  title: 'Documents | Midway Cleaning',
  description: 'Manage and share your cleaning service documents',
};

export default function DocumentsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <p className="text-muted-foreground">
          Upload, manage, and share your cleaning service documents
        </p>
      </div>
      <DocumentManager />
    </div>
  );
}
