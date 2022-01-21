import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from 'sequelize-typescript';
import {ApiProperty} from "@nestjs/swagger";
import {Torrent} from "../torrent/torrent.model";
import {TorrentGanres} from "./torrent-ganre.model";


interface GanreCreationAttrs{
    value: string,
    description:string
    GanreLogo: string
}

@Table({tableName:"ganres"})
export class Ganre extends Model<Ganre, GanreCreationAttrs> {
    @ApiProperty({example:1, description:'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id: number;

    @ApiProperty({example:"Аркада", description:'Название жанра'})
    @Column({type: DataType.STRING, unique:true, allowNull:false})
    value: string;

    @ApiProperty({example:"Жанр компьютерных игр, характеризующийся коротким по времени, но интенсивным игровым процессом",
        description:'Описание жанра'})
    @Column({type: DataType.STRING, allowNull:false})
    description: string;

    @ApiProperty({example:"logo.jpeg", description:'Логотип жанра'})
    @Column({type: DataType.STRING})
    GanreLogo: string;

    @BelongsToMany(()=>Torrent,()=>TorrentGanres)
    torrents:Torrent[];

}