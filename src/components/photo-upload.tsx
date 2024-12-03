"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function PhotoUpload() {
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Photo Uploaded",
      description: "The photo has been uploaded successfully.",
    });
    setDescription("");
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Photo Documentation</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon">
              <Camera className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Take a photo or upload from gallery
            </p>
          </div>
        </div>

        <Textarea
          placeholder="Add description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button className="w-full" onClick={handleUpload}>
          Upload Photo
        </Button>
      </div>
    </Card>
  );
}