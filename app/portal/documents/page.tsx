"use client";

import { DocumentManagement } from "@/components/portal/document-management";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          Access and manage your service-related documents
        </p>
      </div>
      <DocumentManagement />
    </div>
  );
}