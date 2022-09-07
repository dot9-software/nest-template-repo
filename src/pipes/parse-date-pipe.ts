import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';

@Injectable()
export class ParseOptionalDatePipe
  implements PipeTransform<string, dayjs.Dayjs>
{
  transform(value: string, _metadata: ArgumentMetadata): dayjs.Dayjs {
    if (value == null) {
      // if value is null or undefined, we should return that exact value, since null and undefined are sematically different
      return value as null | undefined;
    }
    if (!dayjs(value).isValid()) {
      throw new BadRequestException(`Expected valid date, got ${value}`);
    }
    return dayjs(value);
  }
}
