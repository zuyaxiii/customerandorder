import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Orders } from './orders.entity';
import { CreateOrderDto } from './DTO/create-order.dto';
import { UpdateOrderDto } from './DTO/update-order.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DropboxService } from 'src/Utils/dropbox/dropbox.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly dropboxService: DropboxService,
  ) { }

  @Get()
  findAll(): Promise<Orders[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Orders | null> {
    const order = await this.ordersService.findOne(+id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  @Post()
@UseInterceptors(FileInterceptor('file'))
async create(
  @Body() createOrderDto: CreateOrderDto,
  @UploadedFile() file: Express.Multer.File,
) {
  if (!file) {
    throw new BadRequestException('File is required');
  }

  const uploadedFileUrl = await this.dropboxService.uploadFile(file);
  const orderData = { ...createOrderDto, file: uploadedFileUrl };
  const order = await this.ordersService.create(orderData);

  return {
    message: 'Order created successfully',
    order,
  };
}

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      const fileUrl = await this.dropboxService.uploadFile(file);
      updateOrderDto.file = fileUrl;
    }

    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ordersService.remove(+id);
  }
}
