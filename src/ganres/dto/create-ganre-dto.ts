import {ApiProperty} from "@nestjs/swagger";

export class CreateGanreDto{
    @ApiProperty({example:"Аркада", description:'Название жанра'})
    readonly value: string;
    @ApiProperty({example:"Жанр компьютерных игр, характеризующийся коротким по времени, но интенсивным игровым процессом",
        description:'Описание жанра'})
    readonly description: string;
}