import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customers } from './customers.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { EncryptionService } from 'src/Utils/encryption.util';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customers)
    private customerRepository: Repository<Customers>,
  ) { }

  async findDecoded(limit?: number): Promise<any[]> {
    const take = limit && !isNaN(limit) ? limit : 10;
    const customers = await this.customerRepository.find({
      take,
      relations: ['orders'],
    });

    return customers.map((customer) => {
      try {
        if (!customer['_name'] || !customer['_phone']) {
          throw new Error('Missing encrypted fields');
        }

        return {
          id: customer.id,
          name: EncryptionService.decrypt(customer['_name']),
          phone: EncryptionService.decrypt(customer['_phone']),
          email: customer.email,
          orders: customer.orders,
        };
      } catch (error) {
        console.error(`Failed to decrypt customer ${customer.id}:`, error.message);
        return {
          id: customer.id,
          name: null,
          phone: null,
          email: customer.email,
          orders: customer.orders,
        };
      }
    });
  }

  async findAll() {
    return this.customerRepository.find({ relations: ['orders'] });
  }

  async findOne(id: number) {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid ID provided');
    }
    return this.customerRepository.findOne({ where: { id }, relations: ['orders'] });
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customers> {
    const existingCustomer = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new BadRequestException('Email already exists');
    }

    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customers> {
    const customer = await this.customerRepository.findOne({ where: { id } });
  
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
  
    const updatedCustomer = {
      ...customer,
      ...updateCustomerDto,
      _name: updateCustomerDto.name
        ? EncryptionService.encrypt(updateCustomerDto.name)
        : customer['_name'],
      _phone: updateCustomerDto.phone
        ? EncryptionService.encrypt(updateCustomerDto.phone)
        : customer['_phone'],
    };
  
    try {
      return await this.customerRepository.save(updatedCustomer);
    } catch (error) {
      throw new BadRequestException('Failed to update customer: ' + error.message);
    }
  }

  async remove(id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid ID provided');
    }

    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    await this.customerRepository.remove(customer);
  }

  async findJasonOne(id: number): Promise<Customers> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async findJsonWithLimit(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;

    const [customers, total] = await this.customerRepository.findAndCount({
      take: limit,
      skip: skip,
      order: {
        id: 'DESC'
      }
    });

    return {
      data: customers,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async decryptField(encryptedValue: string): Promise<string | null> {
    try {
      return EncryptionService.decrypt(encryptedValue);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
}