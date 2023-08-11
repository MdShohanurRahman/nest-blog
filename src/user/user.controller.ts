import { Controller, Get, Param } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';

@Controller('api/v1/users')
export class UserController {
  @Get()
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    return 'all-users';
  }

  @Get(':id')
  getUser(@Param('id') id: number) {
    return 'user by id ' + id;
  }
}
