"use client";

import React from "react"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MedicineItem } from "@/lib/mock-data";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Lock,
  Send,
} from "lucide-react";
import { useState } from "react";

interface LetterRequestProps {
  medicine: MedicineItem;
  hospitalName: string;
  onBack: () => void;
}

export function LetterRequest({
  medicine,
  hospitalName,
  onBack,
}: LetterRequestProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    phone: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 gap-1"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to results
        </Button>

        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Letter Request Submitted
            </h3>
            <p className="mb-4 max-w-md text-sm text-muted-foreground">
              Your request for a controlled medicine purchase letter has been
              sent to {hospitalName}. You will be notified when it is ready
              for pickup.
            </p>
            <div className="rounded-lg border border-border bg-card p-4 text-left text-sm">
              <p className="mb-1">
                <span className="font-medium text-foreground">Medicine:</span>{" "}
                <span className="text-muted-foreground">{medicine.name}</span>
              </p>
              <p className="mb-1">
                <span className="font-medium text-foreground">Hospital:</span>{" "}
                <span className="text-muted-foreground">{hospitalName}</span>
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Reference:
                </span>{" "}
                <span className="text-muted-foreground">
                  LR-{Date.now().toString(36).toUpperCase()}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 gap-1"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to results
      </Button>

      <div className="mb-6 rounded-xl border border-warning/20 bg-warning/5 p-4">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning" />
          <div>
            <h3 className="font-semibold text-foreground">
              Controlled Medicine Letter
            </h3>
            <p className="text-sm text-muted-foreground">
              {medicine.name} ({medicine.genericName}) is a controlled
              substance. To purchase it from an external pharmacy, you need an
              official letter from {hospitalName}.
            </p>
          </div>
        </div>
      </div>

      <Card className="border-border">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                Request Letter from Hospital
              </h4>
              <p className="text-sm text-muted-foreground">
                Fill in your details to submit the request
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="patientName">Full Name</Label>
                <Input
                  id="patientName"
                  placeholder="Enter your full name"
                  value={formData.patientName}
                  onChange={(e) =>
                    setFormData({ ...formData, patientName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="patientId">Patient / National ID</Label>
                <Input
                  id="patientId"
                  placeholder="Enter your ID number"
                  value={formData.patientId}
                  onChange={(e) =>
                    setFormData({ ...formData, patientId: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional details for the hospital..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">
                Medicine requested:{" "}
                <span className="font-medium text-foreground">
                  {medicine.name}
                </span>{" "}
                &middot; {medicine.quantity} {medicine.unit}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Hospital:{" "}
                <span className="font-medium text-foreground">
                  {hospitalName}
                </span>
              </p>
              <Badge
                variant="outline"
                className="mt-2 gap-1 border-warning/30 bg-warning/10 text-warning"
              >
                <Lock className="h-3 w-3" />
                Controlled Substance
              </Badge>
            </div>

            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Submit Letter Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
