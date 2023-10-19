import {
  NestMiddleware,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { AuthService } from '../auth.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      if (!authorization || authorization.trim() === '') {
        return next();
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      console.log(authToken);
      const decoded = this.authService.validateToken(authToken);
      if (!decoded) {
        throw new UnauthorizedException({ messageCode: 'invalid_token_err' });
      }

      const user = await this.usersService.findOne(+decoded.sub);
      if (!user) {
        throw new UnauthorizedException({ messageCode: 'invalid_token_err' });
      }
      req.currentUser = user;
      next();
    } catch (error) {
      console.log(error);
      next();
    }
  }
}
