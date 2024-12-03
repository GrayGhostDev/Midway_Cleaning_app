"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scan, Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function QRScanner() {
  const [code, setCode] = useState("");
  const { toast } = useToast();

  const handleScan = () => {
    if (code) {
      toast({
        title: "Check-in Successful",
        description: "Your attendance has been recorded.",
      });
      setCode("");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">QR Check-in/out</h3>
          <Button variant="outline" size="icon">
            <Scan className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Enter code manually..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="flex space-x-2">
            <Button className="w-full" onClick={handleScan}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Submit Code
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}