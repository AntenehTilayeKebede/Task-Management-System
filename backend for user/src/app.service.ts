import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Auth } from './typeorm/Auth';
import {Repository} from "typeorm";



@Injectable()
export class AppService {
    constructor(
        @InjectRepository(Auth) private readonly userRepository: Repository<Auth>
    ) {}

    async create(data: any): Promise<Auth> {
        return this.userRepository.save(data);
    }

    async findOne(condition: any): Promise<Auth | undefined> {
        return this.userRepository.findOne(condition);
    }

    async findOneByEmail(email: string): Promise<Auth | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }
}
