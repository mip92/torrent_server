import {SetMetadata} from "@nestjs/common";

export const ROLE_KEY = 'roles';

export const RoleDecorator = (role: string) => {
    return SetMetadata(ROLE_KEY, role)
}