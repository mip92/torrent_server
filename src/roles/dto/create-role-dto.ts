import {ApiProperty} from "@nestjs/swagger";

export class CreateRoleDto{
    @ApiProperty({example:"user", description:'Роль пользователя'})
    readonly value: string;
    @ApiProperty({example:"Простой пользователь может коментировать файлы", description:'Описание роли пользователя'})
    readonly description: string;
}