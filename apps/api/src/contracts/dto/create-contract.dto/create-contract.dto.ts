import { IsDateString, IsNumber, IsString, Min } from "class-validator";

export class CreateContractDto {
    @IsString()
    contractNumber: string

    @IsString()
    title: string

    @IsString()
    counterparty: string

    @IsString()
    contractType: string

    @IsNumber()
    @Min(0)
    value: number

    @IsString()
    currency: string

    @IsDateString()
    startDate: string

    @IsDateString()
    endDate: string
}
