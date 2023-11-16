import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './typeorm/task';
import { UserModule } from './users/user.module';
import { Auth } from './typeorm/Auth';
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forRoot({
    type:'mysql',
    host:'localhost',
    port:3306,
    username:'sqluser',
    password:'password',
    database :'issue',
    entities:[Task, Auth] ,
    synchronize:true



  }), 
  
  TypeOrmModule.forFeature([Auth]),
  JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '1d'}
  }),
  
  UserModule] ,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
