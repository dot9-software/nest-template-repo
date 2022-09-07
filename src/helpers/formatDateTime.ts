import Timezone from 'timezone-enum';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDate(timezone: Timezone, date?: Date | string): string {
  return dayjs(date).tz(timezone).format('DD.MM.YYYY');
}

export function formatTime(timezone: Timezone, date: Date): string {
  return dayjs(date).tz(timezone).format('HH:mm');
}
