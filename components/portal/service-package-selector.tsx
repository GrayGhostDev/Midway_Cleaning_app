"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const packages = [
  {
    id: 1,
    name: "Basic Package",
    description: "Essential cleaning services for small spaces",
    price: {
      monthly: 299,
      annually: 3299,
    },
    features: [
      "Weekly Regular Cleaning",
      "Monthly Deep Cleaning",
      "Basic Supplies Included",
      "Email Support",
    ],
    popular: false,
  },
  {
    id: 2,
    name: "Professional Package",
    description: "Comprehensive cleaning solution for businesses",
    price: {
      monthly: 599,
      annually: 6599,
    },
    features: [
      "2x Weekly Regular Cleaning",
      "Bi-weekly Deep Cleaning",
      "All Supplies Included",
      "24/7 Priority Support",
      "Window Cleaning",
      "Floor Maintenance",
    ],
    popular: true,
  },
  {
    id: 3,
    name: "Enterprise Package",
    description: "Custom cleaning solutions for large facilities",
    price: {
      monthly: 999,
      annually: 10999,
    },
    features: [
      "Daily Regular Cleaning",
      "Weekly Deep Cleaning",
      "Premium Supplies Included",
      "Dedicated Account Manager",
      "Custom Schedule",
      "Emergency Services",
    ],
    popular: false,
  },
];

export function ServicePackageSelector() {
  const { toast } = useToast();

  const handleSelect = (packageId: number) => {
    toast({
      title: "Package Selected",
      description: "You will be contacted shortly to finalize the subscription.",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {packages.map((pkg) => (
        <Card key={pkg.id} className="relative p-6">
          {pkg.popular && (
            <Badge className="absolute -top-2 right-4">Most Popular</Badge>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-xl">{pkg.name}</h3>
              <p className="text-sm text-muted-foreground">{pkg.description}</p>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-bold">
                ${pkg.price.monthly}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                ${pkg.price.annually} billed annually
              </p>
            </div>

            <div className="space-y-2">
              {pkg.features.map((feature) => (
                <div key={feature} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              onClick={() => handleSelect(pkg.id)}
              variant={pkg.popular ? "default" : "outline"}
            >
              <Package className="mr-2 h-4 w-4" />
              Select Package
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}