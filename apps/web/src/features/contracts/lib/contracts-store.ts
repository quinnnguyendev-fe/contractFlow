import { contractRepository } from "./contract-repository";
import { mockContracts } from "./mock-contracts";

export function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("contractflow:contracts-updated", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("contractflow:contracts-updated", callback);
  };
}

export function getSnapshot() {
  return JSON.stringify(contractRepository.getAll());
}

export function getServerSnapshot() {
  return JSON.stringify(mockContracts);
}
