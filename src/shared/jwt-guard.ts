import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const metadata = context.getArgByIndex(1); // Extract metadata directly
    if (!metadata || !metadata.get) {
      throw new UnauthorizedException('Metadata not found');
    }

    const authHeader = metadata.get('authorization')?.[0];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify the token
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });

      // Attach user to metadata
      metadata.set('user', payload?.userId); // Attach user or userId to metadata
      return true;
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
