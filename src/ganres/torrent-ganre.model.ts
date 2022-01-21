import {Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import {Ganre} from "./ganres.model";
import {Torrent} from "../torrent/torrent.model";


@Table({tableName: "torrent_ganres", createdAt: false, updatedAt:false})
export class TorrentGanres extends Model<TorrentGanres> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Ganre)
    @Column({type: DataType.INTEGER})
    ganreId: number;

    @ForeignKey(() => Torrent)
    @Column({type: DataType.INTEGER})
    torrentId: number;
}