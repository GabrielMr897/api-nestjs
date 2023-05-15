import { Request } from 'express';
import { UserResponse } from 'src/modules/user/dto/user-response.dto';

export interface AuthRequest extends Request {
  user: UserResponse;
}
