// Feasibility calculation constants
export const FEASIBILITY_CATEGORIES = {
  BUDGET: "Budget",
  MID_SEGMENT: "Mid-Segment",
  PREMIUM: "Premium",
  ULTRA_PREMIUM: "Ultra-Premium",
} as const;

export type FeasibilityCategory =
  (typeof FEASIBILITY_CATEGORIES)[keyof typeof FEASIBILITY_CATEGORIES];

// Built-up area multipliers by category
const BUILT_UP_MULTIPLIERS: Record<FeasibilityCategory, number> = {
  [FEASIBILITY_CATEGORIES.BUDGET]: 0.35,
  [FEASIBILITY_CATEGORIES.MID_SEGMENT]: 0.4,
  [FEASIBILITY_CATEGORIES.PREMIUM]: 0.45,
  [FEASIBILITY_CATEGORIES.ULTRA_PREMIUM]: 0.5,
};

// Value per sq ft by category (in INR)
const VALUE_PER_SQFT: Record<FeasibilityCategory, number> = {
  [FEASIBILITY_CATEGORIES.BUDGET]: 1500,
  [FEASIBILITY_CATEGORIES.MID_SEGMENT]: 2500,
  [FEASIBILITY_CATEGORIES.PREMIUM]: 4000,
  [FEASIBILITY_CATEGORIES.ULTRA_PREMIUM]: 6000,
};

export interface FeasibilityResult {
  landSize: number;
  potentialBuiltUp: number;
  computedValue: number;
  category: FeasibilityCategory;
}

export function calculateFeasibility(
  landSize: number,
  category: FeasibilityCategory
): FeasibilityResult {
  // Convert land size to sq ft (assuming input is in sq ft)
  const multiplier =
    BUILT_UP_MULTIPLIERS[category] ||
    BUILT_UP_MULTIPLIERS[FEASIBILITY_CATEGORIES.MID_SEGMENT];
  const valuePerSqft =
    VALUE_PER_SQFT[category] ||
    VALUE_PER_SQFT[FEASIBILITY_CATEGORIES.MID_SEGMENT];

  const potentialBuiltUp = landSize * multiplier;
  const computedValue = potentialBuiltUp * valuePerSqft;

  return {
    landSize,
    potentialBuiltUp: Math.round(potentialBuiltUp * 100) / 100,
    computedValue: Math.round(computedValue * 100) / 100,
    category,
  };
}

// Revenue calculation constants
const REVENUE_PER_STUDENT_PER_YEAR = 60000; // INR
const OCCUPANCY_RATE = 0.85;

export interface RevenueResult {
  noofStudents: number;
  potentialBuiltUp: number | null;
  realisedRevenuePotential: number;
  annualRevenue: number;
  monthlyRevenue: number;
}

export function calculateRevenue(
  noofStudents: number,
  potentialBuiltUp?: number
): RevenueResult {
  const effectiveStudents = noofStudents * OCCUPANCY_RATE;
  const annualRevenue = effectiveStudents * REVENUE_PER_STUDENT_PER_YEAR;
  const monthlyRevenue = annualRevenue / 12;

  // Revenue potential is a 5-year projection
  const realisedRevenuePotential = annualRevenue * 5;

  return {
    noofStudents,
    potentialBuiltUp: potentialBuiltUp || null,
    realisedRevenuePotential: Math.round(realisedRevenuePotential * 100) / 100,
    annualRevenue: Math.round(annualRevenue * 100) / 100,
    monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
  };
}

// Validate category
export function isValidCategory(
  category: string
): category is FeasibilityCategory {
  return Object.values(FEASIBILITY_CATEGORIES).includes(
    category as FeasibilityCategory
  );
}
