"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
} from "@/components/ui";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

type TabType = "feasibility" | "revenue";

const categoryOptions = [
  { value: "Budget", label: "Budget" },
  { value: "Mid-Segment", label: "Mid-Segment" },
  { value: "Premium", label: "Premium" },
  { value: "Ultra-Premium", label: "Ultra-Premium" },
];

interface FeasibilityResult {
  landSize: number;
  potentialBuiltUp: number;
  computedValue: number;
  category: string;
}

interface RevenueResult {
  noofStudents: number;
  potentialBuiltUp: number | null;
  realisedRevenuePotential: number;
  annualRevenue: number;
  monthlyRevenue: number;
}

export default function CalculatorPage() {
  const searchParams = useSearchParams();
  const defaultTab = (searchParams.get("tab") as TabType) || "feasibility";

  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);

  // Feasibility state
  const [landSize, setLandSize] = useState("");
  const [category, setCategory] = useState("Mid-Segment");
  const [feasibilityResult, setFeasibilityResult] =
    useState<FeasibilityResult | null>(null);

  // Revenue state
  const [noofStudents, setNoofStudents] = useState("");
  const [revenueResult, setRevenueResult] = useState<RevenueResult | null>(
    null
  );

  const handleFeasibilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!landSize) {
      toast.error("Please enter land size");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/calculator/feasibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landSize: parseFloat(landSize),
          category,
        }),
      });

      const data = await response.json();
      if (data.status) {
        setFeasibilityResult(data.result);
        toast.success("Calculation completed!");
      } else {
        toast.error(data.message || "Calculation failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noofStudents) {
      toast.error("Please enter number of students");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/calculator/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noofStudents: parseFloat(noofStudents),
        }),
      });

      const data = await response.json();
      if (data.status) {
        setRevenueResult(data.result);
        toast.success("Calculation completed!");
      } else {
        toast.error(data.message || "Calculation failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-color3">
          Investment Calculators
        </h1>
        <p className="text-gray-600 mt-2">
          Calculate feasibility and revenue potential for school investments.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("feasibility")}
          className={cn(
            "px-6 py-3 rounded-lg font-semibold transition-colors",
            activeTab === "feasibility"
              ? "bg-color1 text-color3"
              : "bg-white text-gray-600 hover:bg-gray-100"
          )}
        >
          Feasibility Calculator
        </button>
        <button
          onClick={() => setActiveTab("revenue")}
          className={cn(
            "px-6 py-3 rounded-lg font-semibold transition-colors",
            activeTab === "revenue"
              ? "bg-color1 text-color3"
              : "bg-white text-gray-600 hover:bg-gray-100"
          )}
        >
          Revenue Calculator
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "feasibility"
                ? "Feasibility Calculator"
                : "Revenue Calculator"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeTab === "feasibility" ? (
              <form onSubmit={handleFeasibilitySubmit} className="space-y-6">
                <Input
                  label="Land Size (sq ft)"
                  type="number"
                  placeholder="Enter land size in square feet"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  required
                />
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Calculate Feasibility
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRevenueSubmit} className="space-y-6">
                <Input
                  label="Number of Students"
                  type="number"
                  placeholder="Enter expected student capacity"
                  value={noofStudents}
                  onChange={(e) => setNoofStudents(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Calculate Revenue
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {activeTab === "feasibility" && feasibilityResult ? (
              <div className="space-y-6">
                <ResultItem
                  label="Land Size"
                  value={`${formatNumber(feasibilityResult.landSize)} sq ft`}
                />
                <ResultItem
                  label="Category"
                  value={feasibilityResult.category}
                />
                <ResultItem
                  label="Potential Built-Up Area"
                  value={`${formatNumber(
                    feasibilityResult.potentialBuiltUp
                  )} sq ft`}
                  highlight
                />
                <ResultItem
                  label="Computed Investment Value"
                  value={formatCurrency(feasibilityResult.computedValue)}
                  highlight
                  large
                />
              </div>
            ) : activeTab === "revenue" && revenueResult ? (
              <div className="space-y-6">
                <ResultItem
                  label="Student Capacity"
                  value={formatNumber(revenueResult.noofStudents)}
                />
                <ResultItem
                  label="Monthly Revenue"
                  value={formatCurrency(revenueResult.monthlyRevenue)}
                />
                <ResultItem
                  label="Annual Revenue"
                  value={formatCurrency(revenueResult.annualRevenue)}
                  highlight
                />
                <ResultItem
                  label="5-Year Revenue Potential"
                  value={formatCurrency(revenueResult.realisedRevenuePotential)}
                  highlight
                  large
                />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Enter values and calculate to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResultItem({
  label,
  value,
  highlight = false,
  large = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg",
        highlight ? "bg-color1/10" : "bg-gray-50"
      )}
    >
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p
        className={cn("font-bold text-color3", large ? "text-2xl" : "text-lg")}
      >
        {value}
      </p>
    </div>
  );
}
