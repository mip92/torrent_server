import {Column, DataType, HasMany, Model, Table} from 'sequelize-typescript';
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/user.model";


interface RoleCreationAttrs{
    value: string,
    description:string
}

@Table({tableName:"roles"})
export class Role extends Model<Role, RoleCreationAttrs> {
    @ApiProperty({example:1, description:'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id: number;

    @ApiProperty({example:"admin", description:'Роль пользователя'})
    @Column({type: DataType.STRING, unique:true, allowNull:false})
    value: string;

    @ApiProperty({example:"Администратор", description:'Описание роли'})
    @Column({type: DataType.STRING, allowNull:false})
    description: string;

    @HasMany(()=>User)
    users:User;

}