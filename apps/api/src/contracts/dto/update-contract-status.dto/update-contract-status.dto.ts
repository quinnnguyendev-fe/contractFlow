import { IsEnum } from "class-validator";
import { ContractStatus } from "../../../generated/prisma/browser.js";

export class UpdateContractStatusDto {
    @IsEnum(ContractStatus)
    status: ContractStatus
}