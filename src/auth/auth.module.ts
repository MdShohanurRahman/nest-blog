import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { LocalAuthStrategies } from './strategies/local-auth-strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtAuthStrategy } from './strategies/jwt-auth-strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  providers: [
    AuthService,
    UserService,
    LocalAuthStrategies,
    JwtAuthStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: `${process.env.jwt_secret}`,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
})
export class AuthModule {}
