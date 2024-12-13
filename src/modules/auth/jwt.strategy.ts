import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromGrpcMetadata, // Custom extractor for gRPC metadata
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private static extractJwtFromGrpcMetadata(req: any): string | null {    
    if (!req || !req.metadata) {
      console.log('No metadata found in request');
      return null;
    }

    const authorization = req.metadata.get('authorization');

    if (authorization && authorization[0] && typeof authorization[0] === 'string') {
      const token = authorization[0];
      if (token.startsWith('Bearer ')) {
        return token.split(' ')[1];
      }
    }

    console.log('Authorization header missing or invalid');
    return null;
  }

  async validate(payload: { userId: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    return user;
  }
}
