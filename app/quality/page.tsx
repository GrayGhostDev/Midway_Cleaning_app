"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardCheck, Plus, Filter } from "lucide-react";
import { InspectionList } from "../../components/quality/inspection-list";
import { AddInspectionDialog } from "../../components/quality/add-inspection-dialog";
import { QualityMetrics } from "@/components/quality/quality-metrics";

export default function QualityPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Quality Control</h1>
          <p className="text-muted-foreground">
            <ClipboardCheck className="mr-2 inline-block h-4 w-4" />
            Manage inspections and quality standards
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Inspection
        </Button>
      </div>

      <QualityMetrics />
      
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search inspections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <InspectionList searchQuery={search} />
      <AddInspectionDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}