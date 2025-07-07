import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z\s\-']+$/, { 
        message: 'Full name can only contain letters, spaces, hyphens, and apostrophes' 
    })
    @Transform(({ value }) => value?.trim())
    fullname?: string
}