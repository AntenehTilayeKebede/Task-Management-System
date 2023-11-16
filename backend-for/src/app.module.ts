import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks.module';
import { ColumnsModule } from './columns.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'sqluser',
      password: 'password',
      database: 'issue',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],

      synchronize: true,
    }),
    TasksModule,
    ColumnsModule,
  ],
})
export class AppModule {}


