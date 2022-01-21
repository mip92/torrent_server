import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {CommentsUsers} from "./comments-users.model";
import {Torrent} from "../torrent/torrent.model";
import {TorrentModule} from "../torrent/torrent.module";

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    SequelizeModule.forFeature([User, CommentsUsers, Torrent]),
      TorrentModule
  ],
})
export class CommentsModule {}
