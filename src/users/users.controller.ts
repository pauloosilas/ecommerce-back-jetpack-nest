import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService){}

    @Get()
    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    findAll(){
        return this.usersService.findAll()
    }

    @Post()
    create(@Body() user: CreateUserDto){
       return this.usersService.create(user)
    }

    
    @Put(":id")
    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    update(@Param('id', ParseIntPipe) id, @Body() user: UpdateUserDto){
       return this.usersService.update(id, user) 
    }
    
    @Put('update/:id')
    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @UseInterceptors(FileInterceptor('file'))
    updateWithImage(
        @UploadedFile(
            new ParseFilePipe({
                validators:[
                    new MaxFileSizeValidator({maxSize: 1024*1024*10}),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)'})
                ]
            })
        ) file: Express.Multer.File, @Param('id', ParseIntPipe) id, @Body() user: UpdateUserDto
    ){
      return this.usersService.updateWithImage(file, id, user)
    }

}
