import { Type } from "class-transformer";
import { IsIn, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches, Max, MaxLength, Min } from "class-validator";

export class getArticlesDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @Matches(/^[a-zA-Z0-9\s\-_.,!?'"()]+$/, { 
        message: 'Search term contains invalid characters' 
    })
    search?: string;

    @IsOptional()
    @IsString()
    @IsMongoId({ message: 'Author ID must be a valid MongoDB ObjectId' })
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