import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterAuthDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message: "Min 6 charactrers required"})
    password:string;

    rolesIds:string[]

}