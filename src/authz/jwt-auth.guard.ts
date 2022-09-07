import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UNCHECKED_ROUTES } from '../config';
import { UsersService } from '../users/users.service';
import {
  AuthClasses,
  authClassMetadataIdentifier,
} from './decorators/auth-classes';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    if (
      UNCHECKED_ROUTES.includes(context.switchToHttp().getRequest().route.path)
    ) {
      return true;
    }

    try {
      const canActivateParent = (await super.canActivate(context)) as boolean;
      if (!canActivateParent) return false;
    } catch (error) {
      console.error(error);
      return false;
    }

    // this is provided/set by the strategy
    const { userId }: { userId: string } = context
      .switchToHttp()
      .getRequest().user;

    const userData = await this.usersService.findOne(userId);

    // no user for this sub found
    if (!userData) return false;

    // TODO: is user in same org as requested?
    // IMPLEMENT HERE

    // is user archived? -> they are locked out
    if (userData.archived) return false;

    // admin overrides needed permission
    if (userData.isAdmin) return true;

    // auth class set via @__Endpoint Decorator
    // decorator on handler level overrides
    const authClass = this.reflector.getAllAndOverride<AuthClasses>(
      authClassMetadataIdentifier,
      [context.getHandler(), context.getClass()],
    );

    switch (authClass) {
      case AuthClasses.admin:
        return userData.isAdmin;

      case AuthClasses.backoffice:
        return userData.isBackoffice;

      case AuthClasses.instructor:
        return userData.isInstructor;

      // no AuthClass given
      default:
        return true;
    }
  }

  handleRequest(err: any, user: any) {
    if (err) console.error(err);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
