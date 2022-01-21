import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateRoleDto} from "./dto/create-role-dto";
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./roles.model";

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {
    }

    async createRole(dto: CreateRoleDto) {
        let value = dto.value
        const findRole = await this.roleRepository.findOne({where: {value}})
        if (findRole) throw new HttpException({
            message: ['Такая роль уже существует'],
            statusCode: 401
        }, HttpStatus.BAD_REQUEST)
        const role = await this.roleRepository.create(dto)
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}})
        if (!role) throw new HttpException({
            message: ['Такой роли не существует'],
            statusCode: 404
        }, HttpStatus.NOT_FOUND)
        return role
    }

    async getAllRoles() {
        const roles = await this.roleRepository.findAll()
        if (roles.length === 0) throw new HttpException({
            message: ['В базе данных нет ролей, создайте роль'],
            statusCode: 404
        }, HttpStatus.NOT_FOUND)
        return roles
    }
}
