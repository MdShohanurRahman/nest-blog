import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/login-request.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { PublicRoute } from '../decorators/public-route.decorator';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @PublicRoute()
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    return this.authService.register(registerRequestDto);
  }

  @Post('login')
  @PublicRoute()
  async login(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.login(
      loginRequestDto.email,
      loginRequestDto.password,
    );
  }
}
