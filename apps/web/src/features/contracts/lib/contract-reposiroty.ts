import { mockContracts } from "./mock-contracts";
import type { Contract } from "./types";

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
};
