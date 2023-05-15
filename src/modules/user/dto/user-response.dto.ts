import { RoleRequestUser } from 'src/modules/role/dto/role-request.dto';

export class UserResponse {
  id: number;

  nameR: string;

  roles: RoleRequestUser[];
}
