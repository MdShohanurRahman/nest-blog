import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { LoginResponseDto } from './dtos/login-response.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(userName: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(userName);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else return null;
  }

  async generateToken(user: User, options?: JwtSignOptions) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.email,
      roles: user.roles,
    };
    return this.jwtService.sign(payload, options);
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user: User = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const access_token: string = await this.generateToken(user);
    const refresh_token: string = await this.generateToken(user, {
      expiresIn: '7d',
    });
    return { access_token, refresh_token };
  }

  async register(registerRequestDto: RegisterRequestDto) {
    return await this.userService.registerUser(registerRequestDto);
  }
}
