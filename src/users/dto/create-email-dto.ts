import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateEmailDto {
    @IsNotEmpty()
    @ApiProperty({example: "user@mail.com", description: 'Почтовый адрес пользователя'})
    @IsString({message: "Поле email должно быть строкой"})
    @IsEmail({}, {message: "Некоректный email"})
    readonly email: string;
}