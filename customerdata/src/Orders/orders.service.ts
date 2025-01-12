import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from './orders.entity';
import { CreateOrderDto } from './DTO/create-order.dto';
import { UpdateOrderDto } from './DTO/update-order.dto';
import { EmailService } from 'src/Email/email.service';
import { Customers } from 'src/Customer/customers.entity';
import { DropboxService } from 'src/Utils/dropbox/dropbox.service';

@Injectable()
export class OrdersService {


  constructor(
    @InjectRepository(Orders)
    private readonly orderRepository: Repository<Orders>,
    @InjectRepository(Customers)
    private readonly customerRepository: Repository<Customers>,
    private readonly emailService: EmailService,
    private readonly dropboxService: DropboxService,
  ) { }

  async create(createOrderDto: CreateOrderDto, file?: Express.Multer.File): Promise<Orders> {
    const { product, quantity, price, customerId } = createOrderDto;

    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    let uploadedFileUrl: string | null = null;

    if (file) {
      try {
        uploadedFileUrl = await this.dropboxService.uploadFile(file);
        createOrderDto.file = uploadedFileUrl;
      } catch (error) {
        throw new BadRequestException(`Failed to upload file: ${error.message}`);
      }
    }

    const order = this.orderRepository.create({
      ...createOrderDto,
      customer,
    });

    const savedOrder = await this.orderRepository.save(order);

    if (!customer.email) {
      throw new NotFoundException('Customer email not found');
    }

    await this.emailService.sendOrderConfirmationEmail(
      customer.email,
      customer.name,
      product,
      quantity,
      price * quantity,
    );

    return savedOrder;
  }

  findAll(): Promise<Orders[]> {
    return this.orderRepository.find({ relations: ['customer'] });
  }

  findOne(id: number): Promise<Orders | null> {
    return this.orderRepository.findOne({ where: { id }, relations: ['customer'] });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Orders> {
    const existingOrder = await this.orderRepository.findOne({ where: { id } });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    const updatedData = {
      ...updateOrderDto,
      file: typeof updateOrderDto.file === 'string' ? updateOrderDto.file : '',
    };

    const updatedOrder = this.orderRepository.merge(existingOrder, updatedData);
    return this.orderRepository.save(updatedOrder);
  }

  async remove(id: number): Promise<void> {
    const existingOrder = await this.orderRepository.findOne({ where: { id } });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    await this.orderRepository.remove(existingOrder);
  }
}
