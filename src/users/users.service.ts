import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user-dto";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./user.model";
import {RolesService} from "../roles/roles.service";
import {CreateAdminDto} from "./dto/create-admin-dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleService: RolesService) {
    }

    async createUser(dto: CreateUserDto, userAvatar:string, activationLink:string) {
        try {
            const role = await this.roleService.getRoleByValue("user")
            const user = await this.userRepository.create({...dto, userAvatar: userAvatar, activationLink})
            await user.$set('role', role.id)
            user.role = role
            user.userAvatar = userAvatar
            return user
        }catch (e){
            console.log(e)
        }
    }
    async createAdmin(dto: CreateAdminDto) {
        let email=dto.email
        const role = await this.roleService.getRoleByValue("admin")
        const user = await this.userRepository.findOne({where:{email}})
        if (!user) throw new HttpException({
            message: ['Такого пользователя не существует'],
            statusCode: 404
        }, HttpStatus.NOT_FOUND)
        await user.$set('role', role.id)
        user.role = role
        return user
    }

    async GetAllUsers(offset?: number, limit?: number) {
        if(!limit) limit=10
        limit>50 ? limit=50:limit
        try {
            const items = await this.userRepository.findAll({
                limit: limit,
                offset: offset,
                where: {}
            });
            return items
        }catch (e) {
            console.log(e)
            throw new HttpException({
                message: ['Произошла ошибка'],
                statusCode: 500
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getUserByEmail(email: string) {

        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        /*if (user) throw new HttpException({
            message: ['Такой пользователя уже существует'],
            statusCode: 404
        }, HttpStatus.NOT_FOUND)*/
        return user
    }
}
