import { Type } from "class-transformer"
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator"

export class QueryAuditLogDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number

    @IsOptional()
    @IsString()
    action?: string

    @IsOptional()
    @IsString()
    entityType?: string

    @IsOptional()
    @IsString()
    entityId?: string

    @IsOptional()
    @IsIn(['asc' , 'desc'])
    sortOrder?: 'asc' | 'desc'
}
