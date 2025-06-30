import { IsNotEmpty, IsOptional, Max, MaxLength, Min, MinLength } from "class-validator";

export class updateArticleDto {

    @IsOptional()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(30)
    title?: string;

    @IsOptional()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(3000)
    content?: string;
}