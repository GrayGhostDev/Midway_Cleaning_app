"use client";

import { ServiceCustomization } from "@/components/portal/service-customization";

export default function ServiceCustomizationPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Customize Services</h1>
        <p className="text-muted-foreground">
          Personalize your cleaning services and preferences
        </p>
      </div>
      <ServiceCustomization />
    </div>
  );
}