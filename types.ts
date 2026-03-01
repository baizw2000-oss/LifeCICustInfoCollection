import { z } from 'zod';

// --- Section 1: Life Insured ---
export const LifeInsuredSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Full address is required"),
  isCanadianCitizen: z.enum(["yes", "no"]),
  isImmigrant: z.enum(["yes", "no"]),
  landingDate: z.string().optional(), // Required if isImmigrant is yes
  employerName: z.string().min(2, "Employer name is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  employerAddress: z.string().min(5, "Company address is required"),
}).refine((data) => {
  if (data.isImmigrant === 'yes' && !data.landingDate) {
    return false;
  }
  return true;
}, {
  message: "Landing date is required for immigrants",
  path: ["landingDate"],
});

// --- Section 2: Owner ---
export const OwnerSchema = z.object({
  relationToInsured: z.string().min(2, "Relationship is required"),
  fullName: z.string().min(2, "Owner Name is required"),
  dob: z.string().min(1, "Owner DOB is required"),
  sin: z.string().min(9, "SIN is required"),
  phone: z.string().min(5, "Owner Phone is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Owner Address is required"),
  employerName: z.string().optional(),
  employerAddress: z.string().optional(),
  occupation: z.string().optional(),
  // File placeholder (logic handled separately)
  driversLicenseNumber: z.string().min(1, "License number required"),
  driversLicenseExpiry: z.string().min(1, "Expiry date required"),
});

// --- Section 3: Beneficiary & Financials ---
export const BeneficiarySchema = z.object({
  name: z.string().min(1, "Name required"),
  percentage: z.number().min(1).max(100),
  isMinor: z.boolean(),
  trusteeName: z.string().optional(),
});

export const FinancialSchema = z.object({
  annualIncome: z.number().min(0),
  otherIncome: z.number().optional(),
  totalAssets: z.number().min(0, "Assets required"),
  totalLiabilities: z.number().min(0, "Liabilities required"),
  netWorth: z.number(), // Calculated or entered
  beneficiaries: z.array(BeneficiarySchema).min(1, "At least one beneficiary is required"),
});

// --- Section 4: Medical & Existing Insurance ---
export const MedicalHistoryItemSchema = z.object({
  year: z.string().min(4, "Year required"),
  condition: z.string().min(2, "Condition required"),
  treatment: z.string().optional(),
});

export const OtherInsuranceSchema = z.object({
  company: z.string(),
  amount: z.number(),
  startYear: z.string(),
});

export const MedicalSchema = z.object({
  height: z.string().min(1, "Height required"),
  weight: z.string().min(1, "Weight required"),
  weightChange: z.string().optional(),
  doctorName: z.string().min(2, "Doctor name required"),
  doctorAddress: z.string().min(5, "Doctor address required"),
  lastConsultDate: z.string().min(1, "Date required"),
  lastConsultReason: z.string().min(2, "Reason required"),
  treatments: z.string().optional(),
  history: z.array(MedicalHistoryItemSchema).optional(),
  existingInsurance: z.array(OtherInsuranceSchema).optional(),
});

// --- Master Schema ---
export const ApplicationSchema = z.object({
  lifeInsured: LifeInsuredSchema,
  owner: OwnerSchema,
  financials: FinancialSchema,
  medical: MedicalSchema,
});

export type ApplicationData = z.infer<typeof ApplicationSchema>;
export type LifeInsuredData = z.infer<typeof LifeInsuredSchema>;
export type OwnerData = z.infer<typeof OwnerSchema>;
export type FinancialData = z.infer<typeof FinancialSchema>;
export type MedicalData = z.infer<typeof MedicalSchema>;

export enum AppStep {
  LIFE_INSURED = 0,
  OWNER = 1,
  FINANCIALS = 2,
  MEDICAL = 3,
  REVIEW = 4,
}