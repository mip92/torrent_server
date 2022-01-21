import {Module} from '@nestjs/common';
import {FileModule} from "./file/file.module";
import {TorrentModule} from "./torrent/torrent.module";
import * as path from "path"
import {ServeStaticModule} from "@nestjs/serve-static";
import {ConfigModule} from "@nestjs/config";
import { SequelizeModule } from '@nestjs/sequelize';
import {Torrent} from "./torrent/torrent.model";
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import {User} from "./users/user.model";
import {Role} from "./roles/roles.model";
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import {CommentsUsers} from "./comments/comments-users.model";
import { GanresModule } from './ganres/ganres.module';
import {Ganre} from "./ganres/ganres.model";
import {TorrentGanres} from "./ganres/torrent-ganre.model";
import {TokenUser} from "./auth/token.model";
import {MailModule} from "./email/email.module";
import {RecoverPassword} from "./auth/recoverPassword.model";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath:`.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [Torrent, User, Role, CommentsUsers, Ganre, TorrentGanres, TokenUser, RecoverPassword],
            autoLoadModels: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
        }),
        TorrentModule,
        FileModule,
        UsersModule,
        RolesModule,
        AuthModule,
        CommentsModule,
        GanresModule,
        MailModule,
    ],
})
export class AppModule {
}
