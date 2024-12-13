import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { JwtAuthGuard } from './shared/jwt-guard';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PrismaModule,AuthModule,],
  controllers: [],
  providers: [JwtAuthGuard],
})
export class AppModule {}
