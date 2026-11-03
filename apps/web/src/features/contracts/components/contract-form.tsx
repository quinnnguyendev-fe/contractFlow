"use client";
import { useState } from "react";
import type { Contract, CreateContractInput } from "../lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { contractReposiroty } from "../lib/contract-reposiroty";

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
  status: "draft",
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
    initialValues || initialFormData,
  );
  const [errors, setErrors] = useState<ContractFormErrors>({});
  const router = useRouter();

  function handleChange(
    field: keyof CreateContractInput,
    value: string | number,
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) return;

    if (mode === "edit") {
      if (!contractId) return;

      const updatedContract = contractReposiroty.update(contractId, formData);

      if (!updatedContract) return;
      router.push(`/contracts/${contractId}`);
      return;
    }

    const now = new Date().toISOString();

    const newContract: Contract = {
      ...formData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    contractReposiroty.create(newContract);

    router.push("/contracts");
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contractNumber">Contract Number</Label>
          <Input
            id="contractNumber"
            value={formData.contractNumber}
            onChange={(e) => handleChange("contractNumber", e.target.value)}
            placeholder="e.g. CT-2026-001"
          />
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

          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="counterparty">Counterparty</Label>
          <Input
            id="counterparty"
            value={formData.counterparty}
            onChange={(event) =>
              handleChange("counterparty", event.target.value)
            }
            placeholder="Enter company or partner name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractType">Contract Type</Label>
          <Input
            id="contractType"
            value={formData.contractType}
            onChange={(event) =>
              handleChange("contractType", event.target.value)
            }
            placeholder="e.g. Service Agreement"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">Contract Value</Label>
          <Input
            id="value"
            type="number"
            min="0"
            value={formData.value}
            onChange={(event) =>
              handleChange("value", Number(event.target.value))
            }
            placeholder="Enter contract value"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            value={formData.currency}
            onChange={(event) => handleChange("currency", event.target.value)}
            placeholder="e.g. USD"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(event) => handleChange("startDate", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(event) => handleChange("endDate", event.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Create Contract</Button>
      </div>
    </form>
  );
}
