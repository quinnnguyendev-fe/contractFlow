import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateApprovalDto {
    @IsUUID()
    @IsNotEmpty()
    approverId: string
}