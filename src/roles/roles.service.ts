import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
    constructor(@InjectRepository(Rol) private rolesRepository: Repository<Rol>){}

    create(role: CreateRoleDto){
        const newRol = this.rolesRepository.create(role)
        return this.rolesRepository.save(newRol)
    }
}
