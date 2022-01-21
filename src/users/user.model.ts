import {BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table} from 'sequelize-typescript';
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {CommentsUsers} from "../comments/comments-users.model";
import {TokenUser} from "../auth/token.model";
import {RecoverPassword} from "../auth/recoverPassword.model";

interface UserCreationAttrs{
    email: string,
    password:string,
    userAvatar: string,
    activationLink: string
}

@Table({tableName:"users"})
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({example:1, description:'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id: number;

    @ApiProperty({example:"user.mail.com", description:'Почтовый адрес пользователя'})
    @Column({type: DataType.STRING, unique:true, allowNull:false})
    email: string;

    @ApiProperty({example:"123456", description:'Пароль пользователя'})
    @Column({type: DataType.STRING, allowNull:false})
    password: string;

    @ApiProperty({example:true, description:'Пользователь забанен?'})
    @Column({type: DataType.BOOLEAN, defaultValue:false})
    banned: boolean;

    @ApiProperty({example:"ругался матом", description:'Причина бана'})
    @Column({type: DataType.STRING, allowNull:true})
    banReason: string;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER})
    roleId: number;

    @ApiProperty({example:"avatar.jpeg", description:'Аватар пользователя'})
    @Column({type: DataType.STRING, allowNull:true})
    userAvatar: string;

    @ApiProperty({example:"sdfs48448sdf", description:'Ссылка для активации пользователя'})
    @Column({type: DataType.STRING, allowNull:false})
    activationLink:string

    @BelongsTo(()=>Role)
    role:Role;

    @HasMany(()=>CommentsUsers)
    comments: CommentsUsers[];

    @HasOne(()=>TokenUser)
    token: TokenUser;

    @HasOne(()=>RecoverPassword)
    RecoverPassword: RecoverPassword;
}