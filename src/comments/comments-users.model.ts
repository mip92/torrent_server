import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import {User} from "../users/user.model";
import {Torrent} from "../torrent/torrent.model";

interface CommentsUsersCreationAttrs{
    text: string,
}

@Table({tableName: "comments_users"})
export class CommentsUsers extends Model<CommentsUsers,CommentsUsersCreationAttrs > {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @ForeignKey(() => Torrent)
    @Column({type: DataType.INTEGER})
    torrentId: number;

    @Column({type: DataType.STRING})
    text: string;

    @BelongsTo(()=>User)
    author: User

    @BelongsTo(()=>Torrent)
    torrentComment: User
}