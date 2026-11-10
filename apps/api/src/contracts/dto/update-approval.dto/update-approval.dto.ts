import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApprovalStatus } from "../../../generated/prisma/enums.js";

export class UpdateApprovalDto {
    @IsEnum(ApprovalStatus)
    @IsNotEmpty()
    status: ApprovalStatus

    @IsOptional()
    @IsString()
    comment?: string
}