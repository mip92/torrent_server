import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {RolesModule} from "../roles/roles.module";
import {User} from "./user.model";
import {CommentsUsers} from "../comments/comments-users.model";
import {AuthModule} from "../auth/auth.module";
import {TokenUser} from "../auth/token.model";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[
    SequelizeModule.forFeature([User, CommentsUsers, TokenUser]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [
    UsersService,
  ]
})
export class UsersModule {}
