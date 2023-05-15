import { UserRole } from 'src/modules/role/enum/userRoles';
import { UserFromJwt } from 'src/modules/user/models/user-from-jwt';

export abstract class AuthRepository {
  abstract validateRoles(
    user: UserFromJwt,
    requiredRoles: UserRole[],
  ): Promise<boolean>;
}
