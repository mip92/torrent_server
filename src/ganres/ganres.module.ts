import {forwardRef, Module} from '@nestjs/common';
import {GanresService} from './ganres.service';
import {GanresController} from "./ganres.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {Ganre} from "./ganres.model";
import {Torrent} from "../torrent/torrent.model";
import {TorrentGanres} from "./torrent-ganre.model";
import {FileService} from "../file/file.service";
import {AuthModule} from "../auth/auth.module";


@Module({
    controllers: [GanresController],
    providers: [GanresService, FileService],
    imports: [
        SequelizeModule.forFeature([Ganre, Torrent, TorrentGanres]),
        forwardRef(() => AuthModule),
    ],
    exports: [
        GanresService,
    ]
})
export class GanresModule {
}
