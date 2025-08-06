import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../role.enum";
import { ROLES_KES } from "../role.decorator";

@Injectable()
export class RoleGuard implements CanActivate 
{
    constructor(private reflector: Reflector) {}

    canActivate(context:ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KES,
            [context.getHandler(), context.getClass()],
        );
        if(!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user || !user.roles) {
           throw new ForbiddenException('Access denied - No roles found');
        }
        return requiredRoles.some((role) => user.roles?.includes(role));
        }
}