import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CheckCodeDto {
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