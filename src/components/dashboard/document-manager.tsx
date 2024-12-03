'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileIcon, FolderIcon, Share2Icon, Trash2Icon, DownloadIcon, EyeIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  sharedWith: string[];
  url: string;
}

export function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setDocuments(prev => [...prev, data]);
      
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleShare = async () => {
    if (!selectedDoc || !shareEmail) return;

    try {
      const response = await fetch('/api/documents/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: selectedDoc.id,
          email: shareEmail,
        }),
      });

      if (!response.ok) throw new Error('Share failed');

      toast({
        title: 'Success',
        description: 'Document shared successfully',
      });

      setShareEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share document',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All Documents</TabsTrigger>
        <TabsTrigger value="shared">Shared with Me</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <Input
            type="file"
            onChange={handleFileUpload}
            className="max-w-xs"
            disabled={isUploading}
          />
          <Button disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>

        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="flex items-center p-4">
              <FileIcon className="h-8 w-8 text-blue-500 mr-4" />
              <div className="flex-1">
                <h4 className="font-medium">{doc.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedDoc(doc)}>
                      <Share2Icon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share Document</DialogTitle>
                      <DialogDescription>
                        Share this document with other users
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          value={shareEmail}
                          onChange={(e) => setShareEmail(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleShare} className="w-full">
                        Share
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="ghost" size="icon" asChild>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <EyeIcon className="h-4 w-4" />
                  </a>
                </Button>

                <Button variant="ghost" size="icon" asChild>
                  <a href={doc.url} download>
                    <DownloadIcon className="h-4 w-4" />
                  </a>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(doc.id)}
                >
                  <Trash2Icon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}

          {documents.length === 0 && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <FolderIcon className="mx-auto h-12 w-12 opacity-50 mb-2" />
                  <p>No documents uploaded yet</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="shared" className="space-y-4">
        {/* Shared documents will be implemented here */}
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <FolderIcon className="mx-auto h-12 w-12 opacity-50 mb-2" />
              <p>No documents shared with you</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
