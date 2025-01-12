import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value);
    if (isNaN(val) || val <= 0) {
      throw new BadRequestException('ID must be a positive number');
    }
    return val;
  }
}