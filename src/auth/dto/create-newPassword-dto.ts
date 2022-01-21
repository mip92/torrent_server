import {IsEmail, IsNotEmpty, IsString, Length, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateNewPasswordDto {
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
    @IsNotEmpty()
    @ApiProperty({example: "user@mail.com", description: 'Почтовый адрес пользователя который меняет себе пароль'})
    @IsString({message: "Поле email должно быть строкой"})
    @IsEmail({}, {message: "Некоректный email"})
    readonly email: string;
    @IsNotEmpty()
    @ApiProperty({example: "45asd57f", description: 'Код из 8 символов'})
    @IsString({message: "Поле code должно быть строкой"})
    @Length(8, 8,{message: "В поле Code должно быть 8 символов"})
    readonly code: string;
}