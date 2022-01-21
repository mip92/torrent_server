import {BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from 'sequelize-typescript';
import {ApiProperty} from "@nestjs/swagger";
import {CommentsUsers} from "../comments/comments-users.model";

import {Ganre} from "../ganres/ganres.model";
import {TorrentGanres} from "../ganres/torrent-ganre.model";

interface TorrentCreationAttrs{
    name: string,
    description:string,
    picture: Array<string>,
    mainPicture: string,
    torrentDoc: string,
    view: number,
}

@Table({tableName:"torrentFile"})
export class Torrent extends Model<Torrent, TorrentCreationAttrs> {
    @ApiProperty({example:1, description:'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id: number;

    @ApiProperty({example:"GTA 5", description:'Название торрент файла'})
    @Column({type: DataType.STRING, unique:true, allowNull:false})
    name: string;

    @ApiProperty({example:"Игра в открытом мире...", description:'Описание игры'})
    @Column({type: DataType.TEXT, allowNull:false})
    description: string;

    @ApiProperty({example:"['firstPicture.jpeg', 'secondPicture.jpeg']", description:'Массив ссылок на картинки'})
    @Column({type: DataType.ARRAY(DataType.STRING)})
    picture: string[];

    @ApiProperty({example:"mainPicture.jpeg", description:'Ссылка на главную картинку'})
    @Column({type: DataType.STRING})
    mainPicture: string;

    @ApiProperty({example:"gta5.torrent", description:'Имя торрент файла'})
    @Column({type: DataType.STRING})
    torrentDoc: string;

    @ApiProperty({example:54, description:'Колличество просмотров'})
    @Column({type: DataType.INTEGER})
    view: number;

    @ForeignKey(() => Ganre)
    @Column({type: DataType.ARRAY(DataType.STRING)})
    ganresId: string[];

    @ForeignKey(() => CommentsUsers)
    @Column({type: DataType.ARRAY(DataType.STRING)})
    commentsId: string[];

    @HasMany(()=>CommentsUsers)
    comments: CommentsUsers[]

    @BelongsToMany(()=>Ganre,()=>TorrentGanres)
    ganres:Ganre[];

}