import { IsNotEmpty, Length, Matches, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @Length(2, 255, { message: 'Name must be between 2 and 50 characters' })
  name: string;

  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  @Length(10, 255, { message: 'Phone number must be between 10 and 15 digits' })
  phone: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}
