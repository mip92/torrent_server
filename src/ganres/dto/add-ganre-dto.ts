import {ApiProperty} from "@nestjs/swagger";
import {IsArray, isJSON, IsNumber, IsString, MaxLength} from "class-validator";

export class AddGanreDto {

    @ApiProperty({example:1, description:'Id жанра который присваивается торренту'})
    readonly ganreId: number;

    @ApiProperty({example:2, description:'Id торрента'})
    @IsNumber()
    readonly torrentId: number;
}