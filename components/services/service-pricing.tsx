"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PricingConfig {
  rate: number;
  rateUnit: 'hour' | 'visit' | 'sqft';
  minimumCharge?: number;
  discounts?: {
    enabled: boolean;
    value: number;
    type: 'percentage' | 'fixed';
  };
}

interface ServicePricingProps {
  pricing: PricingConfig;
  onUpdate: (pricing: PricingConfig) => void;
}

export function ServicePricing({ pricing, onUpdate }: ServicePricingProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Rate</Label>
            <Input
              type="number"
              value={pricing.rate}
              onChange={(e) =>
                onUpdate({ ...pricing, rate: parseFloat(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Rate Unit</Label>
            <Select
              value={pricing.rateUnit}
              onValueChange={(value: 'hour' | 'visit' | 'sqft') =>
                onUpdate({ ...pricing, rateUnit: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Per Hour</SelectItem>
                <SelectItem value="visit">Per Visit</SelectItem>
                <SelectItem value="sqft">Per Sq.Ft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Minimum Charge</Label>
          <Input
            type="number"
            value={pricing.minimumCharge || ""}
            onChange={(e) =>
              onUpdate({
                ...pricing,
                minimumCharge: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enable Discounts</Label>
            <Switch
              checked={pricing.discounts?.enabled ?? false}
              onCheckedChange={(checked) =>
                onUpdate({
                  ...pricing,
                  discounts: checked
                    ? {
                        enabled: true,
                        value: 0,
                        type: 'percentage',
                      }
                    : undefined,
                })
              }
            />
          </div>

          {pricing.discounts?.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  value={pricing.discounts.value}
                  onChange={(e) => {
                    if (pricing.discounts) {
                      onUpdate({
                        ...pricing,
                        discounts: {
                          enabled: true,
                          value: parseFloat(e.target.value),
                          type: pricing.discounts.type,
                        },
                      });
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={pricing.discounts.type}
                  onValueChange={(value: 'percentage' | 'fixed') => {
                    if (pricing.discounts) {
                      onUpdate({
                        ...pricing,
                        discounts: {
                          enabled: true,
                          value: pricing.discounts.value,
                          type: value,
                        },
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}