// ==============================================================================
// BUSINESS MANAGER — SOUTH AFRICAN SARS COMPLIANCE ENGINE
// MAGIC QUANT TRADING Corp | SARS eFiling Workpaper Generator
// ==============================================================================

import { db } from "@/lib/db/store";
import { formatZAR } from "@/lib/utils";

export interface VAT201Workpaper {
  period: string;
  organisationName: string;
  vatNumber: string;
  standardRatedSuppliesCents: number; // Block 1 / 1A
  outputVatCents: number;             // Block 4
  standardRatedPurchasesCents: number;// Block 14
  inputVatCents: number;              // Block 15
  netVatPayableCents: number;         // Output - Input (Positive = Pay SARS, Negative = Refund)
  validInvoicesCount: number;
  claimableExpensesCount: number;
  validationIssues: string[];
  submissionDeadline: string;
  efilingBoxMapping: Record<string, string>;
  legalDisclaimer: string;
}

export interface EMP201Workpaper {
  period: string;
  organisationName: string;
  payeCents: number;
  sdlCents: number;
  uifEmployeeCents: number;
  uifEmployerCents: number;
  totalLiabilityCents: number;
  employeeCount: number;
  submissionDeadline: string;
  legalDisclaimer: string;
}

export interface ProvisionalIRP6Workpaper {
  yearOfAssessment: string;
  periodNumber: 1 | 2;
  estimatedTaxableIncomeCents: number;
  taxRatePercent: number; // 27% Corporate Income Tax standard
  grossTaxLiabilityCents: number;
  lessPreviousPaymentsCents: number;
  netProvisionalDueCents: number;
  statutoryThresholdWarning?: string;
  submissionDeadline: string;
}

export class SARSComplianceEngine {
  /**
   * Generates a complete VAT201 Workpaper with Section 20(4) VAT Act validation
   */
  public generateVAT201Workpaper(orgId: string, period: string = "2026/09"): VAT201Workpaper {
    const org = db.getOrganisation(orgId);
    if (!org) throw new Error("Organisation not found.");

    const invoices = db.getInvoices(orgId);
    const expenses = db.getExpenses(orgId);

    const validationIssues: string[] = [];

    // Check company VAT registration
    if (!org.vat_number) {
      validationIssues.push("Organisation does not have a registered 10-digit SARS VAT Number in settings.");
    }

    // Output VAT
    let totalSalesCents = 0;
    let validInvoicesCount = 0;

    for (const inv of invoices) {
      if (!inv.invoice_number.startsWith("INV-")) {
        validationIssues.push(`Invoice ${inv.invoice_number} may not follow required sequential numbering.`);
      }
      totalSalesCents += inv.subtotal_cents;
      validInvoicesCount++;
    }

    const outputVatCents = Math.round(totalSalesCents * 0.15);

    // Input VAT
    let totalPurchasesCents = 0;
    let inputVatCents = 0;
    let claimableCount = 0;

    for (const exp of expenses) {
      if (exp.is_vat_claimable) {
        totalPurchasesCents += exp.amount_cents;
        inputVatCents += exp.tax_cents;
        claimableCount++;
      }
    }

    const netPayableCents = outputVatCents - inputVatCents;

    return {
      period,
      organisationName: org.legal_name || org.name,
      vatNumber: org.vat_number || "NOT_CONFIGURED",
      standardRatedSuppliesCents: totalSalesCents,
      outputVatCents,
      standardRatedPurchasesCents: totalPurchasesCents,
      inputVatCents,
      netVatPayableCents: netPayableCents,
      validInvoicesCount,
      claimableExpensesCount: claimableCount,
      validationIssues,
      submissionDeadline: "31 October 2026 (via SARS eFiling)",
      efilingBoxMapping: {
        "Block 1 (Standard rated turnover ex. VAT)": formatZAR(totalSalesCents),
        "Block 4 (Output VAT at 15%)": formatZAR(outputVatCents),
        "Block 14 (Capital & other goods/services)": formatZAR(totalPurchasesCents),
        "Block 15 (Input VAT deductible)": formatZAR(inputVatCents),
        "Block 20 (Net VAT payable to SARS)": formatZAR(Math.max(0, netPayableCents)),
        "Block 20A (Net VAT refundable)": netPayableCents < 0 ? formatZAR(Math.abs(netPayableCents)) : "R 0.00",
      },
      legalDisclaimer:
        "IMPORTANT NOTICE: This document provides administrative compilation assistance based on transaction entries recorded in Business Manager. It is designed to assist you or your registered tax practitioner in completing your VAT201 on SARS eFiling. It does not constitute formal tax advice or guarantee absence of SARS audit queries.",
    };
  }

  /**
   * Generates EMP201 Monthly Employer Declaration Workpaper (PAYE, SDL, UIF)
   */
  public generateEMP201Workpaper(orgId: string, period: string = "2026/10"): EMP201Workpaper {
    const org = db.getOrganisation(orgId);
    const employees = db.getEmployees(orgId);

    const totalGrossPayroll = employees.reduce((sum, e) => sum + e.salary_cents, 0);

    // Estimate statutory deductions
    // PAYE average bracket (~20% across employee pool for illustration)
    const payeCents = Math.round(totalGrossPayroll * 0.202);
    // SDL: 1% of total payroll (if annual payroll > R500k)
    const sdlCents = Math.round(totalGrossPayroll * 0.01);
    // UIF: 1% employee + 1% employer capped at R177.12 per employee
    const uifEmployeeCents = Math.min(Math.round(totalGrossPayroll * 0.01), employees.length * 17712);
    const uifEmployerCents = uifEmployeeCents;

    const totalLiabilityCents = payeCents + sdlCents + uifEmployeeCents + uifEmployerCents;

    return {
      period,
      organisationName: org?.legal_name || "Apex Solutions",
      payeCents,
      sdlCents,
      uifEmployeeCents,
      uifEmployerCents,
      totalLiabilityCents,
      employeeCount: employees.length,
      submissionDeadline: "7 November 2026",
      legalDisclaimer:
        "EMP201 monthly payroll liabilities compiled for SARS eFiling submission. Reconcile against your payroll provider or certified IRP5 records before submitting.",
    };
  }

  /**
   * Generates Provisional Tax (IRP6) Workpaper
   */
  public generateProvisionalIRP6Workpaper(
    orgId: string,
    periodNumber: 1 | 2 = 2,
    yearOfAssessment: string = "2027"
  ): ProvisionalIRP6Workpaper {
    const invoices = db.getInvoices(orgId);
    const expenses = db.getExpenses(orgId);

    const annualizedRevenue = invoices.reduce((sum, i) => sum + i.subtotal_cents, 0) * 2;
    const annualizedExpenses = expenses.reduce((sum, e) => sum + e.amount_cents, 0) * 2;
    const estimatedTaxableIncome = Math.max(0, annualizedRevenue - annualizedExpenses);

    const corporateTaxRate = 0.27; // 27% standard SA company tax
    const grossTax = Math.round(estimatedTaxableIncome * corporateTaxRate);

    const firstPeriodPaid = periodNumber === 2 ? Math.round(grossTax * 0.5) : 0;
    const netDue = grossTax - firstPeriodPaid;

    return {
      yearOfAssessment,
      periodNumber,
      estimatedTaxableIncomeCents: estimatedTaxableIncome,
      taxRatePercent: 27,
      grossTaxLiabilityCents: grossTax,
      lessPreviousPaymentsCents: firstPeriodPaid,
      netProvisionalDueCents: netDue,
      statutoryThresholdWarning:
        "Ensure second provisional estimate is within statutory accuracy thresholds (80% or 90% depending on taxable turnover exceeding R1m) to avoid Section 89quat interest penalties.",
      submissionDeadline: periodNumber === 1 ? "31 August" : "28 February",
    };
  }
}

export const sarsEngine = new SARSComplianceEngine();
