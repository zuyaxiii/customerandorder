import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Orders } from 'src/Orders/orders.entity';
import { EncryptionService } from 'src/Utils/encryption.util';
import { Expose } from 'class-transformer';

@Entity()
export class Customers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  private _name: string;

  @Column()
  private _phone: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Orders, (order) => order.customer)
  orders: Orders[];

  set name(value: string) {
    this._name = EncryptionService.encrypt(value);
  }

  @Expose() 
  get name(): string {
    return EncryptionService.decrypt(this._name);
  }

  set phone(value: string) {
    this._phone = EncryptionService.encrypt(value);
  }

 @Expose() 
  get phone(): string {
    return EncryptionService.decrypt(this._phone);
  }

  @BeforeInsert()
  @BeforeUpdate()
  private encryptFields() {
    if (this._name) {
      this._name = EncryptionService.encrypt(this._name);
    }
    if (this._phone) {
      this._phone = EncryptionService.encrypt(this._phone);
    }
  }  }