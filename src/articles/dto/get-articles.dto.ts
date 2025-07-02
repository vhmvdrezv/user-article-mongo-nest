import { Type } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsOptional, Max, MaxLength, Min } from "class-validator";

export class getArticlesDto {
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(30)
    search?: string;

    @IsOptional()
    @IsNotEmpty()
    authorId?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
}