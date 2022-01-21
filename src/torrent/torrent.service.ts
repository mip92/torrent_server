import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {FileService, FileType} from "../file/file.service";
import {CreateTorrentDto} from "./dto/create-torrent-dto";
import {InjectModel} from "@nestjs/sequelize";
import {Torrent} from "./torrent.model";
import {Ganre} from "../ganres/ganres.model";
const {Op} = require("sequelize");


@Injectable()
export class TorrentService {
    constructor(private fileService: FileService,
                @InjectModel(Torrent) private torrentModel: typeof Torrent) {
    }

    async create(dto: CreateTorrentDto, picture, torrent, mainPicture): Promise<Torrent> {
        const findTorrent = await this.torrentModel.findOne({where: {name: dto.name}})
        if (findTorrent) throw new HttpException({
            message: 'Торрент с таким именем уже существует',
            statusCode: 404
        }, HttpStatus.NOT_FOUND)

        const picturePath = [];
        picture.forEach(element => picturePath.push(this.fileService.createFile(FileType.IMAGE, element)))
        const torrentPath = this.fileService.createFile(FileType.TORRENT, torrent)
        const mainPicturePath = this.fileService.createFile(FileType.IMAGE, mainPicture)
        const torrentFile = await this.torrentModel.create({
                ...dto,
                view: 0,
                torrentDoc: torrentPath,
                picture: picturePath,
                mainPicture: mainPicturePath,
            }
        );
        return torrentFile
    }

    async getTorrentById(id: number): Promise<Torrent> {
        try {
            const torrent = await this.torrentModel.findByPk(id, {include: {all: true}})
            const viewed = torrent.view + 1
            torrent.update({'view': viewed}, {where: {id: id}})
            if (!torrent) throw new HttpException({
                message:'Торрент с таким id не существует',
                statusCode: 404
            }, HttpStatus.NOT_FOUND)
            return torrent
        } catch (e) {
            console.log(e)
        }
    }

    async getAll(offset?: number, limit?: number, ganre?: number) {
        if (!limit) limit = 10
        limit > 50 ? limit = 50 : limit
        try {
            let option
            if (ganre == 10000) option = {
                include: [{
                    model: Ganre,
                    where: {},
                }],
                limit: limit,
                offset: offset,
                order: [['updatedAt', 'DESC']]
            };
            else option = {
                include: [{
                    model: Ganre,
                    where: {id: ganre},
                }],
                limit: limit,
                offset: offset,
                order: [['updatedAt', 'DESC']]
            };

            const torrents = await this.torrentModel.findAll(option);

            if (!torrents) throw new HttpException({
                message:`Нет ни одного торента, с такими параметрами запроса option:${option}`,
                statusCode: 404
            }, HttpStatus.NOT_FOUND)

            let option2
            if (ganre == 10000) option2 = {
                include: [{
                    model: Ganre,
                    where: {},
                }],
            };
            else option2 = {
                include: [{
                    model: Ganre,
                    where: {id: ganre},
                }],
            };
            const torrentsLength = await this.torrentModel.findAll(option2)

            if (!torrentsLength) throw new HttpException({
                message:`Нет ни одного торента, с такими параметрами запроса option:${option}`,
                statusCode: 404
            }, HttpStatus.NOT_FOUND)

            return {torrents, torrentsLength: torrentsLength.length}
        } catch (e) {
            console.log(e)
            throw new HttpException({
                message: 'Произошла ошибка',
                statusCode: 500
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}