import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { IsAfterDate } from '../../validators/is-after-date.validator.js';
import { ContractCurrency } from '../../constaints/contract-currency.js';

export class CreateContractDto {
  @IsString()
  @IsNotEmpty()
  contractNumber: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  counterparty: string;

  @IsString()
  @IsNotEmpty()
  contractType: string;

  @IsNumber()
  @Min(0)
  value: number;

  @IsEnum(ContractCurrency)
  currency: ContractCurrency;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsAfterDate('startDate', {
    message: 'endDate must be after startDate',
  })
  endDate: string;
}
