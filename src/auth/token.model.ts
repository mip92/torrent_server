import {Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import {User} from "../users/user.model";
import {ApiProperty} from "@nestjs/swagger";

interface TokenUserCreationAttr{
    userId: number;
    refreshToken: string;
}
@Table({tableName: "token_user", createdAt: false, updatedAt:false})
export class TokenUser extends Model<TokenUser, TokenUserCreationAttr> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @ApiProperty({example:"asdasd3423dgdfg453", description:'Токен для восстановления временного токена'})
    @Column({type: DataType.STRING, allowNull:true, unique: false})
    refreshToken: string;
}