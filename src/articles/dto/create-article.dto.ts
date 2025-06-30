import { IsNotEmpty, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateArticleDto {

    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(30)
    title: string;

    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(3000)
    content: string;
}