import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsOptional, IsString, Matches } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Product name is required' })
  product: string;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be greater than zero' })
  @Type(() => Number)
  quantity: number;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be greater than zero' })
  @Type(() => Number)
  price: number;

  @IsOptional() 
  @IsString({ message: 'File must be a string (URL)' }) 
  file?: string;

  @IsNotEmpty({ message: 'Customer ID is required' })
  @Type(() => Number)
  customerId: number; 
}
