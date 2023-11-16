import { BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from 'express';

@Controller('api')
export class AppController {
    constructor(
        private readonly appService: AppService,
        private jwtService: JwtService
    ) {}

    @Post('register')
    async register(
        @Body('fullName') fullName: string,
        @Body('username') username: string,
        @Body('companyName') companyName: string,
        @Body('email') email: string,
        @Body('password') password: string
    ) {
        try {
            if (!password || password.trim() === '') {
                throw new BadRequestException('Password is required');
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = await this.appService.create({
                fullName,
                username,
                companyName,
                email,
                password: hashedPassword
            });

            delete user.password;

            return user;
        } catch (error) {
            throw new BadRequestException('Registration failed');
        }
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response
    ) 
    
    {
        try {
          const user = await this.appService.findOneByEmail(email); 

            if (!user) {
                throw new BadRequestException('Invalid credentials');
            }

            if (!await bcrypt.compare(password, user.password)) {
                throw new BadRequestException('Invalid credentials');
            }

            const jwt = await this.jwtService.signAsync({id: user.id});

            response.cookie('jwt', jwt, {httpOnly: true});

            return {
                message: 'Success'
            };
        } catch (e) {
            throw new UnauthorizedException('Unauthorized');
        }
    }

    @Get('user')
    async user(@Req() request: Request) {
        try {
            const cookie = request.cookies['jwt'];

            const data = await this.jwtService.verifyAsync(cookie);

            if (!data) {
                throw new UnauthorizedException();
            }

            const user = await this.appService.findOne({id: data['id']});

            const {password, ...result} = user;

            return result;
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    @Post('logout')
    async logout(@Res() response: Response): Promise<void> {
      
      response.clearCookie('jwt');
  
      
      response.status(200).json({ message: 'Success' });
    }
  }
  