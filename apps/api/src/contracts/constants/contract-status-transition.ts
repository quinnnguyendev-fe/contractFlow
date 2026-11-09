import { ContractStatus } from '../../generated/prisma/enums.js';

export const CONTRACT_STATUS_TRANSITIONS: Record<
  ContractStatus,
  ContractStatus[]
> = {
  [ContractStatus.DRAFT]: [ContractStatus.PENDING, ContractStatus.ARCHIVED],

  [ContractStatus.PENDING]: [ContractStatus.ACTIVE, ContractStatus.ARCHIVED],

  [ContractStatus.ACTIVE]: [
    ContractStatus.EXPIRED,
    ContractStatus.TERMINATED,
    ContractStatus.ARCHIVED,
  ],

  [ContractStatus.EXPIRED]: [ContractStatus.ARCHIVED],

  [ContractStatus.TERMINATED]: [ContractStatus.ARCHIVED],

  [ContractStatus.ARCHIVED]: [],
};
