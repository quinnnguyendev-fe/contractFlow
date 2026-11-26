"use client";
import { useState } from "react";
import type { CreateContractInput } from "../lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createContract, updateContract } from "@/lib/api/contracts";
import { AlertCircle } from "lucide-react";

interface ContractFormProps {
  mode: "create" | "edit";
  contractId?: string;
  initialValues?: CreateContractInput;
}

const initialFormData: CreateContractInput = {
  contractNumber: "",
  title: "",
  counterparty: "",
  contractType: "",
  value: 0,
  currency: "USD",
  startDate: "",
  endDate: "",
};

type ContractFormErrors = Partial<Record<keyof CreateContractInput, string>>;

export function ContractForm({
  mode,
  contractId,
  initialValues,
}: ContractFormProps) {
  const [formData, setFormData] = useState<CreateContractInput>(
    initialValues ?? initialFormData,
  );
  const [errors, setErrors] = useState<ContractFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();

  function handleChange(
    field: keyof CreateContractInput,
    value: string | number,
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    setSubmitError(null);
  }

  function validateForm(): boolean {
    const nextErrors: ContractFormErrors = {};

    if (!formData.contractNumber.trim()) {
      nextErrors.contractNumber = "Contract number is required";
    }

    if (!formData.title.trim()) {
      nextErrors.title = "Contract title is required";
    }

    if (!formData.counterparty.trim()) {
      nextErrors.counterparty = "Counterparty is required";
    }

    if (!formData.contractType.trim()) {
      nextErrors.contractType = "Contract type is required";
    }

    if (!formData.currency.trim()) {
      nextErrors.currency = "Currency is required";
    }

    if (!Number.isFinite(formData.value) || formData.value <= 0) {
      nextErrors.value = "Contract value must be greater than 0";
    }

    if (!formData.startDate) {
      nextErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      nextErrors.endDate = "End date is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      nextErrors.endDate = "End date cannot be before start date";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || !validateForm()) return;

    if (mode === "edit" && !contractId) {
      setSubmitError("Missing contract ID.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (mode === "edit" && contractId) {
        await updateContract(contractId, {
          title: formData.title.trim(),
          counterparty: formData.counterparty.trim(),
          contractType: formData.contractType.trim(),
          value: formData.value,
          currency: formData.currency,
          startDate: formData.startDate,
          endDate: formData.endDate,
        });

        router.push(`/contracts/${contractId}`);
      } else {
        await createContract({
          contractNumber: formData.contractNumber.trim(),
          title: formData.title.trim(),
          counterparty: formData.counterparty.trim(),
          contractType: formData.contractType.trim(),
          value: formData.value,
          currency: formData.currency,
          startDate: formData.startDate,
          endDate: formData.endDate,
        });

        router.push("/contracts");
      }

      router.refresh();
    } catch (error) {
      console.error(
        `Failed to ${mode === "edit" ? "update" : "create"} contract:`,
        error,
      );
      setSubmitError(
        error instanceof Error
          ? error.message
          : `Failed to ${mode === "edit" ? "update" : "create"} contract.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderError(field: keyof CreateContractInput) {
    if (!errors[field]) return null;
    return (
      <p className="text-sm text-destructive" role="alert">
        {errors[field]}
      </p>
    );
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contractNumber">Contract Number</Label>
          <Input
            id="contractNumber"
            value={formData.contractNumber}
            readOnly={mode === "edit"}
            aria-invalid={Boolean(errors.contractNumber)}
            onChange={(e) => handleChange("contractNumber", e.target.value)}
            placeholder="e.g. CT-2026-001"
          />
          {renderError("contractNumber")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Contract Title</Label>
          <Input
            id="title"
            aria-invalid={Boolean(errors.title)}
            value={formData.title}
            onChange={(event) => handleChange("title", event.target.value)}
            placeholder="e.g. Software Development Agreement"
          />
          {renderError("title")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="counterparty">Counterparty</Label>
          <Input
            id="counterparty"
            value={formData.counterparty}
            aria-invalid={Boolean(errors.counterparty)}
            onChange={(event) =>
              handleChange("counterparty", event.target.value)
            }
            placeholder="Enter company or partner name"
          />
          {renderError("counterparty")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractType">Contract Type</Label>
          <Input
            id="contractType"
            value={formData.contractType}
            aria-invalid={Boolean(errors.contractType)}
            onChange={(event) =>
              handleChange("contractType", event.target.value)
            }
            placeholder="e.g. Service Agreement"
          />
          {renderError("contractType")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Contract Value</Label>
          <Input
            id="value"
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            aria-invalid={Boolean(errors.value)}
            onChange={(event) =>
              handleChange("value", Number(event.target.value))
            }
            placeholder="Enter contract value"
          />
          {renderError("value")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            value={formData.currency}
            aria-invalid={Boolean(errors.currency)}
            onChange={(event) => handleChange("currency", event.target.value)}
            placeholder="e.g. USD"
          />
          {renderError("currency")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            aria-invalid={Boolean(errors.startDate)}
            value={formData.startDate}
            onChange={(event) => handleChange("startDate", event.target.value)}
          />
          {renderError("startDate")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            aria-invalid={Boolean(errors.endDate)}
            onChange={(event) => handleChange("endDate", event.target.value)}
          />
          {renderError("endDate")}
        </div>
      </div>

      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{submitError}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "edit"
              ? "Saving..."
              : "Creating..."
            : mode === "edit"
              ? "Save Changes"
              : "Create Contract"}
        </Button>
      </div>
    </form>
  );
}
