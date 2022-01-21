import {Body, Controller, Get, Param, Post, Query, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Ganre} from "./ganres.model";
import {GanresService} from "./ganres.service";
import {CreateGanreDto} from "./dto/create-ganre-dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {CommentsUsers} from "../comments/comments-users.model";
import {CreateCommentDto} from "../comments/dto/create-comment.dto";
import {AddGanreDto} from "./dto/add-ganre-dto";
import {of} from "rxjs";
import {AddGanresDto} from "./dto/add-ganres-dto";
import {RoleDecorator} from "../auth/roles-auth.decorator";
import {RoleGuard} from "../auth/roles.guard";


@ApiTags("Жанры игр")
@Controller('ganres')
export class GanresController {
    constructor(private ganresService: GanresService) {
    }
    @RoleDecorator('admin')
    @UseGuards(RoleGuard)
    @ApiOperation({summary: "Создание жанра"})
    @ApiResponse({status: 200, type: Ganre})
    @Post('create')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'GanreLogo', maxCount: 1},
    ]))
    create(@UploadedFiles() files, @Body() dto: CreateGanreDto) {
        const {GanreLogo} = files
        return this.ganresService.createGanre(dto, GanreLogo[0])
    }

    @ApiOperation({summary: "Вернуть жанр по id"})
    @ApiResponse({status: 200, type: Ganre})
    @Get('/:id')
    getByValue(@Param('id') id: number) {
        return this.ganresService.getGanreById(id)
    }


    @ApiOperation({summary: "Вернуть все жанры"})
    @ApiResponse({status: 200, type: [Ganre]})
    @Get()
    getAllGanres() {
        return this.ganresService.getAllGanres()
    }
    @RoleDecorator('admin')
    @UseGuards(RoleGuard)
    @ApiOperation({summary: "Добавление жанров к торренту"})
    @ApiResponse({status: 200, type: CommentsUsers})
    @Post('addGanre')
    addGanre(@Body() dto: AddGanreDto) {
        return this.ganresService.addGanre(dto)
    }
    @RoleDecorator('admin')
    @UseGuards(RoleGuard)
   @ApiOperation({summary: "Добавление нескольких жанров к торренту"})
    @ApiResponse({status: 200, type: CommentsUsers})
    @Post('addGanres')
    addGanres(@Body() dto: AddGanresDto) {
        return this.ganresService.addGanres(dto)
    }

    @ApiOperation({summary: "дать рандомный логотипо игры с жанором соответствующим id"})
    @ApiResponse({status: 200, type: CommentsUsers})
    @Get('getLogoOfGanreById/:id')
    getLogoOfGanreById(@Param('id') id: number) {
        return this.ganresService.getLogoOfGanreById(id)
    }

    @ApiOperation({summary: "дать торренты с нужным жанром по ид"})
    @ApiResponse({status: 200, type: CommentsUsers})
    @Get('GetToorentsByIdGanres/:id&:limit&:offset')
    GetToorentsByIdGanres(@Query('id') id: number,
                          @Query('limit') limit: number,
                          @Query('offset') offset: number) {
        return this.ganresService.getToorentsByIdGanre(id, offset, limit)
    }
}