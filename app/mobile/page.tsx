"use client";

import { QRScanner } from "@/components/qr-scanner";
import { PhotoUpload } from "@/components/photo-upload";
import { Smartphone } from "lucide-react";

export default function MobilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Mobile Features</h1>
          <p className="text-muted-foreground">
            <Smartphone className="mr-2 inline-block h-4 w-4" />
            Access mobile-optimized tools and features
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <QRScanner />
        <PhotoUpload />
      </div>
    </div>
  );
}