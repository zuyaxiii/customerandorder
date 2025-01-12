import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Customers } from 'src/Customer/customers.entity';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column()
  quantity: number;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  file: string;

  @ManyToOne(() => Customers, (customer) => customer.orders, { onDelete: 'CASCADE' })
  customer: Customers;
}
