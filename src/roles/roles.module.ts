import {forwardRef, Module} from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {User} from "../users/user.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports:[
    SequelizeModule.forFeature([Role, User]),
    forwardRef(() => AuthModule),
  ],
  exports:[
    RolesService
  ]
})
export class RolesModule {}
