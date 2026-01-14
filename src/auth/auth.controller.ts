import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("verify")
  verifyToken(@Body("token") accessToken:string){
    return this.authService.verifyToken(accessToken)
  }

  @Post("refresh")
  refreshToken(@Body("refreshToken") refreshToken:string){
    return this.authService.refreshToken(refreshToken)
  }

 
}
