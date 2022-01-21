import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateAdminDto{
    @ApiProperty({example:"user@mail.com", description:'Почтовый адрес пользователя'})
    @IsString({message: "Поле должно быть строкой"})
    @IsEmail({},{message:"Некоректный email"})
    readonly email: string;
}