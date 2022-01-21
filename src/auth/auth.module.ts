import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UsersModule} from "../users/users.module";
/*import {JwtModule} from "@nestjs/jwt";*/
import {FileService} from "../file/file.service";
import {TorrentModule} from "../torrent/torrent.module";
import {GanresModule} from "../ganres/ganres.module";
import {SequelizeModule} from "@nestjs/sequelize";

import {TokenUser} from "./token.model";
import {MailService} from "../email/email.service";
import {RecoverPassword} from "./recoverPassword.model";

@Module({
    providers: [AuthService, FileService, MailService],
    controllers: [AuthController],
    imports: [
        SequelizeModule.forFeature([TokenUser, RecoverPassword]),
        forwardRef(() => UsersModule),
        forwardRef(() => TorrentModule),
        forwardRef(()=>AuthModule),
        forwardRef(()=>GanresModule),

    ],
    exports:
        [
            AuthService,
        ]
})

export class AuthModule {
}
