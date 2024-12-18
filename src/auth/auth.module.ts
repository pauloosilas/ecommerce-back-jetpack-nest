import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { RolesService } from 'src/roles/roles.service';
import { Rol } from 'src/roles/rol.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, Rol]),
  JwtModule.register({
    secret: "SECRET123@5",
    signOptions: {expiresIn:'7d'}
  }),],
  providers: [AuthService, JwtStrategy, RolesService],
  controllers: [AuthController]
})
export class AuthModule {}
