import { Roles, User } from '@prisma/client';
import { PolicyHandlerCallback } from '../types/policy-handler.type';

export function RolesPolicy(...allowedRoles: Roles[]): PolicyHandlerCallback {
  return function (user: User) {
    return allowedRoles.some((allowedRole) => user?.role === allowedRole);
  };
}
