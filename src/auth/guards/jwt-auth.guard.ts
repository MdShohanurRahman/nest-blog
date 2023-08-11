import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../enums/user-role.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const jwtToken = this.extractJwtToken(request);

    if (!jwtToken) {
      throw new UnauthorizedException();
    }
    try {
      const decoded = this.jwtService.verify(jwtToken, {
        secret: `${process.env.jwt_secret}`,
      });
      request.user = decoded;
      const roles = this.reflector.get<UserRole[]>(
        'roles',
        context.getHandler(),
      );
      if (!roles || roles.length === 0) {
        return true;
      }
      const hasRole = roles.some((role) => decoded.roles?.includes(role));
      if (!hasRole) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }

  private extractJwtToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }
}
