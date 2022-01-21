import {Injectable,} from '@nestjs/common';
import {CreateCommentDto} from "./dto/create-comment.dto";
import {InjectModel} from "@nestjs/sequelize";
import {CommentsUsers} from "./comments-users.model";
import {TorrentService} from "../torrent/torrent.service";


@Injectable()
export class CommentsService {
    constructor(@InjectModel(CommentsUsers) private commentModel: typeof CommentsUsers,
                private torrentService: TorrentService) {
    }

    async addComment(dto: CreateCommentDto) {
        const comment = await this.commentModel.create(dto)
        return comment
    }
}
