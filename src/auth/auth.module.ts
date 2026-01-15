import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports:[UserModule, //for user
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        
      }),
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}



/*
@Module({
  imports:[UserModule,
    JwtModule.register({
      secret: 'bu-juda-kuchli-secret-key-32ta-belgidan-kop-bolishi-kerak',
      //signOptions: {  expiresIn: '1d'  },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}



ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    })

*/
