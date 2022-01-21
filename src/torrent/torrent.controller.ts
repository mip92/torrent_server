import {
    Body,
    Post,
    Controller,
    UseInterceptors,
    UploadedFiles,
    Get,
    Query,
    Param,
    HttpException,
    HttpStatus, UseGuards
} from "@nestjs/common";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {CreateTorrentDto} from "./dto/create-torrent-dto";
import {TorrentService} from "./torrent.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Torrent} from "./torrent.model";
import {RoleDecorator} from "../auth/roles-auth.decorator";
import {RoleGuard} from "../auth/roles.guard";


@ApiTags("Торрент")
@Controller('/torrent')
export class TorrentController {
    constructor(private torrentService: TorrentService) {
    }

    @RoleDecorator('admin')
    @UseGuards(RoleGuard)
    @ApiOperation({summary: "Создание торрента"})
    @ApiResponse({status: 200, type: Torrent})
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        {name: "mainPicture", maxCount: 1},
        {name: "picture0", maxCount: 1},
        {name: "picture1", maxCount: 2},
        {name: "picture2", maxCount: 3},
        {name: "picture3", maxCount: 4},
        {name: "torrent", maxCount: 1}
    ]))
    create(@UploadedFiles() files, @Body() dto: CreateTorrentDto) {
        const {mainPicture, picture0, picture1,picture2, picture3, torrent} = files

        if(!picture0 || !picture1 || !picture2 || !picture3)  {throw new HttpException({
                message: ["Количество скриншотов меньше чем 4"],
                statusCode: 400}, HttpStatus.BAD_REQUEST)
        }

        if(!mainPicture) {throw new HttpException({
            message: ["Нет главной картинки"],
            statusCode: 400
        }, HttpStatus.BAD_REQUEST)}

        if(!torrent)  {throw new HttpException({
            message: ["Нет торрент файла"],
            statusCode: 400
        }, HttpStatus.BAD_REQUEST)}

        let picture=[picture0[0], picture1[0],picture2[0], picture3[0]]
        return this.torrentService.create(dto, picture, torrent[0], mainPicture[0])
    }

    @ApiOperation({summary: "Получить все торренты"})
    @ApiResponse({status: 200, type: [Torrent]})
    @Get()
    getAll(@Query("offset") offset: number,
           @Query("limit") limit: number,
           @Query("ganre") ganre: number,) {
        return this.torrentService.getAll(offset, limit, ganre)
    }

    @ApiOperation({summary: "Получить один торрент по ID"})
    @ApiResponse({status: 200, type: Torrent})
    @Get('/:id')
    getTorrentById(@Param('id') id: number) {
        return this.torrentService.getTorrentById(id)
    }
}