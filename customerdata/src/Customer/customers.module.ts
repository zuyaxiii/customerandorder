import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from './customers.entity';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { AuthModule } from 'src/Authentication/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customers]), AuthModule],
  providers: [CustomersService],
  controllers: [CustomersController],
  exports: [TypeOrmModule],
})
export class CustomersModule { }
