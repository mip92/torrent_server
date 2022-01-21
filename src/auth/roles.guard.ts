import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLE_KEY} from "./roles-auth.decorator";
import * as jwt from "jsonwebtoken"

type IUser={
    email: string,
    id: number,
    role: string
}
@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector,) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles =this.reflector.get<string>(ROLE_KEY, context.getHandler())
            if (!requiredRoles){
                return true
            }
            const req = context.switchToHttp().getRequest()
            const authHeader = req.headers.authorization
            const bearer =authHeader.split(' ')[0]
            const token =authHeader.split(' ')[1]
            if(bearer !== "Bearer" || !token) throw new UnauthorizedException({message: "Пользователь не авторизован"})
            const user:any=jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            if(requiredRoles==user.role) return true
            else return false
        } catch (e) {
            throw new HttpException("Роль не подходит",HttpStatus.FORBIDDEN)
        }
    }
}