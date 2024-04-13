import { ForbiddenException } from '@nestjs/common';
import { PermissionScope, User } from '@prisma/client';
import { PermissionActions } from '../types/permission-actions.type';
import { PermissionResources } from '../types/permission-resources.type';
import { PolicyHandlerCallback } from '../types/policy-handler.type';

export function PermissionsPolicy(
  actions: PermissionActions[],
  resource: PermissionResources,
): PolicyHandlerCallback {
  return function (user: User & { scopes: PermissionScope[] }) {
    actions.forEach((action) => {
      const hasAccess = user?.scopes
        ?.map((s) => s.name)
        ?.includes(`${action}_${resource}`);

      if (!hasAccess) {
        throw new ForbiddenException(
          `You must have <${action.toLowerCase()} ${resource.toLowerCase()}> permission`,
        );
      }
    });

    return true;
  };
}
