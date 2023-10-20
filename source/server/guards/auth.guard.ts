import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/users/auth.service';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization }: any = request.headers;
    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException({ messageCode: 'empty_token_err' });
    }
    const authToken = authorization.replace(/bearer/gim, '').trim();
    return !!authToken; 
  }
}
