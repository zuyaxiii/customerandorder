import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

export class EncryptionService {
  private static readonly SECRET_KEY = process.env.SECRET_KEY || '';
  private static readonly IV_LENGTH = 16;
  private static readonly ALGORITHM = 'aes-256-cbc';
  
  private static validateKey(): Buffer {
    if (!this.SECRET_KEY) {
      throw new Error('กรุณาตั้งค่า SECRET_KEY');
    }

    if (this.SECRET_KEY.length !== 64) {
      throw new Error('Wrong');
    }

    return Buffer.from(this.SECRET_KEY, 'hex');
  }

  static encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(this.IV_LENGTH);
      const key = this.validateKey();
      
      const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
      const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'), 
        cipher.final()
      ]);

      return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    } catch (error) {
      throw new Error(`การเข้ารหัสล้มเหลว: ${error.message}`);
    }
  }

  static decrypt(encryptedData: string): string {
    try {
      const [ivHex, encryptedHex] = encryptedData.split(':');
      
      if (!ivHex || !encryptedHex) {
        throw new Error('รูปแบบข้อมูลที่เข้ารหัสไม่ถูกต้อง');
      }

      const iv = Buffer.from(ivHex, 'hex');
      const encrypted = Buffer.from(encryptedHex, 'hex');
      const key = this.validateKey();

      const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
      ]);

      return decrypted.toString('utf8');
    } catch (error) {
      throw new Error(`การถอดรหัสล้มเหลว: ${error.message}`);
    }
  }
}