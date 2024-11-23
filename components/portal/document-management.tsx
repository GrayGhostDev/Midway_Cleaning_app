"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const documents = [
  {
    id: 1,
    name: "Service Agreement",
    type: "Contract",
    date: "2024-03-15",
    size: "245 KB",
  },
  {
    id: 2,
    name: "March Invoice",
    type: "Invoice",
    date: "2024-03-10",
    size: "156 KB",
  },
  {
    id: 3,
    name: "Cleaning Checklist",
    type: "Report",
    date: "2024-03-05",
    size: "128 KB",
  },
];

export function DocumentManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-x-2">
          <Input
            placeholder="Search documents..."
            className="max-w-sm"
            type="search"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex space-x-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Documents</SelectItem>
              <SelectItem value="contracts">Contracts</SelectItem>
              <SelectItem value="invoices">Invoices</SelectItem>
              <SelectItem value="reports">Reports</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{doc.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.date}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}