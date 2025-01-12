import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Customers } from './Customer/customers.entity';
import { CustomersModule } from './Customer/customers.module';
import { Orders } from './Orders/orders.entity';
import { OrdersModule } from './Orders/orders.module';
import { AuthModule } from './Authentication/auth.module';
import { EmailModule } from './Email/email.module';
import { DropboxModule } from './Utils/dropbox/dropbox.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Customers, Orders],
      synchronize: true,
      timezone: '+07:00',
    }),
    CustomersModule,
    OrdersModule,
    AuthModule,
    EmailModule,
    DropboxModule
  ],
})
export class AppModule {}