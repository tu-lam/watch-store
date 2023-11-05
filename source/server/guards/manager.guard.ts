import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class ManagerGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.currentUser || request.currentUser.role !== 'manager') {
      throw new UnauthorizedException({ messageCode: 'unauthorized_err' });
    }

    return request.currentUser.role == 'manager';
  }
}
