import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import storage = require("./../utils/cloud_storage")

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository:Repository<User>){}


        create(user: CreateUserDto){
            const newUser = this.usersRepository.create(user);
            return this.usersRepository.save(newUser);
        }

        async findAll(){
          return  this.usersRepository.find({ relations: ['roles']})
        }

      async update(id: number, user: UpdateUserDto){
          const userFound = await this.usersRepository.findOneBy({id: id})

          if(!userFound){
            throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND)
          }

          const updatedUser = Object.assign(userFound, user)
          return this.usersRepository.save(updatedUser)
        }

      async updateWithImage(file: Express.Multer.File, id:number, user:UpdateUserDto ){
        const userFound = await this.usersRepository.findOneBy({id: id})

        if(!userFound){
          throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND)
        }       

        const url = await storage(file, file.originalname)

        if(url === undefined && url === null)  {
          throw new HttpException("Não foi possival guardar a imagem", HttpStatus.INTERNAL_SERVER_ERROR)
        }

        user.image = url;
       
        if(!userFound){
          throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND)
        }

        const updatedUser = Object.assign(userFound, user)
        return this.usersRepository.save(updatedUser)
      }
}
