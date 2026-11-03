import { mockContracts } from "./mock-contracts";
import type { Contract, CreateContractInput } from "./types";

const STORAGE_KEY = "contractflow:contracts";
export const contractReposiroty = {
  getAll(): Contract[] {
    if (typeof window === "undefined") {
      return mockContracts;
    }

    const storedContracts = localStorage.getItem(STORAGE_KEY);

    if (!storedContracts) {
      return mockContracts;
    }

    try {
      return JSON.parse(storedContracts) as Contract[];
    } catch {
      return mockContracts;
    }
  },

  create(contract: Contract): Contract {
    const contracts = this.getAll();
    const updatedContracts = [contract, ...contracts];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContracts));

    window.dispatchEvent(new Event("contractflow:contracts-updated"));

    return contract;
  },

  update(id: string, updates: Partial<CreateContractInput>) {
    const contracts = this.getAll();

    const updatedContracts = contracts.map((contract) =>
      contract.id === id
        ? { ...contract, ...updates, updated: new Date().toISOString() }
        : contract,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContracts));

    window.dispatchEvent(new Event("contractflow:contracts-updated"));
    return updatedContracts.find((contract) => contract.id === id) ?? null;
  },
};
