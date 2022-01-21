import {IsNotEmpty, IsString, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreatePasswordDto {
    @IsNotEmpty()
    @MinLength(6, {message: "Длина пароля должна быть больше 6 символов"})
    /*@Max(16,{message:"Длина пароля должна быть меньше 16 символов"})*/
    @ApiProperty({example: "password", description: 'Первый пароль при регистрации'})
    @IsString({message: "Поле password должно быть строкой"})
    readonly password1: string;
    @IsNotEmpty()
    @MinLength(6, {message: "Длина пароля должна быть больше 6 символов"})
    /* @Max(16,{message:"Длина пароля должна быть меньше 16 символов"})*/
    @ApiProperty({example: "password", description: 'Второй пароль при регистрации'})
    @IsString({message: "Поле password должно быть строкой"})
    readonly password2: string;
}