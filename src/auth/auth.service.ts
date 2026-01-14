import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {


  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private readonly jwtService:JwtService,

    
  ){}

  async login(loginDto: LoginDto) {

    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (!user) throw new UnauthorizedException( 'User Unauthorized or Invalid credentials');
    const isPasswordValid = await bcrypt.compare( loginDto.password, user.password);
    if (!isPasswordValid) throw new ConflictException('Invalid password');

    //Gnerate token
    const accessTokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      tokenType: 'access',
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: '15m',
    });

    //Generate refresh token
    const refreshTokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      tokenType: 'refresh',
    };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '30m',
    });



    return {
      accessToken,
      exspiresIn_accessToken:"15m",
      refreshToken,
      exspiresIn_refreshToken:"30m",
    };
  }

  
  verifyToken(token: string) {
    try {
      const tokenVerify=this.jwtService.verify<JwtPayload>(token);
      const expDate=new Date(Number(tokenVerify.exp)*1000); //milli second

      const remainingTime=(expDate.getTime()-new Date().getTime()); //ms
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      //expDate millisecondga o`tkazilib keyin tekshirildi
      if(expDate<new Date()){
        return {message:"Token expired",date:new Date().toLocaleString()};
      }
      return {
        expDate:expDate.toLocaleString("uz-UZ"),
        dateNow:new Date().toLocaleString("uz-UZ"),
        remainingTime:`${hours}:${minutes}:${seconds}`,
        tokenType:tokenVerify.tokenType
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async refreshToken(token: string){
   
    try {
    //const refreshTokenVerify = this.jwtService.verify<JwtPayload>(token);
    const refreshTokenVerify =await this.jwtService.verifyAsync<JwtPayload>(token);
    if(new Date(Number(Number(refreshTokenVerify.exp)*1000))<new Date()){
      console.log(true); 
    }

    const accessTokenPayload = {
      id: refreshTokenVerify.id,
      username: refreshTokenVerify.username,
      email: refreshTokenVerify.email,
      tokenType: 'access',
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: '15m',
    });


    const refreshTokenPayload = {
      id: refreshTokenVerify.id,
      username: refreshTokenVerify.username,
      email: refreshTokenVerify.email,
      tokenType: 'refresh',
    };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '30m',
    });



    
      return {accessToken,refreshToken}
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }



 
}

export interface JwtPayload {
  id: number;
  username: string;
  email: string;
  tokenType: string;

  // iat, exp optional
  iat?: number;
  exp?: number;
}

 

