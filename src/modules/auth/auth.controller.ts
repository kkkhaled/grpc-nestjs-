import { Controller, UseGuards, Req } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/shared/jwt-guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  async register(data: RegisterDto) {
    return this.authService.register(data);
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginDto) {
    return this.authService.login(data);
  }

  @GrpcMethod('AuthService', 'GetUserById')
  @UseGuards(JwtAuthGuard) 
   async getUserById(data: any, metadata: any) {
    
    const user = metadata.get('user'); // Retrieve user from metadata

    console.log("user", user);
    

    if (!user || user.length === 0) {
      throw new Error('User not found in metadata');
    }

    const userId = user[0]; // Extract userId from the metadata array
    console.log('Extracted UserId:', userId);
    

    return this.authService.getUserById(userId);
  }
}
