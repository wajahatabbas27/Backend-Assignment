import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    // controllers: [UserController],
    // providers: [UserService],
})
export class UserModule { }
