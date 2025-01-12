import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  BadRequestException, 
  Query, 
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
  Req
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customers } from './customers.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from 'src/Authentication/jwt-auth.guard';
import { Request } from 'express'; 

@Controller('customers')
@UseGuards(JwtAuthGuard) 
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(): Promise<Customers[]> {
    return this.customersService.findAll();
  }

  @Get('list')
  async findWithLimit(
    @Req() req: Request,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    try {
      
      if (limit < 1) limit = 10;
      if (page < 1) page = 1;
      if (limit > 100) limit = 100;

      const result = await this.customersService.findJsonWithLimit(limit, page);
      const decodedData = await Promise.all(result.data.map(async (customer) => ({
        id: customer.id,
        name: customer['_name'] ? await this.customersService.decryptField(customer['_name']) : null,
        phone: customer['_phone'] ? await this.customersService.decryptField(customer['_phone']) : null,
        email: customer.email,
        orders: customer.orders
      })));

      return {
        success: true,
        data: decodedData,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: limit
        }
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/list/:id')
  async findJasonOne(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number
  ) {
    try {
      console.log('User accessing customer details:', req.user);
      
      const customer = await this.customersService.findJasonOne(id);
      return {
        success: true,
        data: {
          id: customer.id,
          name: customer['_name'] ? await this.customersService.decryptField(customer['_name']) : null,
          phone: customer['_phone'] ? await this.customersService.decryptField(customer['_phone']) : null,
          email: customer.email,
          orders: customer.orders
        }
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Customers | null> {
    const parsedId = Number(id);

    if (isNaN(parsedId) || parsedId <= 0) {
      throw new BadRequestException('Invalid customer ID. It must be a positive number.');
    }

    return this.customersService.findOne(parsedId);
  }

  @Post()
  async create(
    @Req() req: Request,
    @Body() createCustomerDto: CreateCustomerDto
  ) {
    try {
      console.log('User creating customer:', req.user);
      
      const customer = await this.customersService.create(createCustomerDto);
      return {
        success: true,
        data: {
          id: customer.id,
          email: customer.email,
          name: customer['_name'] ? await this.customersService.decryptField(customer['_name']) : null,
          phone: customer['_phone'] ? await this.customersService.decryptField(customer['_phone']) : null
        }
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    try {
      console.log('User updating customer:', req.user);
      
      const customer = await this.customersService.update(id, updateCustomerDto);
      return {
        success: true,
        data: {
          id: customer.id,
          email: customer.email,
          name: customer['_name'] ? await this.customersService.decryptField(customer['_name']) : null,
          phone: customer['_phone'] ? await this.customersService.decryptField(customer['_phone']) : null
        }
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async remove(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number
  ) {
    try {
      console.log('User deleting customer:', req.user);
      
      await this.customersService.remove(id);
      return {
        success: true,
        message: 'Customer deleted successfully'
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  
}
