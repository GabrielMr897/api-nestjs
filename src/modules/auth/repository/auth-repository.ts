import { UserRole } from 'src/modules/role/enum/userRoles';
import { UserResponse } from 'src/modules/user/dto/user-response.dto';
import { UserFromJwt } from 'src/modules/user/models/user-from-jwt';

export abstract class AuthRepository {
  abstract validateUser(name: string, password: string): Promise<UserResponse>;
  abstract validateRoles(
    user: UserFromJwt,
    requiredRoles: UserRole[],
  ): Promise<boolean>;
}
