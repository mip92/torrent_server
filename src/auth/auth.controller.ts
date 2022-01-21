import {
    Body,
    Controller, Get,
    HttpException,
    HttpStatus,
    Post, Put, Req, Res,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "../users/dto/create-user-dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {CreateEmailDto} from "../users/dto/create-email-dto";
import {CreatePasswordDto} from "../users/dto/create-password-dto";
import {Request} from "express";
import {Response} from "express";
import {CheckCodeDto} from "./dto/check-code-dto";
import {CreateNewPasswordDto} from "./dto/create-newPassword-dto";

@ApiTags("Регистрация и Авторизация")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @ApiOperation({summary: "Регистрация пользователя"})
    @ApiResponse({status: 200, type: 'string'})
    @Post('registration')
    @UseInterceptors(FileFieldsInterceptor([{name: 'avatar', maxCount: 1}]))
    async registration(@UploadedFiles() file,
                       @Body() dto: CreateUserDto,
                       @Res({passthrough: true}) response: Response) {
        const {avatar} = file
        if (!avatar) throw new HttpException('Нет аватарки', HttpStatus.NOT_FOUND)
        const userData = await this.authService.registration(dto, avatar[0])
        response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return userData
    }

    @ApiOperation({summary: "Валидация почты"})
    @ApiResponse({status: 200, type: 'string'})
    @Post('findEmail')
    findEmail(@Body() dto: CreateEmailDto) {
        return this.authService.findEmail(dto.email)
    }

    @ApiOperation({summary: "Валидация пароля"})
    @ApiResponse({status: 200, type: 'string'})
    @Post('isPasswordMatch')
    isPasswordMatch(@Body() dto: CreatePasswordDto) {
        return this.authService.isPasswordMatch(dto)
    }

    @ApiOperation({summary: "Валидация автарки"})
    @ApiResponse({status: 200, type: 'string'})
    @Post('isAvatarAPicture')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'avatar', maxCount: 1},
    ]))
    isAvatarAPicture(@UploadedFiles() file) {
        const {avatar} = file
        if (!avatar) throw new HttpException('Нет аватарки', HttpStatus.NOT_FOUND)
        return this.authService.isAvatarAPicture(avatar[0])
    }

    @ApiOperation({summary: "Авторизация пользователя"})
    @ApiResponse({status: 200, type: 'string'})
    @Post('login')
    async login(@Body() dto: CreateUserDto, @Res({passthrough: true}) response: Response) {
        const userData = await this.authService.login(dto)
        response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return userData
    }

    @ApiOperation({summary: "Логаут пользователя"})
    @ApiResponse({status: 200, type: 'string'})
    @Post('logout')
    logout(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        const token = this.authService.logout(request.cookies.refreshToken)
        response.clearCookie('refreshToken')
        return token
    }

    @ApiOperation({summary: "Восстановление токена"})
    @ApiResponse({status: 200, type: 'string'})
    @Get('refresh')
    async refresh(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        const refreshToken = request.cookies.refreshToken
        const userData = await this.authService.refresh(refreshToken)
        response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return userData
    }

    @ApiOperation({summary: "Восстановление пароля"})
    @ApiResponse({status: 200, type: 'string'})
    @Post('passwordRecovery')
    passwordRecovery(@Body() dto: CreateEmailDto) {
        return this.authService.passwordRecovery(dto.email)
    }

    @ApiOperation({summary: "Проверка кода для восстановления пароля"})
    @ApiResponse({status: 200, type: 'string'})
    @Post('checkCode')
    checkSecreteCode(@Body() dto: CheckCodeDto) {
        return this.authService.checkSecreteCode(dto.email, dto.code)
    }

    @ApiOperation({summary: "Назначить новый пароль"})
    @ApiResponse({status: 200, type: 'string'})
    @Put('newPassword')
    newPassword(@Body() dto: CreateNewPasswordDto) {
        return this.authService.newPassword(dto)
    }
}
