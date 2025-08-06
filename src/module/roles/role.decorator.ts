import { SetMetadata } from "@nestjs/common";
import { Role } from "./role.enum";

export const ROLES_KES = 'roles'
export const Roles = (...roles: Role[]) => {
  return SetMetadata(ROLES_KES, roles);
};