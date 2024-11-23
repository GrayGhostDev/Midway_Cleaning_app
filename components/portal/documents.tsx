"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  MoreVertical,
  Calendar,
  FileIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const documents = [
  {
    id: 1,
    name: "Service Agreement",
    type: "PDF",
    date: "2024-03-01",
    size: "245 KB",
    category: "Contract",
  },
  {
    id: 2,
    name: "March 2024 Invoice",
    type: "PDF",
    date: "2024-03-15",
    size: "156 KB",
    category: "Invoice",
  },
  {
    id: 3,
    name: "Cleaning Checklist",
    type: "PDF",
    date: "2024-03-10",
    size: "128 KB",
    category: "Report",
  },
  {
    id: 4,
    name: "Quality Inspection Report",
    type: "PDF",
    date: "2024-03-12",
    size: "198 KB",
    category: "Report",
  },
];

export function Documents() {
  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-muted rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{doc.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {doc.category} • {doc.type} • {doc.size}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Preview</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Last updated on {doc.date}
          </div>
        </Card>
      ))}
    </div>
  );
}