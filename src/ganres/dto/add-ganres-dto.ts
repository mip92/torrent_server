import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class AddGanresDto {
    @IsString()
    @ApiProperty({example:'1,8,9,44', description:'Id жанров которые присваиваются торренту'})
    readonly ganresIds: string;

    @ApiProperty({example:2, description:'Id торрента'})
    @IsNumber()
    readonly torrentId: number;
}