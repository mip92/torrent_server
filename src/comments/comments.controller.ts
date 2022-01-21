import {Body, Controller, Post} from '@nestjs/common';
import {CreateCommentDto} from "./dto/create-comment.dto";
import {CommentsService} from "./comments.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Torrent} from "../torrent/torrent.model";
import {CommentsUsers} from "./comments-users.model";

@ApiTags("Комментарии")
@Controller('/comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}
    @ApiOperation({summary: "Добавление коментария"})
    @ApiResponse({status:200, type:CommentsUsers})
    @Post()
    addComment(@Body() dto: CreateCommentDto) {
        return this.commentsService.addComment(dto)
    }
}
