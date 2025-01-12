import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './orders.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { EmailModule } from 'src/Email/email.module';
import { Customers } from 'src/Customer/customers.entity';
import { CustomersModule } from 'src/Customer/customers.module';
import { DropboxModule } from 'src/Utils/dropbox/dropbox.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
    imports: [
        TypeOrmModule.forFeature([Orders, Customers]),
        forwardRef(() => EmailModule),
        CustomersModule,
        DropboxModule,
        MulterModule.register({
            storage: memoryStorage(),
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
            fileFilter: (req, file, cb) => {
                if (file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf|docx|xlsx|plain)$/)) {
                    cb(null, true);
                } else {
                    cb(new Error('Only specific file types are allowed!'), false);
                }
            },
        }),
    ],
    providers: [OrdersService],
    controllers: [OrdersController],
    exports: [OrdersService],
})
export class OrdersModule { }
