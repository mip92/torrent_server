import {Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import {User} from "../users/user.model";
import {ApiProperty} from "@nestjs/swagger";

interface RecoverPasswordCreationAttr{
    userId: number;
    randomString: string;
}
@Table({tableName: "recover_password", createdAt: true, updatedAt:true})
export class RecoverPassword extends Model<RecoverPassword, RecoverPasswordCreationAttr> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @ApiProperty({example:"1,2,3,4", description:'Секретный ключ для восстановления пароля'})
    @Column({type: DataType.STRING, allowNull:true, unique: false})
    randomString: string;

}