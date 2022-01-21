import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user-dto";
import {UsersService} from "../users/users.service";
import * as bcrypt from "bcrypt"
import {User} from "../users/user.model";
import {FileService, FileType} from "../file/file.service";
import {CreatePasswordDto} from "../users/dto/create-password-dto";
import * as jwt from "jsonwebtoken"
import * as uuid from 'uuid'
import {MailService} from "../email/email.service";
import {InjectModel} from "@nestjs/sequelize";
import {TokenUser} from "./token.model";
import {RecoverPassword} from "./recoverPassword.model";
import {CreateNewPasswordDto} from "./dto/create-newPassword-dto";

type userType = { email: string, id: number, role: string };

@Injectable()
export class AuthService {
    constructor(private userService: UsersService,
                private fileService: FileService,
                private mailService: MailService,
                @InjectModel(TokenUser) private tokenRepository: typeof TokenUser,
                @InjectModel(RecoverPassword) private recoverPasswordRepository: typeof RecoverPassword
    ) {
    }

    async registration(dto: CreateUserDto, avatar) {
        const candidate = await this.userService.getUserByEmail(dto.email)
        if (candidate) {
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
        }
        const userAvatar = this.fileService.createFile(FileType.IMAGE, avatar)
        const hashPassword = await bcrypt.hash(dto.password, 5)
        const activationLink = await uuid.v4()
        const email = dto.email
        await this.mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        const user = await this.userService.createUser({email, password: hashPassword}, userAvatar, activationLink)
        const tokens = this.generateToken(user)
        await this.saveToken(user.id, tokens.refreshToken)
        return {
            ...tokens,
            userAvatar,
            userId: user.id,
            email: user.email,
            isActivated: false////Допилить
        }
    }


    private generateToken(user: User) {
        const payload = {email: user.email, id: user.id, role: user.role.value}
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30s'},)
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30s'})
        return {
            accessToken,
            refreshToken
        }
    }

    private validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    private validateRefreshToken(token): userType {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return <userType>userData
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await this.tokenRepository.findOne({where: {userId}})
        if (tokenData) {
            await tokenData.update({refreshToken})/*('refreshToken', refreshToken)*/
            return tokenData
        }
        const token = await this.tokenRepository.create({userId, refreshToken})
        return token
    }

    private async removeToken(refreshToken) {
        const tokenData = await this.tokenRepository.destroy({where: {refreshToken}})
        return tokenData
    }

    private async findToken(refreshToken) {
        const tokenData = await this.tokenRepository.findOne({where: {refreshToken}})
        return tokenData
    }

    async login(dto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(dto.email);
        if (!user) throw new HttpException({
            message: ['Такого пользователя не существует'],
            statusCode: 400
        }, HttpStatus.BAD_REQUEST)
        const passwordEqual = await bcrypt.compare(dto.password, user.password)
        if (!passwordEqual) throw new HttpException({
            message: ['Пароль неверный'],
            statusCode: 401
        }, HttpStatus.UNAUTHORIZED)/*throw new UnauthorizedException({message:'Некоректный пароль или почта'})*/
        const tokens = this.generateToken(user)
        await this.saveToken(user.id, tokens.refreshToken)
        return {
            ...tokens,
            userAvatar: user.userAvatar,
            userId: user.id,
            email: user.email,
            isActivated: false////Допилить
        }
    }

    async logout(refreshToken) {
        const token = await this.removeToken(refreshToken)
        return token
    }

    async findEmail(email: string) {
        const user = await this.userService.getUserByEmail(email);
        if (user) throw new HttpException({
            message: ["Пользователь с таким email уже существует"],
            statusCode: 400
        }, HttpStatus.BAD_REQUEST)
        else return email
    }

    async isPasswordMatch(dto: CreatePasswordDto) {
        if (dto.password1 !== dto.password2) throw new HttpException({
            message: ["Пароли не совпадают"],
            statusCode: 400
        }, HttpStatus.BAD_REQUEST)
        else return dto.password1
    }

    async isAvatarAPicture(avatar) {
        const fileExtension = avatar.originalname.split('.').pop()
        const arr = ['jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG', 'BMP', 'bmp', 'GIF', 'gif', 'ico', 'ICO']
        let isOk = null
        for (let i = 0; i < arr.length; i++) {
            if (fileExtension == arr[i]) isOk = "ok"
        }
        if (isOk == null) {
            throw new HttpException({
                message: ["Выбранный файл не является картинкой"],
                statusCode: 400
            }, HttpStatus.BAD_REQUEST)
        }
        if (avatar.size > 2097152) {
            throw new HttpException({
                message: ["Размер выбранного файла больше 2 Мб"],
                statusCode: 400
            }, HttpStatus.BAD_REQUEST)
        } else return avatar
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new HttpException({message: ["Нет refresh токена"], statusCode: 401}, HttpStatus.UNAUTHORIZED)
        }

        const userData: userType = this.validateRefreshToken(refreshToken);
        const tokenFromDb = await this.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw new HttpException({
                message: ["Присланный refresh токен с фронта не соответствует refresh токену с БД"],
                statusCode: 401
            }, HttpStatus.UNAUTHORIZED)
        }

        let user = await this.userService.getUserByEmail(userData.email);
        const tokens = this.generateToken(user)
        await this.saveToken(user.id, tokens.refreshToken)
        return {
            ...tokens,
            user
        }
    }

    async generateSecreteKey(userId) {
        const randomString = uuid.v4().substr(0, 8)
        const secretKeyData = await this.recoverPasswordRepository.findOne({where: {userId}})
        if (secretKeyData) await secretKeyData.update({randomString})
        else await this.recoverPasswordRepository.create({userId, randomString: randomString})
        return randomString
    }

    async passwordRecovery(email: string) {
        let user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new HttpException({
                message: ["Пользователь с такой почтой не зарегестрирован"],
                statusCode: 401
            }, HttpStatus.UNAUTHORIZED)
        }
        let randomString = await this.generateSecreteKey(user.id)
        await this.mailService.sendSecreteNumbers(email, randomString)
    }

    async checkSecreteCode(email: string, code: string) {
        let user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new HttpException({
                message: ["Пользователь с такой почтой не зарегестрирован"],
                statusCode: 401
            }, HttpStatus.UNAUTHORIZED)
        }
        const secretKeyData = await this.recoverPasswordRepository.findOne({where: {userId: user.id}})
        if (secretKeyData.randomString !== code) {
            let randomString = await this.generateSecreteKey(user.id)
            await this.mailService.sendSecreteNumbers(email, randomString)
            throw new HttpException({
                message: ["Секретный ключ неверный, Вам на почту отправлен новый ключ"],
                statusCode: 500
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        if (secretKeyData.randomString == code) {
            if (Date.now()-secretKeyData.updatedAt>1000*60*10){ //время жизни ключа 10 минут
                let randomString = await this.generateSecreteKey(user.id)
                await this.mailService.sendSecreteNumbers(email, randomString)
                throw new HttpException({
                    message: ["Секретный ключ устарел, Вам на почту отправлен новый ключ"],
                    statusCode: 500
                }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
            else return
        }
    }

    async newPassword(dto: CreateNewPasswordDto) {
        try {
            let password = await this.isPasswordMatch(dto)
            const hashPassword = await bcrypt.hash(password, 5)
            let user = await this.userService.getUserByEmail(dto.email);
            if (!user) {
                throw new HttpException({
                    message: ["Пользователь с такой почтой не зарегестрирован"],
                    statusCode: 401
                }, HttpStatus.UNAUTHORIZED)
            }
            const secretKeyData = await this.recoverPasswordRepository.findOne({where: {userId: user.id}})
            if (secretKeyData.randomString == dto.code) {
                await user.update({password: hashPassword})
                await this.recoverPasswordRepository.destroy({where:{userId:user.id}})
            }
        }catch (e) {
            console.log(e)
            throw new HttpException({
                message: ["Серверная ошибка"],
                statusCode: 500
            }, HttpStatus.UNAUTHORIZED)
        }
    }
}
