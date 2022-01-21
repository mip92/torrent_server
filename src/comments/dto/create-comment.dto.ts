import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString, Length} from "class-validator";

export class CreateCommentDto {
    @ApiProperty({example:1, description:'Id пользователя'})
    @IsNumber()
    readonly userId: number;
    @IsNotEmpty()
    @ApiProperty({example:"Я думал, намного будет… Намного лучше будет это все. И очень плохая игра, просто очень плохая игра! Я думал, намного лучше это все будет. Сколько раз сюда ходи-и-и-л — было намного лучше, но на этот раз как-то не удало-ось. Во-первых, сидов мало, торрент — не очень…", description:'Текст комментария'})
    @IsString({message: "Поле должно быть строкой"})
    @Length(10,255,{message:"Длина комментария должна быть больше 10 и меньше 255 символов"})
    readonly text: string;
    @ApiProperty({example:2, description:'Id торрента'})
    @IsNumber()
    readonly torrentId: number;
}