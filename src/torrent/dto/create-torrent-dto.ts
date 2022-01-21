import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateTorrentDto{
    @IsNotEmpty()
    @ApiProperty({example:"GTA 5", description:'Название торрента'})
    @IsString({message: "Поле должно быть строкой"})
    readonly name: string;
    @IsNotEmpty()
    @ApiProperty({example:"разборки питерские", description:'Описание торрента'})
    @IsString({message: "Поле должно быть строкой"})
    readonly description: string;
}