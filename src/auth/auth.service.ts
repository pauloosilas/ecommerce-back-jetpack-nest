import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Rol) private roleRepository:Repository<Rol>,
        private jwtService: JwtService){}

    async register(user: RegisterAuthDto){
        const emailExist = await this.usersRepository.findOneBy({email: user.email})

        if(emailExist){
            return new HttpException("O email já está sendo utilizado", HttpStatus.CONFLICT);
        }

        const phoneExist = await this.usersRepository.findOneBy({phone: user.phone})
      
        if(phoneExist){
            return new HttpException("O celular já está sendo utilizado", HttpStatus.CONFLICT);
        }

        const newUser = this.usersRepository.create(user);
      
        let rolesIds = ["CLIENT"]
      
        if(user.rolesIds !== undefined && user.rolesIds !== null){
            rolesIds = user.rolesIds;
        }

        const roles = await this.roleRepository.findBy({id: In(rolesIds)})

        newUser.roles = roles

        const userSaved = await this.usersRepository.save(newUser)
        const rolesString = userSaved.roles.map(role => role.id)

        const payload = {
            id: userSaved.id,
             name: userSaved.name,
            roles:rolesString
        };
        const token = this.jwtService.sign(payload)

        delete userSaved.password;
        const data = {
            user: userSaved,
            token: "Bearer "+token
        }

        return data
    }

    async login(loginData: LoginAuthDto){
        const { email, password } = loginData
        const userFound = await this.usersRepository.findOne({ 
            where: {
                email
            },
            relations: ['roles']
         })

        if(!userFound){
            throw new HttpException("Email nao encontrado", HttpStatus.NOT_FOUND)
        }

        const isPasswordValid = await compare(password, userFound.password);
        if(!isPasswordValid){
            throw new HttpException("Senha incorreta", HttpStatus.FORBIDDEN)
        }

        const rolesIds = userFound.roles.map(rol => rol.id)

        const payload = {id: userFound.id, name: userFound.name, roles: rolesIds};
        const token = this.jwtService.sign(payload)

        delete userFound.password;

        const data = {
            user: userFound,
            token: "Bearer "+token
        }

        return data
    }
}
