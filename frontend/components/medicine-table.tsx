"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MedicineItem } from "@/lib/mock-data";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock,
} from "lucide-react";
import { useState } from "react";

interface MedicineTableProps {
  medicines: MedicineItem[];
  onViewPharmacies: (medicineId: string) => void;
  onRequestLetter: (medicineId: string) => void;
}

export function MedicineTable({
  medicines,
  onViewPharmacies,
  onRequestLetter,
}: MedicineTableProps) {
  const [sortBy, setSortBy] = useState<"overprice" | "name">("overprice");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterFlagged, setFilterFlagged] = useState(false);

  const sorted = [...medicines]
    .filter((m) => (filterFlagged ? m.isFlagged : true))
    .sort((a, b) => {
      if (sortBy === "overprice") {
        return sortDir === "desc"
          ? b.overpricePercentage - a.overpricePercentage
          : a.overpricePercentage - b.overpricePercentage;
      }
      return sortDir === "desc"
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    });

  // --- SEPARATE INTO TWO CATEGORIES ---
  const groups = [
    {
      title: "Prescribed Medicines",
      data: sorted.filter(
        (m) =>
          m.category.toLowerCase() === "medicine" ||
          m.category.toLowerCase() === "otc" ||
          m.isControlled
      ),
    },
    {
      title: "Hospital Services & Fees",
      data: sorted.filter(
        (m) =>
          m.category.toLowerCase() !== "medicine" &&
          m.category.toLowerCase() !== "otc" &&
          !m.isControlled
      ),
    },
  ].filter((group) => group.data.length > 0); // Only show groups that have items

  const toggleSort = (col: "overprice" | "name") => {
    if (sortBy === col) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: "overprice" | "name" }) => {
    if (sortBy !== col) return null;
    return sortDir === "desc" ? (
      <ChevronDown className="ml-1 inline h-3 w-3" />
    ) : (
      <ChevronUp className="ml-1 inline h-3 w-3" />
    );
  };

  const formatMoney = (amount: number) =>
    amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="mb-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold text-foreground">
          Bill Breakdown
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant={filterFlagged ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterFlagged(!filterFlagged)}
            className="gap-1.5"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {filterFlagged ? "Showing Flagged Only" : "Show Flagged Only"}
          </Button>
        </div>
      </div>

      {/* Render each group separately */}
      {groups.map((group, idx) => (
        <div key={idx} className="mb-8">
          <h4 className="mb-3 border-b pb-2 text-lg font-semibold text-foreground">
            {group.title}
          </h4>

          {/* --- DESKTOP TABLE --- */}
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block mb-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSort("name")}
                  >
                    Item Description
                    <SortIcon col="name" />
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Hospital Price</TableHead>
                  <TableHead className="text-right">Fair Price</TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => toggleSort("overprice")}
                  >
                    Markup
                    <SortIcon col="overprice" />
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.data.map((med) => (
                  <TableRow
                    key={med.id}
                    // STRONGER COLOR FOR FLAGGED ROW
                    className={med.isFlagged ? "bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {med.isFlagged && (
                          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-destructive" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{med.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {med.genericName}
                          </p>
                        </div>
                        {med.isControlled && (
                          <Badge
                            variant="outline"
                            className="ml-1 gap-1 border-warning/30 bg-warning/10 text-warning"
                          >
                            <Lock className="h-3 w-3" />
                            Controlled
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {med.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {med.quantity} {med.unit}
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {formatMoney(med.hospitalPrice)}
                    </TableCell>
                    <TableCell className="text-right text-primary">
                      {formatMoney(med.governmentPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-semibold ${
                          med.overpricePercentage > 100
                            ? "text-destructive"
                            : med.overpricePercentage > 0
                              ? "text-warning"
                              : "text-muted-foreground"
                        }`}
                      >
                        {med.overpricePercentage > 0 ? "+" : ""}
                        {med.overpricePercentage}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {med.isFlagged && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs text-primary hover:text-primary"
                            onClick={() => onViewPharmacies(med.id)}
                          >
                            <ExternalLink className="h-3 w-3" />
                            Pharmacies
                          </Button>
                        )}
                        {med.isControlled && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs text-warning hover:text-warning"
                            onClick={() => onRequestLetter(med.id)}
                          >
                            <Lock className="h-3 w-3" />
                            Request Letter
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* --- MOBILE CARDS --- */}
          <div className="flex flex-col gap-3 md:hidden mb-4">
            {group.data.map((med) => (
              <div
                key={med.id}
                // STRONGER COLOR FOR FLAGGED BOX
                className={`rounded-xl border p-4 ${
                  med.isFlagged
                    ? "border-red-300 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
                    : "border-border bg-card"
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {med.isFlagged && (
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{med.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {med.genericName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {med.isControlled && (
                      <Badge
                        variant="outline"
                        className="gap-1 border-warning/30 bg-warning/10 text-warning"
                      >
                        <Lock className="h-3 w-3" />
                        Controlled
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {med.category}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Hospital</p>
                    <p className="font-medium text-foreground">
                      {formatMoney(med.hospitalPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fair Price</p>
                    <p className="font-medium text-primary">
                      {formatMoney(med.governmentPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Markup</p>
                    <p
                      className={`font-semibold ${
                        med.overpricePercentage > 100
                          ? "text-destructive"
                          : med.overpricePercentage > 0
                            ? "text-warning"
                            : "text-muted-foreground"
                      }`}
                    >
                      {med.overpricePercentage > 0 ? "+" : ""}
                      {med.overpricePercentage}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {med.isFlagged && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex-1 gap-1 bg-white dark:bg-transparent text-xs border-red-200 hover:bg-red-100 dark:border-red-900 dark:hover:bg-red-900/50"
                      onClick={() => onViewPharmacies(med.id)}
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Pharmacies
                    </Button>
                  )}
                  {med.isControlled && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex-1 gap-1 border-warning/30 bg-white dark:bg-transparent text-xs text-warning hover:text-warning hover:bg-warning/10"
                      onClick={() => onRequestLetter(med.id)}
                    >
                      <Lock className="h-3 w-3" />
                      Request Letter
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}