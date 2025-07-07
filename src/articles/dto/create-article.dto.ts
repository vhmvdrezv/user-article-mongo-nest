import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateArticleDto {

    @IsNotEmpty({ message: 'Title is required.' })
    @IsString({ message: 'Title must be a string' })
    @MinLength(1)
    @MaxLength(30)
    @Matches(/^[a-zA-Z0-9\s\-_.,!?'"()]+$/, { 
        message: 'Title contains invalid characters' 
    })
    @Transform(({ value }) => value?.trim())
    title: string;

    @IsNotEmpty({ message: 'Content is required.' })
    @IsString({ message: 'Content must be a string.' })
    @MinLength(1)
    @MaxLength(3000)
    @Matches(/^[a-zA-Z0-9\s\-_.,!?'"()]+$/, { 
        message: 'Content contains invalid characters' 
    })
    @Transform(({ value }) => value?.trim())
    content: string;
}