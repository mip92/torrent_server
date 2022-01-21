import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    @ApiProperty({example:"user@mail.com", description:'Почтовый адрес пользователя'})
    @IsString({message: "Поле email должно быть строкой"})
    @IsEmail({},{message:"Некоректный email"})
    readonly email: string;
    @IsNotEmpty()
    @ApiProperty({example:"123456", description:'Пароль пользователя'})
    @IsString({message: "Поле password должно быть строкой"})
    @Length(6,16,{message:"Длина пароля должна быть больше 6 и меньше 16 символов"})
    readonly password: string;

}