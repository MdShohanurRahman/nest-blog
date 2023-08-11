import { UserRole } from '../enums/user-role.enum';

export interface JwtPayload {
  sub: number;
  username: string;
  roles: UserRole[];
}
