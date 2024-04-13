import { Controller, Get } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { Policies } from 'src/iam/authorization/guards/policy.guard';
import { PermissionsPolicy } from 'src/iam/authorization/policies/permissions.policy';
import { RestrictEmailPolicy } from 'src/iam/authorization/policies/restrict-email.policy';
import { RolesPolicy } from 'src/iam/authorization/policies/roles.policy';
import { PermissionActions } from 'src/iam/authorization/types/permission-actions.type';
import { PermissionResources } from 'src/iam/authorization/types/permission-resources.type';

@Controller('cats')
export class CatsController {
  @Get()
  @Policies(
    new RestrictEmailPolicy(),
    RolesPolicy(Roles.Regular),
    PermissionsPolicy([PermissionActions.Update], PermissionResources.Cats),
  )
  getCats() {
    return { name: 'Jerry' };
  }
}
