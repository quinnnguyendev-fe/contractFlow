import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ContractStatus } from '../../../generated/prisma/enums.js';
import { Type } from 'class-transformer';

export enum ContractSortBy {
  CREATED_AT = 'createdAt',
  CONTRACT_NUMBER = 'contractNumber',
  TITLE = 'title',
  VALUE = 'value',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryContractDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ContractSortBy)
  sortBy?: ContractSortBy = ContractSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
