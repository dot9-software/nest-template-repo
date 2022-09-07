import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseStringPipe implements PipeTransform<string, string> {
  transform(value: string, _metadata: ArgumentMetadata): string {
    if (!value || value === 'undefined' || value === 'null') {
      throw new BadRequestException(
        `Validation failed, value was expected to be a valid string but was '${value}' instead`,
      );
    }
    return value;
  }
}
