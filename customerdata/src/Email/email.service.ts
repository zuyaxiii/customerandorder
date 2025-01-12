import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOrderConfirmationEmail(
    to: string,
    customerName: string,
    productName: string,
    quantity: number,
    totalPrice: number,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Order Confirmation',
      template: './order-confirmation',
      context: {
        customerName,
        productName,
        quantity,
        totalPrice,
      },
    });
  }
}