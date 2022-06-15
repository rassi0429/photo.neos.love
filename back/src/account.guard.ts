import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import admin from 'firebase-admin';

@Injectable()
export class AccountGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.token;
    console.log('GUARD');
    if (!token) throw new BadRequestException();
    try {
      await admin.auth().verifyIdToken(token);
      // console.log(decoded.uid);
      return true;
    } catch {
      throw new BadRequestException('token');
    }
  }
}
